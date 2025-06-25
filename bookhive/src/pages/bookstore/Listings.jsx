import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Upload, 
  Edit, 
  Trash2, 
  Grid, 
  List, 
  ChevronDown,
  Eye,
  MoreHorizontal,
  Heart,
  Share2,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Pause,
  XCircle,
  BookOpen,
  Star,
  Award,
  Zap
} from 'lucide-react';

const ListingsPage = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All Prices');
  const [sortBy, setSortBy] = useState('Recent Activity');

  const tabs = [
    { id: 'sales', label: 'For Sale', icon: DollarSign, count: 89 },
    { id: 'lending', label: 'For Lending', icon: BookOpen, count: 67 },
    { id: 'donations', label: 'For Donation', icon: Heart, count: 22 }
  ];

  const salesStats = [
    { 
      label: 'TOTAL LISTINGS', 
      value: '89', 
      bgColor: 'bg-blue-50', 
      borderColor: 'border-blue-200', 
      textColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      icon: Heart
    },
    { 
      label: 'LIVE', 
      value: '67', 
      bgColor: 'bg-green-50', 
      borderColor: 'border-green-200', 
      textColor: 'text-green-600',
      iconBg: 'bg-green-100',
      icon: CheckCircle
    },
    { 
      label: 'DRAFT', 
      value: '22', 
      bgColor: 'bg-amber-50', 
      borderColor: 'border-amber-200', 
      textColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
      icon: Clock
    },
    { 
      label: 'VIEWS TODAY', 
      value: '12', 
      bgColor: 'bg-purple-50', 
      borderColor: 'border-purple-200', 
      textColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      icon: TrendingUp
    }
  ];

  const lendingStats = [
    { 
      label: 'AVAILABLE', 
      value: '67', 
      bgColor: 'bg-blue-50', 
      borderColor: 'border-blue-200', 
      textColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      icon: BookOpen
    },
    { 
      label: 'ON LOAN', 
      value: '34', 
      bgColor: 'bg-amber-50', 
      borderColor: 'border-amber-200', 
      textColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
      icon: Users
    },
    { 
      label: 'HIGH DEMAND', 
      value: '12', 
      bgColor: 'bg-red-50', 
      borderColor: 'border-red-200', 
      textColor: 'text-red-600',
      iconBg: 'bg-red-100',
      icon: TrendingUp
    },
    { 
      label: 'AVG RATING', 
      value: '4.8', 
      bgColor: 'bg-yellow-50', 
      borderColor: 'border-yellow-200', 
      textColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      icon: Star
    }
  ];

  const donationStats = [
    { 
      label: 'LISTED', 
      value: '22', 
      bgColor: 'bg-pink-50', 
      borderColor: 'border-pink-200', 
      textColor: 'text-pink-600',
      iconBg: 'bg-pink-100',
      icon: Heart
    },
    { 
      label: 'MATCHED', 
      value: '18', 
      bgColor: 'bg-green-50', 
      borderColor: 'border-green-200', 
      textColor: 'text-green-600',
      iconBg: 'bg-green-100',
      icon: CheckCircle
    },
    { 
      label: 'PENDING', 
      value: '4', 
      bgColor: 'bg-amber-50', 
      borderColor: 'border-amber-200', 
      textColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
      icon: Clock
    },
    { 
      label: 'IMPACT SCORE', 
      value: '4.9', 
      bgColor: 'bg-purple-50', 
      borderColor: 'border-purple-200', 
      textColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      icon: Award
    }
  ];

  const salesListings = [
    {
      id: 1,
      title: 'The Silent Echo',
      author: 'Sarah Mitchell',
      category: 'Fiction',
      condition: 'New',
      price: 24.99,
      views: 47,
      inquiries: 2,
      status: 'Live',
      featured: true,
      listedDate: 'Jan 15, 2025',
      image: 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=100&h=150'
    },
    {
      id: 2,
      title: 'Modern Physics',
      author: 'Dr. Robert Chen',
      category: 'Academic',
      condition: 'Used',
      price: 89.50,
      views: 23,
      inquiries: 1,
      status: 'Live',
      featured: false,
      listedDate: 'Jan 12, 2025',
      image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=100&h=150'
    }
  ];

  const lendingListings = [
    {
      id: 1,
      title: 'Digital Marketing 2025',
      author: 'Alex Johnson',
      category: 'Non-Fiction',
      condition: 'New',
      duration: '14 days',
      lateFee: '$2.00/day',
      trustScore: '4.5+',
      views: 31,
      requests: 5,
      status: 'Available',
      rating: 4.8,
      listedDate: 'Jan 18, 2025',
      image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=100&h=150'
    },
    {
      id: 2,
      title: 'History of Art',
      author: 'Maria Garcia',
      category: 'Academic',
      condition: 'Used',
      duration: '21 days',
      lateFee: '$1.50/day',
      trustScore: '4.0+',
      views: 18,
      requests: 2,
      status: 'On Loan',
      rating: 4.6,
      borrower: 'John Doe',
      dueDate: 'Jan 25, 2025',
      listedDate: 'Jan 10, 2025',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=150'
    }
  ];

  const donationListings = [
    {
      id: 1,
      title: 'Garden of Dreams',
      author: 'Emma Wilson',
      category: "Children's",
      condition: 'New',
      views: 5,
      interests: 3,
      status: 'Matched',
      recipient: 'Sunshine Orphanage',
      listedDate: 'Jan 8, 2025',
      matchedDate: 'Jan 10, 2025',
      image: 'https://images.pexels.com/photos/1010519/pexels-photo-1010519.jpeg?auto=compress&cs=tinysrgb&w=100&h=150'
    }
  ];

  const getCurrentStats = () => {
    switch (activeTab) {
      case 'lending': return lendingStats;
      case 'donations': return donationStats;
      default: return salesStats;
    }
  };

  const getCurrentListings = () => {
    switch (activeTab) {
      case 'lending': return lendingListings;
      case 'donations': return donationListings;
      default: return salesListings;
    }
  };

  const getStatusBadge = (status, type = 'sales') => {
    const statusConfigs = {
      sales: {
        'Live': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: CheckCircle },
        'Draft': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', icon: Clock },
        'Paused': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200', icon: Pause },
        'Out of Stock': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: XCircle }
      },
      lending: {
        'Available': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: CheckCircle },
        'On Loan': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', icon: Users },
        'Overdue': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: AlertCircle }
      },
      donations: {
        'Available': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: CheckCircle },
        'Matched': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: Heart },
        'Delivered': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', icon: Award }
      }
    };
    
    const config = statusConfigs[type][status] || statusConfigs[type]['Available'] || statusConfigs.sales['Live'];
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-full border ${config.bg} ${config.text} ${config.border}`}>
        <IconComponent className="w-3 h-3" />
        <span>{status}</span>
      </span>
    );
  };

  const getConditionBadge = (condition) => {
    const colorMap = {
      'New': 'bg-blue-100 text-blue-800 border-blue-200',
      'Used': 'bg-gray-100 text-gray-800 border-gray-200',
      'Refurbished': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${colorMap[condition] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {condition}
      </span>
    );
  };

  const renderSalesTable = () => (
    <table className="w-full">
      <thead className="bg-slate-50 border-b border-gray-200">
        <tr>
          <th className="text-left p-4 font-semibold text-slate-700">
            <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
          </th>
          <th className="text-left p-4 font-semibold text-slate-700">LISTING DETAILS</th>
          <th className="text-left p-4 font-semibold text-slate-700">PRICE</th>
          <th className="text-left p-4 font-semibold text-slate-700">VIEWS</th>
          <th className="text-left p-4 font-semibold text-slate-700">INQUIRIES</th>
          <th className="text-left p-4 font-semibold text-slate-700">STATUS</th>
          <th className="text-left p-4 font-semibold text-slate-700">LISTED DATE</th>
          <th className="text-left p-4 font-semibold text-slate-700">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {salesListings.map((listing) => (
          <tr key={listing.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors duration-150">
            <td className="p-4">
              <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            </td>
            <td className="p-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-12 h-16 object-cover rounded-lg border border-gray-200"
                  />
                  {listing.featured && (
                    <div className="absolute -top-1 -right-1 bg-amber-400 rounded-full p-1">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-slate-800 hover:text-blue-600 cursor-pointer transition-colors duration-200">
                      {listing.title}
                    </h3>
                    {listing.featured && (
                      <span className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">by {listing.author}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-slate-500">{listing.category}</span>
                    <span className="text-xs text-slate-400">•</span>
                    {getConditionBadge(listing.condition)}
                  </div>
                </div>
              </div>
            </td>
            <td className="p-4">
              <span className="font-semibold text-slate-800 text-lg">${listing.price}</span>
            </td>
            <td className="p-4">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-700">{listing.views}</span>
              </div>
            </td>
            <td className="p-4">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-700">{listing.inquiries}</span>
              </div>
            </td>
            <td className="p-4">{getStatusBadge(listing.status, 'sales')}</td>
            <td className="p-4">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">{listing.listedDate}</span>
              </div>
            </td>
            <td className="p-4">
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 group">
                  <Eye className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </button>
                <button className="p-2 hover:bg-amber-50 rounded-lg transition-colors duration-200 group">
                  <Edit className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                </button>
                <button className="p-2 hover:bg-green-50 rounded-lg transition-colors duration-200 group">
                  <Share2 className="w-4 h-4 text-slate-400 group-hover:text-green-600" />
                </button>
                <button className="p-2 hover:bg-purple-50 rounded-lg transition-colors duration-200 group">
                  <Zap className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
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
  );

  const renderLendingTable = () => (
    <table className="w-full">
      <thead className="bg-slate-50 border-b border-gray-200">
        <tr>
          <th className="text-left p-4 font-semibold text-slate-700">BOOK DETAILS</th>
          <th className="text-left p-4 font-semibold text-slate-700">TERMS</th>
          <th className="text-left p-4 font-semibold text-slate-700">VIEWS</th>
          <th className="text-left p-4 font-semibold text-slate-700">REQUESTS</th>
          <th className="text-left p-4 font-semibold text-slate-700">RATING</th>
          <th className="text-left p-4 font-semibold text-slate-700">STATUS</th>
          <th className="text-left p-4 font-semibold text-slate-700">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {lendingListings.map((listing) => (
          <tr key={listing.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors duration-150">
            <td className="p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-12 h-16 object-cover rounded-lg border border-gray-200"
                />
                <div>
                  <h3 className="font-semibold text-slate-800 hover:text-blue-600 cursor-pointer transition-colors duration-200">
                    {listing.title}
                  </h3>
                  <p className="text-sm text-slate-600">by {listing.author}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-slate-500">{listing.category}</span>
                    <span className="text-xs text-slate-400">•</span>
                    {getConditionBadge(listing.condition)}
                  </div>
                  {listing.borrower && (
                    <p className="text-xs text-amber-600 mt-1">On loan to {listing.borrower}</p>
                  )}
                </div>
              </div>
            </td>
            <td className="p-4">
              <div className="text-sm">
                <p className="font-medium text-slate-700">{listing.duration}</p>
                <p className="text-slate-600">{listing.lateFee}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="w-3 h-3 text-amber-500" />
                  <span className="text-xs text-slate-600">{listing.trustScore}</span>
                </div>
              </div>
            </td>
            <td className="p-4">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-700">{listing.views}</span>
              </div>
            </td>
            <td className="p-4">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-700">{listing.requests}</span>
              </div>
            </td>
            <td className="p-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="font-medium text-slate-700">{listing.rating}</span>
              </div>
            </td>
            <td className="p-4">{getStatusBadge(listing.status, 'lending')}</td>
            <td className="p-4">
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 group">
                  <Eye className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </button>
                <button className="p-2 hover:bg-amber-50 rounded-lg transition-colors duration-200 group">
                  <Edit className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                </button>
                <button className="p-2 hover:bg-green-50 rounded-lg transition-colors duration-200 group">
                  <Share2 className="w-4 h-4 text-slate-400 group-hover:text-green-600" />
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
  );

  const renderDonationsTable = () => (
    <table className="w-full">
      <thead className="bg-slate-50 border-b border-gray-200">
        <tr>
          <th className="text-left p-4 font-semibold text-slate-700">BOOK DETAILS</th>
          <th className="text-left p-4 font-semibold text-slate-700">VIEWS</th>
          <th className="text-left p-4 font-semibold text-slate-700">INTERESTS</th>
          <th className="text-left p-4 font-semibold text-slate-700">STATUS</th>
          <th className="text-left p-4 font-semibold text-slate-700">RECIPIENT</th>
          <th className="text-left p-4 font-semibold text-slate-700">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {donationListings.map((listing) => (
          <tr key={listing.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors duration-150">
            <td className="p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-12 h-16 object-cover rounded-lg border border-gray-200"
                />
                <div>
                  <h3 className="font-semibold text-slate-800 hover:text-blue-600 cursor-pointer transition-colors duration-200">
                    {listing.title}
                  </h3>
                  <p className="text-sm text-slate-600">by {listing.author}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-slate-500">{listing.category}</span>
                    <span className="text-xs text-slate-400">•</span>
                    {getConditionBadge(listing.condition)}
                  </div>
                </div>
              </div>
            </td>
            <td className="p-4">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-700">{listing.views}</span>
              </div>
            </td>
            <td className="p-4">
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-700">{listing.interests}</span>
              </div>
            </td>
            <td className="p-4">{getStatusBadge(listing.status, 'donations')}</td>
            <td className="p-4">
              {listing.recipient ? (
                <div className="text-sm">
                  <p className="font-medium text-slate-700">{listing.recipient}</p>
                  <p className="text-slate-600">Matched: {listing.matchedDate}</p>
                </div>
              ) : (
                <span className="text-slate-400">Pending match</span>
              )}
            </td>
            <td className="p-4">
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 group">
                  <Eye className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </button>
                <button className="p-2 hover:bg-amber-50 rounded-lg transition-colors duration-200 group">
                  <Edit className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                </button>
                <button className="p-2 hover:bg-green-50 rounded-lg transition-colors duration-200 group">
                  <Share2 className="w-4 h-4 text-slate-400 group-hover:text-green-600" />
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
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Listings Management</h1>
                <p className="text-slate-600 mt-1">
                  Preview and manage how your books appear to users
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
                <span>Create Listing</span>
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
                      {tab.count}
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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                  </div>
                  <div className={`${stat.iconBg} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
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
                  placeholder="Search listings, ISBN, or title..."
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
                  <option>Live</option>
                  <option>Draft</option>
                  <option>Paused</option>
                  <option>Available</option>
                  <option>On Loan</option>
                  <option>Matched</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option>All Categories</option>
                  <option>Fiction</option>
                  <option>Non-Fiction</option>
                  <option>Academic</option>
                  <option>Children's</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              <div className="flex space-x-2">
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <Grid className="w-4 h-4" />
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 bg-blue-50 border-blue-200">
                  <List className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab === 'sales' && renderSalesTable()}
            {activeTab === 'lending' && renderLendingTable()}
            {activeTab === 'donations' && renderDonationsTable()}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-slate-600">Showing 1 to {getCurrentListings().length} of {getCurrentStats()[0].value} results</p>
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

export default ListingsPage;