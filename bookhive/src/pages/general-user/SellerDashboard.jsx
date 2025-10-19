import React, { useState } from 'react';
import { Link } from 'react-router-dom';


import Button from '../../components/shared/Button';
import { 
  User, Settings, BookOpen, TrendingUp, Plus, Eye, Edit, Trash2,
  Package, DollarSign, Users, Award, Star, MessageSquare, 
  Calendar, Clock, CheckCircle, XCircle, AlertCircle,
  BarChart3, PieChart, Activity, Target, Upload, Image,
  Filter, Search, SortAsc, MoreHorizontal, Bell, Mail,
  Phone, MapPin, Tag, Heart, Share2, Download, FileText
} from 'lucide-react';
import { books, bookRequests, users } from '../../data/mockData';

const SellerDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    description: '',
    genre: [],
    condition: 'Good',
    price: '',
    forSale: true,
    forLend: false,
    lendingPeriod: 14,
    language: 'English',
    isbn: '',
    publishYear: '',
    images: []
  });

  // Mock current seller data
  const currentSeller = users[0];
  
  // Mock seller's books
  const sellerBooks = books.filter(book => book.owner.id === currentSeller.id);
  
  // Mock requests for seller's books
  const sellerRequests = bookRequests.filter(request => 
    sellerBooks.some(book => book.id === request.book.id)
  );

  // Mock seller statistics
  const sellerStats = {
    totalBooks: sellerBooks.length,
    totalEarnings: 45600,
    activeLoans: 8,
    completedSales: 24,
    averageRating: 4.8,
    responseTime: '2.3 hours',
    totalViews: 1247,
    wishlistAdds: 89,
    monthlyEarnings: 12400,
    monthlyViews: 342,
    satisfactionRate: 96,
    repeatCustomers: 18
  };

  const handleBookFormChange = (field, value) => {
    setBookForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddBook = () => {
    console.log('Adding book:', bookForm);
    // Mock book addition
    alert('Book added successfully!');
    setShowAddBookModal(false);
    setBookForm({
      title: '',
      author: '',
      description: '',
      genre: [],
      condition: 'Good',
      price: '',
      forSale: true,
      forLend: false,
      lendingPeriod: 14,
      language: 'English',
      isbn: '',
      publishYear: '',
      images: []
    });
  };

  const handleRequestAction = (requestId, action) => {
    console.log(`${action} request:`, requestId);
    alert(`Request ${action}d successfully!`);
    setShowRequestModal(false);
    setSelectedRequest(null);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-secondary rounded-lg p-6">
        <h2 className="text-2xl font-heading font-bold mb-2">
          Welcome to Your Seller Dashboard
        </h2>
        <p className="text-secondary-dark mb-4">
          Manage your books, track sales, and grow your business on BookHive
        </p>
        <div className="flex flex-wrap gap-4">
          <Button 
            variant="secondary" 
            icon={<Plus size={18} />}
            onClick={() => setShowAddBookModal(true)}
          >
            Add New Book
          </Button>
          <Button 
            variant="outline" 
            className="border-secondary text-secondary hover:bg-secondary/20"
            onClick={() => setActiveTab('analytics')}
            icon={<BarChart3 size={18} />}
          >
            View Analytics
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-primary/20 rounded-lg">
              <BookOpen className="text-primary" size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Books</p>
              <p className="text-xl font-bold">{sellerStats.totalBooks}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-success/20 rounded-lg">
              <DollarSign className="text-success" size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-xl font-bold">Rs. {sellerStats.totalEarnings.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-secondary/20 rounded-lg">
              <Package className="text-secondary" size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Active Loans</p>
              <p className="text-xl font-bold">{sellerStats.activeLoans}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Star className="text-accent" size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-xl font-bold">{sellerStats.averageRating}★</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h3 className="font-heading font-semibold flex items-center">
              <Activity className="mr-2 text-primary" size={18} />
              Recent Activity
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-success rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-sm">Book sold: "The Silent Patient"</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <span className="text-success font-medium">+Rs. 1,500</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-sm">New borrow request</p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-secondary rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-sm">Book returned: "Atomic Habits"</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <span className="text-secondary font-medium">Completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h3 className="font-heading font-semibold flex items-center">
              <Target className="mr-2 text-primary" size={18} />
              Quick Actions
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                fullWidth
                icon={<Plus size={16} />}
                onClick={() => setShowAddBookModal(true)}
              >
                Add Book
              </Button>
              <Button 
                variant="outline" 
                fullWidth
                icon={<MessageSquare size={16} />}
                onClick={() => setActiveTab('requests')}
              >
                View Requests
              </Button>
              <Button 
                variant="outline" 
                fullWidth
                icon={<BarChart3 size={16} />}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </Button>
              <Button 
                variant="outline" 
                fullWidth
                icon={<Settings size={16} />}
                onClick={() => setActiveTab('settings')}
              >
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-heading font-semibold flex items-center">
            <TrendingUp className="mr-2 text-primary" size={18} />
            This Month's Performance
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">Rs. {sellerStats.monthlyEarnings.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Monthly Earnings</p>
              <p className="text-xs text-success">+15% from last month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{sellerStats.monthlyViews}</p>
              <p className="text-sm text-gray-600">Book Views</p>
              <p className="text-xs text-primary">+8% from last month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary">{sellerStats.satisfactionRate}%</p>
              <p className="text-sm text-gray-600">Satisfaction Rate</p>
              <p className="text-xs text-secondary">+2% from last month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{sellerStats.repeatCustomers}</p>
              <p className="text-sm text-gray-600">Repeat Customers</p>
              <p className="text-xs text-accent">+12% from last month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMyBooks = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading font-bold">My Books</h2>
          <p className="text-gray-600">Manage your book listings</p>
        </div>
        <Button 
          variant="primary" 
          icon={<Plus size={18} />}
          onClick={() => setShowAddBookModal(true)}
        >
          Add New Book
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search your books..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value="">All Categories</option>
            <option value="for-sale">For Sale</option>
            <option value="for-lending">For Lending</option>
            <option value="both">Both</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value="">All Conditions</option>
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="very-good">Very Good</option>
            <option value="good">Good</option>
          </select>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellerBooks.map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48">
              <img 
                src={book.cover} 
                alt={book.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                {book.forSale && (
                  <span className="badge badge-primary">For Sale</span>
                )}
                {book.forLend && (
                  <span className="badge badge-secondary">For Lending</span>
                )}
              </div>
              <div className="absolute top-2 left-2">
                <span className={`badge ${
                  book.condition === 'New' ? 'badge-primary' :
                  book.condition === 'Like New' ? 'badge-secondary' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {book.condition}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-heading font-semibold text-lg mb-1">{book.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{book.author}</p>
              
              <div className="flex justify-between items-center mb-3">
                {book.forSale && (
                  <span className="text-lg font-bold text-secondary">Rs. {book.price}</span>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <Eye size={14} className="mr-1" />
                  <span>124 views</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Heart size={14} className="mr-1" />
                  <span>{book.wishlistedCount} wishlisted</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare size={14} className="mr-1" />
                  <span>3 inquiries</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" fullWidth icon={<Eye size={14} />}>
                  View
                </Button>
                <Button variant="outline" size="sm" fullWidth icon={<Edit size={14} />}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" icon={<MoreHorizontal size={14} />}>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading font-bold">Book Requests</h2>
          <p className="text-gray-600">Manage incoming requests for your books</p>
        </div>
        <div className="flex items-center space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value="">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {sellerRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <img 
                  src={request.book.cover} 
                  alt={request.book.title}
                  className="w-16 h-20 object-cover rounded"
                />
                <div className="flex-grow">
                  <h3 className="font-heading font-semibold text-lg">{request.book.title}</h3>
                  <p className="text-gray-600">{request.book.author}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      request.status === 'Pending' ? 'bg-warning/20 text-warning' :
                      request.status === 'Approved' ? 'bg-success/20 text-success' :
                      'bg-primary/20 text-primary'
                    }`}>
                      {request.status}
                    </span>
                    <span className="text-sm text-gray-500">{request.type} Request</span>
                    <span className="text-sm text-gray-500">{request.createdAt}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <img 
                    src={request.requestor.avatar} 
                    alt={request.requestor.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm">{request.requestor.name}</p>
                    <div className="flex items-center">
                      <Star className="text-primary mr-1" size={12} />
                      <span className="text-xs">{request.requestor.trustScore}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {request.message && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">"{request.message}"</p>
              </div>
            )}
            
            {request.type === 'Borrow' && request.startDate && (
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Start Date:</span>
                  <span className="ml-2 font-medium">{request.startDate}</span>
                </div>
                <div>
                  <span className="text-gray-500">End Date:</span>
                  <span className="ml-2 font-medium">{request.endDate}</span>
                </div>
              </div>
            )}
            
            <div className="mt-4 flex space-x-3">
              {request.status === 'Pending' && (
                <>
                  <Button 
                    variant="primary" 
                    size="sm"
                    icon={<CheckCircle size={14} />}
                    onClick={() => handleRequestAction(request.id, 'approve')}
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    icon={<XCircle size={14} />}
                    onClick={() => handleRequestAction(request.id, 'decline')}
                  >
                    Decline
                  </Button>
                </>
              )}
              <Button 
                variant="outline" 
                size="sm"
                icon={<MessageSquare size={14} />}
              >
                Message
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                icon={<Eye size={14} />}
                onClick={() => {
                  setSelectedRequest(request);
                  setShowRequestModal(true);
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold">Analytics & Insights</h2>
        <p className="text-gray-600">Track your performance and growth</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold">{sellerStats.totalViews}</p>
              <p className="text-xs text-success">+12% this month</p>
            </div>
            <div className="p-2 bg-primary/20 rounded-lg">
              <Eye className="text-primary" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Wishlist Adds</p>
              <p className="text-2xl font-bold">{sellerStats.wishlistAdds}</p>
              <p className="text-xs text-success">+8% this month</p>
            </div>
            <div className="p-2 bg-secondary/20 rounded-lg">
              <Heart className="text-secondary" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Response Time</p>
              <p className="text-2xl font-bold">{sellerStats.responseTime}</p>
              <p className="text-xs text-success">-0.5h this month</p>
            </div>
            <div className="p-2 bg-accent/20 rounded-lg">
              <Clock className="text-accent" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Satisfaction</p>
              <p className="text-2xl font-bold">{sellerStats.satisfactionRate}%</p>
              <p className="text-xs text-success">+2% this month</p>
            </div>
            <div className="p-2 bg-success/20 rounded-lg">
              <Award className="text-success" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-heading font-semibold mb-4 flex items-center">
            <BarChart3 className="mr-2 text-primary" size={18} />
            Monthly Earnings
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart visualization would go here</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-heading font-semibold mb-4 flex items-center">
            <PieChart className="mr-2 text-primary" size={18} />
            Book Categories
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart visualization would go here</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold">Seller Settings</h2>
        <p className="text-gray-600">Manage your seller preferences and account settings</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-heading font-semibold mb-4">Seller Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                defaultValue={currentSeller.name}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                defaultValue={currentSeller.email}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+94 77 123 4567"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                defaultValue={currentSeller.location}
                className="input"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seller Bio
            </label>
            <textarea
              rows={3}
              defaultValue={currentSeller.bio}
              className="input"
              placeholder="Tell customers about your book collection and selling experience..."
            />
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-heading font-semibold mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Book Requests</p>
                <p className="text-sm text-gray-600">Get notified when someone requests your books</p>
              </div>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Payment Notifications</p>
                <p className="text-sm text-gray-600">Receive alerts for successful payments</p>
              </div>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Return Reminders</p>
                <p className="text-sm text-gray-600">Get reminded about upcoming book returns</p>
              </div>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
          </div>
        </div>

        {/* Pricing Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-heading font-semibold mb-4">Default Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Lending Period (days)
              </label>
              <input
                type="number"
                defaultValue="14"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Security Deposit Percentage
              </label>
              <input
                type="number"
                defaultValue="20"
                className="input"
                placeholder="20%"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary">
          Save Settings
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
    
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-8">
                {/* Seller Info */}
                <div className="text-center mb-6">
                  <img 
                    src={currentSeller.avatar} 
                    alt={currentSeller.name}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-primary"
                  />
                  <h3 className="font-heading font-semibold">{currentSeller.name}</h3>
                  <div className="flex items-center justify-center mt-1">
                    <Star className="text-primary mr-1" size={16} />
                    <span className="text-sm font-medium">{currentSeller.trustScore}</span>
                  </div>
                  <div className="mt-2">
                    <span className="badge badge-primary">Verified Seller</span>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'overview' 
                        ? 'bg-primary/20 text-primary' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <BarChart3 className="mr-3" size={18} />
                    Overview
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('books')}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'books' 
                        ? 'bg-primary/20 text-primary' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <BookOpen className="mr-3" size={18} />
                    My Books
                    <span className="ml-auto bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {sellerBooks.length}
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('requests')}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'requests' 
                        ? 'bg-primary/20 text-primary' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <MessageSquare className="mr-3" size={18} />
                    Requests
                    {sellerRequests.filter(r => r.status === 'Pending').length > 0 && (
                      <span className="ml-auto bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {sellerRequests.filter(r => r.status === 'Pending').length}
                      </span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'analytics' 
                        ? 'bg-primary/20 text-primary' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <TrendingUp className="mr-3" size={18} />
                    Analytics
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'settings' 
                        ? 'bg-primary/20 text-primary' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Settings className="mr-3" size={18} />
                    Settings
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'books' && renderMyBooks()}
              {activeTab === 'requests' && renderRequests()}
              {activeTab === 'analytics' && renderAnalytics()}
              {activeTab === 'settings' && renderSettings()}
            </div>
          </div>
        </div>
      </main>

      {/* Add Book Modal */}
      {showAddBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-heading font-bold mb-2">Add New Book</h3>
                  <p className="text-gray-600">Fill in the details to list your book</p>
                </div>
                <button 
                  onClick={() => setShowAddBookModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Book Title
                    </label>
                    <input
                      type="text"
                      value={bookForm.title}
                      onChange={(e) => handleBookFormChange('title', e.target.value)}
                      className="input"
                      placeholder="Enter book title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      value={bookForm.author}
                      onChange={(e) => handleBookFormChange('author', e.target.value)}
                      className="input"
                      placeholder="Enter author name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={bookForm.description}
                    onChange={(e) => handleBookFormChange('description', e.target.value)}
                    className="input"
                    placeholder="Describe the book..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Condition
                    </label>
                    <select
                      value={bookForm.condition}
                      onChange={(e) => handleBookFormChange('condition', e.target.value)}
                      className="input"
                    >
                      <option value="New">New</option>
                      <option value="Like New">Like New</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Acceptable">Acceptable</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      value={bookForm.language}
                      onChange={(e) => handleBookFormChange('language', e.target.value)}
                      className="input"
                    >
                      <option value="English">English</option>
                      <option value="Sinhala">Sinhala</option>
                      <option value="Tamil">Tamil</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={bookForm.forSale}
                        onChange={(e) => handleBookFormChange('forSale', e.target.checked)}
                        className="mr-2"
                      />
                      For Sale
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={bookForm.forLend}
                        onChange={(e) => handleBookFormChange('forLend', e.target.checked)}
                        className="mr-2"
                      />
                      For Lending
                    </label>
                  </div>
                  
                  {bookForm.forSale && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (Rs.)
                      </label>
                      <input
                        type="number"
                        value={bookForm.price}
                        onChange={(e) => handleBookFormChange('price', e.target.value)}
                        className="input"
                        placeholder="Enter price"
                      />
                    </div>
                  )}
                  
                  {bookForm.forLend && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lending Period (days)
                      </label>
                      <input
                        type="number"
                        value={bookForm.lendingPeriod}
                        onChange={(e) => handleBookFormChange('lendingPeriod', parseInt(e.target.value))}
                        className="input"
                        placeholder="14"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button 
                  variant="outline"
                  onClick={() => setShowAddBookModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary"
                  onClick={handleAddBook}
                  disabled={!bookForm.title || !bookForm.author}
                >
                  Add Book
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {showRequestModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-heading font-bold mb-2">Request Details</h3>
              <p className="text-gray-600">#{selectedRequest.id}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={selectedRequest.book.cover} 
                  alt={selectedRequest.book.title}
                  className="w-12 h-16 object-cover rounded"
                />
                <div>
                  <h4 className="font-semibold">{selectedRequest.book.title}</h4>
                  <p className="text-sm text-gray-600">{selectedRequest.book.author}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <img 
                  src={selectedRequest.requestor.avatar} 
                  alt={selectedRequest.requestor.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{selectedRequest.requestor.name}</p>
                  <div className="flex items-center">
                    <Star className="text-primary mr-1" size={12} />
                    <span className="text-sm">{selectedRequest.requestor.trustScore}</span>
                  </div>
                </div>
              </div>
              
              {selectedRequest.message && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">"{selectedRequest.message}"</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex space-x-3">
              <Button 
                variant="outline" 
                fullWidth
                onClick={() => setShowRequestModal(false)}
              >
                Close
              </Button>
              <Button 
                variant="primary" 
                fullWidth
                icon={<MessageSquare size={16} />}
              >
                Message
              </Button>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default SellerDashboardPage;