import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  Download, 
  Filter,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  MoreHorizontal,
  PieChart,
  BarChart3,
  Receipt,
  Banknote,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Settings,
  FileText,
  Search
} from 'lucide-react';

const Finances = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 days');
  const [selectedTransactionType, setSelectedTransactionType] = useState('All Transactions');
  const [searchTerm, setSearchTerm] = useState('');

  // Financial stats
  const stats = [
    {
      label: 'Total Revenue',
      value: '$12,847',
      change: '+24.1% from last month',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-50 text-green-600',
      chartColor: 'text-green-500'
    },
    {
      label: 'Pending Payments',
      value: '$2,340',
      change: '+5.2% from yesterday',
      trend: 'up',
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-600',
      chartColor: 'text-yellow-500'
    },
    {
      label: 'Monthly Expenses',
      value: '$1,890',
      change: '-8.3% from last month',
      trend: 'down',
      icon: Receipt,
      color: 'bg-red-50 text-red-600',
      chartColor: 'text-red-500'
    },
    {
      label: 'Net Profit',
      value: '$10,957',
      change: '+32.1% from last month',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-blue-50 text-blue-600',
      chartColor: 'text-blue-500'
    }
  ];

  // Revenue breakdown
  const revenueBreakdown = [
    { source: 'Book Sales', amount: '$8,450', percentage: 65.8, color: 'bg-blue-500' },
    { source: 'Exchange Fees', amount: '$2,340', percentage: 18.2, color: 'bg-green-500' },
    { source: 'Membership', amount: '$1,560', percentage: 12.1, color: 'bg-purple-500' },
    { source: 'Other', amount: '$497', percentage: 3.9, color: 'bg-gray-400' }
  ];

  // Recent transactions
  const transactions = [
    {
      id: 'TXN-2025-0156',
      type: 'Sale',
      description: 'Book Sale - "The Great Gatsby"',
      customer: 'Sarah Johnson',
      amount: '+$24.99',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-800',
      date: '2 hours ago',
      method: 'Credit Card',
      icon: ArrowUpRight,
      iconColor: 'text-green-600'
    },
    {
      id: 'TXN-2025-0155',
      type: 'Exchange Fee',
      description: 'Exchange Processing Fee',
      customer: 'Mike Chen',
      amount: '+$3.50',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-800',
      date: '4 hours ago',
      method: 'PayPal',
      icon: ArrowUpRight,
      iconColor: 'text-green-600'
    },
    {
      id: 'TXN-2025-0154',
      type: 'Refund',
      description: 'Book Return Refund',
      customer: 'Emma Davis',
      amount: '-$18.75',
      status: 'Processing',
      statusColor: 'bg-yellow-100 text-yellow-800',
      date: '6 hours ago',
      method: 'Credit Card',
      icon: ArrowDownRight,
      iconColor: 'text-red-600'
    },
    {
      id: 'TXN-2025-0153',
      type: 'Sale',
      description: 'Book Sale - "Dune Series"',
      customer: 'Alex Wilson',
      amount: '+$89.99',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-800',
      date: '1 day ago',
      method: 'Bank Transfer',
      icon: ArrowUpRight,
      iconColor: 'text-green-600'
    },
    {
      id: 'TXN-2025-0152',
      type: 'Fee',
      description: 'Platform Service Fee',
      customer: 'BookHive Platform',
      amount: '-$12.50',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-800',
      date: '1 day ago',
      method: 'Auto Deduct',
      icon: ArrowDownRight,
      iconColor: 'text-red-600'
    }
  ];

  // Payment methods
  const paymentMethods = [
    {
      type: 'Credit Card',
      details: '**** **** **** 4532',
      provider: 'Visa',
      status: 'Active',
      statusColor: 'text-green-600',
      isDefault: true
    },
    {
      type: 'Bank Account',
      details: 'Wells Fargo ****6789',
      provider: 'Bank Transfer',
      status: 'Active',
      statusColor: 'text-green-600',
      isDefault: false
    },
    {
      type: 'PayPal',
      details: 'pageturner@email.com',
      provider: 'PayPal',
      status: 'Active',
      statusColor: 'text-green-600',
      isDefault: false
    }
  ];

  // Upcoming payouts
  const upcomingPayouts = [
    {
      amount: '$1,245.67',
      date: 'Jan 20, 2025',
      method: 'Bank Transfer',
      status: 'Scheduled',
      description: 'Weekly payout'
    },
    {
      amount: '$890.23',
      date: 'Jan 27, 2025',
      method: 'Bank Transfer',
      status: 'Pending',
      description: 'Weekly payout'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Finances</h1>
            <p className="text-gray-600">Track your revenue, expenses, and financial performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
            <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 inline" />
                ) : (
                  <TrendingDown className="w-4 h-4 inline" />
                )}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className={`text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Breakdown</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {revenueBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                  <span className="text-gray-700 text-sm">{item.source}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{item.amount}</div>
                  <div className="text-xs text-gray-500">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              <Plus className="w-4 h-4 inline mr-1" />
              Add New
            </button>
          </div>
          <div className="space-y-4">
            {paymentMethods.map((method, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{method.type}</div>
                    <div className="text-sm text-gray-500">{method.details}</div>
                    {method.isDefault && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 inline-block">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${method.statusColor}`}>{method.status}</div>
                  <button className="text-gray-400 hover:text-gray-600 mt-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Payouts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Payouts</h3>
            <Wallet className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {upcomingPayouts.map((payout, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{payout.amount}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    payout.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payout.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-1">{payout.description}</div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{payout.date}</span>
                  <span>{payout.method}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
            View Payout Schedule
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <div className="flex items-center space-x-3">
              <select 
                value={selectedTransactionType}
                onChange={(e) => setSelectedTransactionType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>All Transactions</option>
                <option>Sales</option>
                <option>Refunds</option>
                <option>Fees</option>
                <option>Exchange Fees</option>
              </select>
              <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        transaction.iconColor === 'text-green-600' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <transaction.icon className={`w-4 h-4 ${transaction.iconColor}`} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{transaction.description}</div>
                        <div className="text-sm text-gray-500">{transaction.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{transaction.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-semibold ${
                      transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${transaction.statusColor}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
              <span className="font-medium">97</span> transactions
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 text-sm text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finances;