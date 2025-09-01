import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import AdminModeratorService from '../../services/adminService';

const PaymentAnalytics = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [paymentStatuses, setPaymentStatuses] = useState([]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch transaction types and payment statuses
        const [types, paymentStatuses] = await Promise.all([
          AdminModeratorService.getTransactionTypes(),
          AdminModeratorService.getPaymentStatuses()
        ]);

        setTransactionTypes(types);
        setPaymentStatuses(paymentStatuses);

        // Fetch initial transactions
        const response = await AdminModeratorService.getFilteredTransactions({
          page: currentPage - 1,
          size: itemsPerPage
        });
        
        setTransactions(response.content);
        setFilteredTransactions(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching initial data:', AdminModeratorService.handleError(error));
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch filtered transactions
  useEffect(() => {
    const fetchFilteredTransactions = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage - 1,
          size: itemsPerPage,
          searchTerm: searchTerm || undefined,
          type: typeFilter !== 'ALL' ? typeFilter : undefined,
          paymentStatus: paymentStatusFilter !== 'ALL' ? paymentStatusFilter : undefined,
          startDate: dateRange.start ? new Date(dateRange.start).toISOString() : undefined,
          endDate: dateRange.end ? new Date(dateRange.end).toISOString() : undefined
        };

        const response = await AdminModeratorService.getFilteredTransactions(params);
        setFilteredTransactions(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching filtered transactions:', AdminModeratorService.handleError(error));
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredTransactions();
  }, [searchTerm, typeFilter, paymentStatusFilter, dateRange, currentPage]);

  // Fetch analytics stats
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    pendingPayments: 0,
    refundedAmount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const params = {
          searchTerm: searchTerm || undefined,
          type: typeFilter !== 'ALL' ? typeFilter : undefined,
          paymentStatus: paymentStatusFilter !== 'ALL' ? paymentStatusFilter : undefined,
          startDate: dateRange.start ? new Date(dateRange.start).toISOString() : undefined,
          endDate: dateRange.end ? new Date(dateRange.end).toISOString() : undefined
        };

        const response = await AdminModeratorService.getPaymentStats(params);
        setStats(response);
      } catch (error) {
        console.error('Error fetching stats:', AdminModeratorService.handleError(error));
      }
    };

    fetchStats();
  }, [searchTerm, typeFilter, paymentStatusFilter, dateRange]);

  // Export CSV
  const exportData = async () => {
    try {
      const params = {
        searchTerm: searchTerm || undefined,
        type: typeFilter !== 'ALL' ? typeFilter : undefined,
        paymentStatus: paymentStatusFilter !== 'ALL' ? paymentStatusFilter : undefined,
        startDate: dateRange.start ? new Date(dateRange.start).toISOString() : undefined,
        endDate: dateRange.end ? new Date(dateRange.end).toISOString() : undefined
      };

      const response = await AdminModeratorService.exportTransactions(params);
      const blob = new Blob([response], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookhive-payment-analytics-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting transactions:', AdminModeratorService.handleError(error));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('ALL');
    setPaymentStatusFilter('ALL');
    setDateRange({ start: '', end: '' });
    setCurrentPage(1);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500 text-white';
      case 'PENDING': return 'bg-yellow-400 text-white';
      case 'FAILED': return 'bg-red-500 text-white';
      case 'REFUNDED': return 'bg-slate-200 text-slate-600';
      case 'ACTIVE': return 'bg-blue-500 text-white';
      case 'CANCELLED': return 'bg-red-500 text-white';
      case 'OVERDUE': return 'bg-orange-500 text-white';
      default: return 'bg-slate-200 text-slate-600';
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'SALE': return 'bg-blue-500 text-white';
      case 'LOAN': return 'bg-yellow-400 text-white';
      case 'DONATION': return 'bg-green-500 text-white';
      case 'AUCTION': return 'bg-purple-500 text-white';
      default: return 'bg-slate-200 text-slate-600';
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading payment analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Payment Analytics</h1>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `LKR ${stats.totalRevenue.toLocaleString()}`, change: '+12.5% from last month', icon: CurrencyDollarIcon, color: 'bg-blue-500 text-white' },
          { label: 'Total Transactions', value: stats.totalTransactions, change: '+8.3% from last month', icon: ChartBarIcon, color: 'bg-yellow-400 text-white' },
          { label: 'Pending Payments', value: stats.pendingPayments, change: 'Requires attention', icon: CalendarIcon, color: 'bg-orange-500 text-white' },
          { label: 'Refunded Amount', value: `LKR ${stats.refundedAmount.toLocaleString()}`, change: 'Total refunds issued', icon: BanknotesIcon, color: 'bg-slate-500 text-white' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  <p className={`text-sm ${stat.label === 'Pending Payments' ? 'text-orange-500' : stat.label === 'Refunded Amount' ? 'text-slate-500' : 'text-green-500'} font-medium mt-2`}>{stat.change}</p>
                </div>
                <div className={`p-4 rounded-xl shadow-md ${stat.color}`}>
                  <Icon className="w-7 h-7" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FunnelIcon className="w-6 h-6 text-blue-500" />
            Filters & Search
          </h3>
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
          >
            Clear All Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-3 w-full border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Types</option>
            {transactionTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
          >
            <option value="ALL">All Payment Status</option>
            {paymentStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              placeholder="Start Date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
            <input
              type="date"
              className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              placeholder="End Date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
          <p className="text-slate-600">
            Showing <span className="font-semibold text-blue-600">{filteredTransactions.length}</span> of <span className="font-semibold">{stats.totalTransactions}</span> transactions
          </p>
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors duration-200 shadow-sm"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg overflow-hidden">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Transaction Details</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Book ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  User ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.transactionId} className="hover:bg-blue-100 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                      #{transaction.transactionId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeClass(transaction.type)}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(transaction.paymentStatus)}`}>
                      {transaction.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                    LKR {transaction.paymentAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                    <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs">
                      #{transaction.bookId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs">
                      #{transaction.userId}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 text-slate-300 mb-4">
                <ChartBarIcon className="h-full w-full" />
              </div>
              <p className="text-slate-600 text-xl font-semibold mb-2">No transactions found</p>
              <p className="text-slate-500">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-semibold">
                  {Math.min(currentPage * itemsPerPage, stats.totalTransactions)}
                </span>{' '}
                of <span className="font-semibold">{stats.totalTransactions}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                      currentPage === index + 1
                        ? 'bg-blue-500 text-white'
                        : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentAnalytics;