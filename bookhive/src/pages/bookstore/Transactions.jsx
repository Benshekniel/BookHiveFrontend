import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Upload, 
  Edit, 
  Trash2, 
  Eye,
  MoreHorizontal,
  ShoppingCart,
  Clock,
  CheckCircle,
  DollarSign,
  Calendar,
  User,
  Package,
  TrendingUp,
  AlertCircle,
  Truck,
  RefreshCw,
  ChevronDown,
  ArrowRight,
  BookOpen,
  Heart,
  MapPin,
  Shield,
  Camera,
  FileText,
  Ban,
  Star,
  Award,
  Zap
} from 'lucide-react';

const TransactionsPage = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 30 days');

  const tabs = [
    { id: 'sales', label: 'Sales Orders', icon: ShoppingCart, count: 2891 },
    { id: 'lending', label: 'Lending Activity', icon: BookOpen, count: 456 },
    { id: 'donations', label: 'Donations', icon: Heart, count: 89 }
  ];

  const salesStats = [
    { 
      label: 'TOTAL ORDERS', 
      value: '2,891', 
      change: '+12% from last month',
      bgColor: 'bg-blue-50', 
      borderColor: 'border-blue-200', 
      textColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      icon: ShoppingCart,
      changeColor: 'text-green-600'
    },
    { 
      label: 'PENDING ORDERS', 
      value: '47', 
      change: '-3% from yesterday',
      bgColor: 'bg-amber-50', 
      borderColor: 'border-amber-200', 
      textColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
      icon: Clock,
      changeColor: 'text-red-600'
    },
    { 
      label: 'COMPLETED', 
      value: '2,789', 
      change: '+8% from last week',
      bgColor: 'bg-green-50', 
      borderColor: 'border-green-200', 
      textColor: 'text-green-600',
      iconBg: 'bg-green-100',
      icon: CheckCircle,
      changeColor: 'text-green-600'
    },
    { 
      label: 'REVENUE', 
      value: '$24,591', 
      change: '+18% from last month',
      bgColor: 'bg-purple-50', 
      borderColor: 'border-purple-200', 
      textColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      icon: DollarSign,
      changeColor: 'text-green-600'
    }
  ];

  const lendingStats = [
    { 
      label: 'ACTIVE LOANS', 
      value: '456', 
      change: '+5% from last week',
      bgColor: 'bg-blue-50', 
      borderColor: 'border-blue-200', 
      textColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      icon: BookOpen,
      changeColor: 'text-green-600'
    },
    { 
      label: 'OVERDUE', 
      value: '23', 
      change: '+2 from yesterday',
      bgColor: 'bg-red-50', 
      borderColor: 'border-red-200', 
      textColor: 'text-red-600',
      iconBg: 'bg-red-100',
      icon: AlertCircle,
      changeColor: 'text-red-600'
    },
    { 
      label: 'RETURNED', 
      value: '1,234', 
      change: '+15% from last month',
      bgColor: 'bg-green-50', 
      borderColor: 'border-green-200', 
      textColor: 'text-green-600',
      iconBg: 'bg-green-100',
      icon: CheckCircle,
      changeColor: 'text-green-600'
    },
    { 
      label: 'LATE FEES', 
      value: '$1,245', 
      change: '-8% from last month',
      bgColor: 'bg-amber-50', 
      borderColor: 'border-amber-200', 
      textColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
      icon: DollarSign,
      changeColor: 'text-green-600'
    }
  ];

  const donationStats = [
    { 
      label: 'TOTAL DONATED', 
      value: '89', 
      change: '+12 this month',
      bgColor: 'bg-pink-50', 
      borderColor: 'border-pink-200', 
      textColor: 'text-pink-600',
      iconBg: 'bg-pink-100',
      icon: Heart,
      changeColor: 'text-green-600'
    },
    { 
      label: 'MATCHED', 
      value: '76', 
      change: '+8 this week',
      bgColor: 'bg-green-50', 
      borderColor: 'border-green-200', 
      textColor: 'text-green-600',
      iconBg: 'bg-green-100',
      icon: CheckCircle,
      changeColor: 'text-green-600'
    },
    { 
      label: 'DELIVERED', 
      value: '68', 
      change: '+5 this week',
      bgColor: 'bg-blue-50', 
      borderColor: 'border-blue-200', 
      textColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      icon: Truck,
      changeColor: 'text-green-600'
    },
    { 
      label: 'IMPACT SCORE', 
      value: '4.9', 
      change: '+0.1 this month',
      bgColor: 'bg-purple-50', 
      borderColor: 'border-purple-200', 
      textColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      icon: Award,
      changeColor: 'text-green-600'
    }
  ];

  const salesOrders = [
    {
      id: '#ORD-2025-001',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah@email.com',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40'
      },
      books: [
        'The Great Gatsby',
        'To Kill a Mockingbird',
        'Pride and Prejudice'
      ],
      bookCount: 3,
      total: 47.85,
      status: 'In Transit',
      date: 'Jan 15, 2025',
      orderType: 'Standard',
      tracking: [
        { location: 'Dhaka North Hub', timestamp: 'Jan 16, 10:30 AM', status: 'scanned', pin: '****' },
        { location: 'Chittagong Hub', timestamp: 'Jan 17, 2:15 PM', status: 'scanned', pin: '****' },
        { location: 'Out for Delivery', timestamp: 'Jan 18, 9:00 AM', status: 'pending', pin: null }
      ]
    },
    {
      id: '#ORD-2025-002',
      customer: {
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=40&h=40'
      },
      books: ['Dune'],
      bookCount: 1,
      total: 18.99,
      status: 'Delivered',
      date: 'Jan 14, 2025',
      orderType: 'Express',
      tracking: [
        { location: 'Dhaka South Hub', timestamp: 'Jan 14, 3:45 PM', status: 'scanned', pin: '****' },
        { location: 'Delivered', timestamp: 'Jan 15, 11:20 AM', status: 'delivered', pin: '****', signature: true }
      ]
    }
  ];

  const lendingActivity = [
    {
      id: '#LOAN-2025-001',
      borrower: {
        name: 'Alex Thompson',
        email: 'alex.t@email.com',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=40&h=40',
        trustScore: 4.7
      },
      book: 'Digital Marketing 2025',
      author: 'Alex Johnson',
      duration: '14 days',
      dueDate: 'Jan 25, 2025',
      status: 'Active',
      lastSeen: 'Chittagong',
      loanDate: 'Jan 11, 2025',
      lateFee: '$2.00/day',
      isOverdue: false
    },
    {
      id: '#LOAN-2025-002',
      borrower: {
        name: 'Emma Davis',
        email: 'emma.d@email.com',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40',
        trustScore: 3.2
      },
      book: 'History of Art',
      author: 'Maria Garcia',
      duration: '21 days',
      dueDate: 'Jan 20, 2025',
      status: 'Overdue',
      lastSeen: 'Sylhet',
      loanDate: 'Dec 30, 2024',
      lateFee: '$1.50/day',
      isOverdue: true,
      overdueBy: 5
    }
  ];

  const donations = [
    {
      id: '#DON-2025-001',
      book: 'Garden of Dreams',
      author: 'Emma Wilson',
      category: "Children's",
      condition: 'New',
      status: 'Delivered',
      recipient: 'Sunshine Orphanage',
      moderator: 'Admin Team',
      donationDate: 'Jan 8, 2025',
      matchedDate: 'Jan 10, 2025',
      deliveredDate: 'Jan 12, 2025',
      image: 'https://images.pexels.com/photos/1010519/pexels-photo-1010519.jpeg?auto=compress&cs=tinysrgb&w=100&h=150'
    },
    {
      id: '#DON-2025-002',
      book: 'Science for Kids',
      author: 'Dr. Smith',
      category: "Children's",
      condition: 'Used',
      status: 'Matched',
      recipient: 'City Library',
      moderator: 'Admin Team',
      donationDate: 'Jan 15, 2025',
      matchedDate: 'Jan 16, 2025',
      deliveredDate: null,
      image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=100&h=150'
    }
  ];

  const getCurrentStats = () => {
    switch (activeTab) {
      case 'lending': return lendingStats;
      case 'donations': return donationStats;
      default: return salesStats;
    }
  };

  const getStatusBadge = (status, type = 'sales') => {
    const statusConfigs = {
      sales: {
        'Processing': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: RefreshCw },
        'In Transit': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', icon: Truck },
        'Delivered': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: CheckCircle },
        'Pending': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', icon: Clock },
        'Cancelled': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: AlertCircle }
      },
      lending: {
        'Active': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: CheckCircle },
        'Overdue': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: AlertCircle },
        'Returned': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: BookOpen },
        'Frozen': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', icon: Ban }
      },
      donations: {
        'Pending': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', icon: Clock },
        'Matched': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: Heart },
        'Delivered': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: CheckCircle }
      }
    };
    
    const config = statusConfigs[type][status] || statusConfigs[type]['Pending'] || statusConfigs.sales['Pending'];
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-full border ${config.bg} ${config.text} ${config.border}`}>
        <IconComponent className="w-3 h-3" />
        <span>{status}</span>
      </span>
    );
  };

  const renderSalesContent = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-semibold text-slate-700">ORDER ID</th>
              <th className="text-left p-4 font-semibold text-slate-700">CUSTOMER</th>
              <th className="text-left p-4 font-semibold text-slate-700">BOOKS</th>
              <th className="text-left p-4 font-semibold text-slate-700">TOTAL</th>
              <th className="text-left p-4 font-semibold text-slate-700">STATUS</th>
              <th className="text-left p-4 font-semibold text-slate-700">TRACKING</th>
              <th className="text-left p-4 font-semibold text-slate-700">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {salesOrders.map((order) => (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors duration-150">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 hover:text-blue-600 cursor-pointer transition-colors duration-200">
                      {order.id}
                    </span>
                    <span className="text-xs text-slate-500">{order.date}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={order.customer.avatar}
                      alt={order.customer.name}
                      className="w-10 h-10 rounded-full border-2 border-gray-200"
                    />
                    <div>
                      <p className="font-semibold text-slate-800">{order.customer.name}</p>
                      <p className="text-sm text-slate-600">{order.customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2 mb-1">
                      <Package className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-700">{order.bookCount} book{order.bookCount > 1 ? 's' : ''}</span>
                    </div>
                    <div className="text-sm text-slate-600">
                      {order.books.slice(0, 2).map((book, idx) => (
                        <div key={idx} className="truncate max-w-xs">{book}</div>
                      ))}
                      {order.books.length > 2 && (
                        <div className="text-blue-600 cursor-pointer hover:underline">
                          +{order.books.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-bold text-slate-800 text-lg">${order.total}</span>
                </td>
                <td className="p-4">{getStatusBadge(order.status, 'sales')}</td>
                <td className="p-4">
                  <div className="space-y-1">
                    {order.tracking.map((track, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs">
                        {track.status === 'scanned' ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : track.status === 'delivered' ? (
                          <CheckCircle className="w-3 h-3 text-blue-500" />
                        ) : (
                          <Clock className="w-3 h-3 text-amber-500" />
                        )}
                        <span className="text-slate-600">{track.location}</span>
                        {track.signature && <Camera className="w-3 h-3 text-blue-500" />}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 group">
                      <Eye className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-green-50 rounded-lg transition-colors duration-200 group">
                      <Truck className="w-4 h-4 text-slate-400 group-hover:text-green-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 group">
                      <MoreHorizontal className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderLendingContent = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-semibold text-slate-700">LOAN ID</th>
              <th className="text-left p-4 font-semibold text-slate-700">BORROWER</th>
              <th className="text-left p-4 font-semibold text-slate-700">BOOK</th>
              <th className="text-left p-4 font-semibold text-slate-700">DUE DATE</th>
              <th className="text-left p-4 font-semibold text-slate-700">STATUS</th>
              <th className="text-left p-4 font-semibold text-slate-700">LOCATION</th>
              <th className="text-left p-4 font-semibold text-slate-700">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {lendingActivity.map((loan) => (
              <tr key={loan.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors duration-150">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 hover:text-blue-600 cursor-pointer transition-colors duration-200">
                      {loan.id}
                    </span>
                    <span className="text-xs text-slate-500">{loan.loanDate}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={loan.borrower.avatar}
                      alt={loan.borrower.name}
                      className="w-10 h-10 rounded-full border-2 border-gray-200"
                    />
                    <div>
                      <p className="font-semibold text-slate-800">{loan.borrower.name}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-amber-500" />
                        <span className="text-sm text-slate-600">{loan.borrower.trustScore}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-semibold text-slate-800">{loan.book}</p>
                    <p className="text-sm text-slate-600">by {loan.author}</p>
                    <span className="text-xs text-slate-500">{loan.duration}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className={`font-medium ${loan.isOverdue ? 'text-red-600' : 'text-slate-700'}`}>
                      {loan.dueDate}
                    </span>
                    {loan.isOverdue && (
                      <span className="text-xs text-red-600">
                        {loan.overdueBy} days overdue
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">{getStatusBadge(loan.status, 'lending')}</td>
                <td className="p-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">Last seen: {loan.lastSeen}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 group">
                      <Eye className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    </button>
                    {loan.isOverdue && (
                      <>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200 group">
                          <Zap className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 group">
                          <Ban className="w-4 h-4 text-slate-400 group-hover:text-gray-600" />
                        </button>
                      </>
                    )}
                    <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 group">
                      <MoreHorizontal className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDonationsContent = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-semibold text-slate-700">DONATION ID</th>
              <th className="text-left p-4 font-semibold text-slate-700">BOOK DETAILS</th>
              <th className="text-left p-4 font-semibold text-slate-700">RECIPIENT</th>
              <th className="text-left p-4 font-semibold text-slate-700">STATUS</th>
              <th className="text-left p-4 font-semibold text-slate-700">DATES</th>
              <th className="text-left p-4 font-semibold text-slate-700">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors duration-150">
                <td className="p-4">
                  <span className="font-semibold text-slate-800 hover:text-blue-600 cursor-pointer transition-colors duration-200">
                    {donation.id}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={donation.image}
                      alt={donation.book}
                      className="w-12 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div>
                      <h3 className="font-semibold text-slate-800">{donation.book}</h3>
                      <p className="text-sm text-slate-600">by {donation.author}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-slate-500">{donation.category}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">{donation.condition}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-semibold text-slate-800">{donation.recipient}</p>
                    <p className="text-sm text-slate-600">Handled by {donation.moderator}</p>
                  </div>
                </td>
                <td className="p-4">{getStatusBadge(donation.status, 'donations')}</td>
                <td className="p-4">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-600">Donated: {donation.donationDate}</span>
                    </div>
                    {donation.matchedDate && (
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3 text-blue-500" />
                        <span className="text-slate-600">Matched: {donation.matchedDate}</span>
                      </div>
                    )}
                    {donation.deliveredDate && (
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-slate-600">Delivered: {donation.deliveredDate}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 group">
                      <Eye className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-green-50 rounded-lg transition-colors duration-200 group">
                      <FileText className="w-4 h-4 text-slate-400 group-hover:text-green-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 group">
                      <MoreHorizontal className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Transactions</h1>
                <p className="text-slate-600 mt-1">
                  Track and manage all your book transactions
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Upload className="w-4 h-4" />
                <span className="font-medium">Export</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-amber-400 text-slate-800 rounded-lg hover:bg-amber-500 transition-colors duration-200 font-medium">
                <Plus className="w-4 h-4" />
                <span>New Transaction</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.label}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getCurrentStats().map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} ${stat.borderColor} border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.iconBg} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                  </div>
                </div>
                <p className={`text-sm font-medium ${stat.changeColor}`}>{stat.change}</p>
              </div>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option>All Status</option>
                  <option>Processing</option>
                  <option>In Transit</option>
                  <option>Delivered</option>
                  <option>Active</option>
                  <option>Overdue</option>
                  <option>Matched</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option>Last 30 days</option>
                  <option>Last 7 days</option>
                  <option>Last 3 months</option>
                  <option>This year</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Filter className="w-4 h-4" />
                <span>More Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'sales' && renderSalesContent()}
        {activeTab === 'lending' && renderLendingContent()}
        {activeTab === 'donations' && renderDonationsContent()}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-slate-600">
            Showing 1 to {activeTab === 'sales' ? salesOrders.length : activeTab === 'lending' ? lendingActivity.length : donations.length} of {getCurrentStats()[0].value} results
          </p>
          <div className="flex space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors duration-200">
              Previous
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200">
              1
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors duration-200">
              2
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors duration-200">
              3
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors duration-200">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;