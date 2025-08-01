import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  CreditCardIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

const PaymentAnalytics = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockTransactions = [
      {
        transactionId: 1,
        type: 'SALE',
        status: 'COMPLETED',
        paymentStatus: 'COMPLETED',
        paymentAmount: 2500.00,
        createdAt: '2024-01-15T10:30:00',
        startDate: '2024-01-15T10:30:00',
        endDate: '2024-01-15T10:30:00',
        bookId: 101,
        borrowerId: 201
      },
      {
        transactionId: 2,
        type: 'LOAN',
        status: 'ACTIVE',
        paymentStatus: 'COMPLETED',
        paymentAmount: 500.00,
        createdAt: '2024-01-16T14:20:00',
        startDate: '2024-01-16T14:20:00',
        endDate: '2024-01-30T14:20:00',
        bookId: 102,
        borrowerId: 202
      },
      {
        transactionId: 3,
        type: 'AUCTION',
        status: 'COMPLETED',
        paymentStatus: 'COMPLETED',
        paymentAmount: 3200.00,
        createdAt: '2024-01-17T09:15:00',
        startDate: '2024-01-17T09:15:00',
        endDate: '2024-01-17T09:15:00',
        bookId: 103,
        borrowerId: 203
      },
      {
        transactionId: 4,
        type: 'SALE',
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentAmount: 1800.00,
        createdAt: '2024-01-18T16:45:00',
        startDate: '2024-01-18T16:45:00',
        endDate: '2024-01-18T16:45:00',
        bookId: 104,
        borrowerId: 204
      },
      {
        transactionId: 5,
        type: 'DONATION',
        status: 'COMPLETED',
        paymentStatus: 'COMPLETED',
        paymentAmount: 0.00,
        createdAt: '2024-01-19T11:30:00',
        startDate: '2024-01-19T11:30:00',
        endDate: '2024-01-19T11:30:00',
        bookId: 105,
        borrowerId: 205
      },
      {
        transactionId: 6,
        type: 'LOAN',
        status: 'OVERDUE',
        paymentStatus: 'COMPLETED',
        paymentAmount: 750.00,
        createdAt: '2024-01-10T08:15:00',
        startDate: '2024-01-10T08:15:00',
        endDate: '2024-01-24T08:15:00',
        bookId: 106,
        borrowerId: 206
      },
      {
        transactionId: 7,
        type: 'SALE',
        status: 'CANCELLED',
        paymentStatus: 'REFUNDED',
        paymentAmount: 1200.00,
        createdAt: '2024-01-12T13:45:00',
        startDate: '2024-01-12T13:45:00',
        endDate: '2024-01-12T13:45:00',
        bookId: 107,
        borrowerId: 207
      },
      {
        transactionId: 8,
        type: 'AUCTION',
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentAmount: 4500.00,
        createdAt: '2024-01-20T11:20:00',
        startDate: '2024-01-20T11:20:00',
        endDate: '2024-01-20T11:20:00',
        bookId: 108,
        borrowerId: 208
      }
    ];

    setTimeout(() => {
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter transactions based on search and filters
  useEffect(() => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.transactionId.toString().includes(searchTerm) ||
        t.bookId.toString().includes(searchTerm) ||
        t.borrowerId.toString().includes(searchTerm)
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    if (paymentStatusFilter !== 'ALL') {
      filtered = filtered.filter(t => t.paymentStatus === paymentStatusFilter);
    }

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.createdAt);
        return transactionDate >= new Date(dateRange.start) && 
               transactionDate <= new Date(dateRange.end);
      });
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter, paymentStatusFilter, dateRange, transactions]);

  // Calculate analytics metrics
  const totalRevenue = filteredTransactions
    .filter(t => t.paymentStatus === 'COMPLETED')
    .reduce((sum, t) => sum + t.paymentAmount, 0);

  const totalTransactions = filteredTransactions.length;
  
  const successfulPayments = filteredTransactions
    .filter(t => t.paymentStatus === 'COMPLETED').length;
  
  const successRate = totalTransactions > 0 
    ? Math.round((successfulPayments / totalTransactions) * 100) 
    : 0;

  const pendingPayments = filteredTransactions
    .filter(t => t.paymentStatus === 'PENDING').length;

  const failedPayments = filteredTransactions
    .filter(t => t.paymentStatus === 'FAILED').length;

  const refundedAmount = filteredTransactions
    .filter(t => t.paymentStatus === 'REFUNDED')
    .reduce((sum, t) => sum + t.paymentAmount, 0);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'FAILED': return 'bg-red-100 text-red-800 border-red-200';
      case 'REFUNDED': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'ACTIVE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      case 'OVERDUE': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'SALE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'LOAN': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DONATION': return 'bg-green-100 text-green-800 border-green-200';
      case 'AUCTION': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Transaction ID', 'Type', 'Status', 'Payment Status', 'Amount (LKR)', 'Created At', 'Book ID', 'Borrower ID'],
      ...filteredTransactions.map(t => [
        t.transactionId,
        t.type,
        t.status,
        t.paymentStatus,
        t.paymentAmount.toFixed(2),
        new Date(t.createdAt).toLocaleString(),
        t.bookId,
        t.borrowerId
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookhive-payment-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setTypeFilter('ALL');
    setPaymentStatusFilter('ALL');
    setDateRange({ start: '', end: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading payment analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Payment Analytics</h1>
              <p className="text-blue-100 text-lg">Comprehensive payment analysis and transaction management for BookHive</p>
            </div>
            <div className="flex items-center space-x-4">
              <BanknotesIcon className="h-12 w-12 text-blue-200" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8 -mt-16 relative z-10">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">LKR {totalRevenue.toLocaleString()}</p>
                <p className="text-green-600 text-xs mt-1">↗ +12.5% from last month</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
                <p className="text-blue-600 text-xs mt-1">↗ +8.3% from last month</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <ChartBarIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{successRate}%</p>
                <p className="text-green-600 text-xs mt-1">↗ +2.1% from last month</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CreditCardIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900">{pendingPayments}</p>
                <p className="text-orange-600 text-xs mt-1">Requires attention</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <CalendarIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Failed Payments</p>
                <p className="text-2xl font-bold text-gray-900">{failedPayments}</p>
                <p className="text-red-600 text-xs mt-1">Needs investigation</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <ArrowTrendingUpIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-gray-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Refunded Amount</p>
                <p className="text-2xl font-bold text-gray-900">LKR {refundedAmount.toLocaleString()}</p>
                <p className="text-gray-600 text-xs mt-1">Total refunds issued</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-full">
                <BanknotesIcon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FunnelIcon className="h-5 w-5 mr-2 text-blue-600" />
              Filters & Search
            </h2>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              Clear All Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="OVERDUE">Overdue</option>
            </select>

            <select
              className="border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="SALE">Sale</option>
              <option value="LOAN">Loan</option>
              <option value="DONATION">Donation</option>
              <option value="AUCTION">Auction</option>
            </select>

            <select
              className="border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
            >
              <option value="ALL">All Payment Status</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>

            <input
              type="date"
              className="border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Start Date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />

            <input
              type="date"
              className="border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="End Date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-blue-600">{filteredTransactions.length}</span> of <span className="font-semibold">{totalTransactions}</span> transactions
            </p>
            <button
              onClick={exportData}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Transaction Details</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrower ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentTransactions.map((transaction) => (
                  <tr key={transaction.transactionId} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                        #{transaction.transactionId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTypeBadgeClass(transaction.type)}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(transaction.paymentStatus)}`}>
                        {transaction.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      <span className="text-blue-600">LKR {transaction.paymentAmount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                        #{transaction.bookId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
                        #{transaction.borrowerId}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredTransactions.length === 0 && (
              <div className="text-center py-16">
                <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                  <ChartBarIcon className="h-full w-full" />
                </div>
                <p className="text-gray-500 text-xl font-medium mb-2">No transactions found</p>
                <p className="text-gray-400">Try adjusting your search criteria or filters</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredTransactions.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredTransactions.length}</span> results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentPage === index + 1
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentAnalytics;