import React, { useState } from 'react';
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  ChevronRight,
  HelpCircle,
  FileText,
  Users,
  Settings,
  CreditCard,
  Package,
  Shield,
  Zap,
  BookOpen,
  Star,
  Filter,
  Calendar,
  User,
  ArrowRight
} from 'lucide-react';

const Support = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  // Support options
  const supportOptions = [
    {
      title: 'Quick Help',
      description: 'Find answers to common questions',
      icon: HelpCircle,
      color: 'bg-blue-50 text-blue-600',
      action: 'Browse FAQ',
      actionColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: MessageCircle,
      color: 'bg-green-50 text-green-600',
      action: 'Start Chat',
      actionColor: 'bg-green-600 hover:bg-green-700'
    }
  ];

  // Recent support tickets
  const recentTickets = [
    {
      id: '#SUP-2025-0043',
      title: 'Issue with payment processing',
      status: 'In Progress',
      statusColor: 'bg-yellow-100 text-yellow-800',
      created: '2 hours ago',
      priority: 'High',
      category: 'Payment'
    },
    {
      id: '#SUP-2025-0044',
      title: 'Book listing not appearing in search',
      status: 'Resolved',
      statusColor: 'bg-green-100 text-green-800',
      created: 'Yesterday',
      priority: 'Medium',
      category: 'Listings'
    },
    {
      id: '#SUP-2025-0043',
      title: 'Account verification help needed',
      status: 'Resolved',
      statusColor: 'bg-green-100 text-green-800',
      created: '3 days ago',
      priority: 'Low',
      category: 'Account'
    }
  ];

  // Popular help topics
  const popularTopics = [
    {
      title: 'How to list a new book',
      category: 'Listings',
      views: '2.3k views',
      icon: BookOpen,
      color: 'text-blue-600'
    },
    {
      title: 'Payment processing issues',
      category: 'Payments',
      views: '1.8k views',
      icon: CreditCard,
      color: 'text-green-600'
    },
    {
      title: 'Managing book exchanges',
      category: 'Exchanges',
      views: '1.5k views',
      icon: Package,
      color: 'text-purple-600'
    },
    {
      title: 'Account verification process',
      category: 'Account',
      views: '1.2k views',
      icon: Shield,
      color: 'text-yellow-600'
    },
    {
      title: 'Store profile optimization',
      category: 'Store Management',
      views: '980 views',
      icon: Settings,
      color: 'text-indigo-600'
    },
    {
      title: 'Customer communication best practices',
      category: 'Communication',
      views: '756 views',
      icon: Users,
      color: 'text-pink-600'
    }
  ];

  // FAQ categories
  const faqCategories = [
    { name: 'All Categories', count: 45 },
    { name: 'Getting Started', count: 8 },
    { name: 'Listings', count: 12 },
    { name: 'Payments', count: 7 },
    { name: 'Exchanges', count: 9 },
    { name: 'Account', count: 6 },
    { name: 'Store Management', count: 3 }
  ];

  // Contact methods
  const contactMethods = [
    {
      method: 'Live Chat',
      description: 'Available 24/7 for immediate assistance',
      icon: MessageCircle,
      color: 'bg-green-50 text-green-600',
      availability: 'Online now',
      availabilityColor: 'text-green-600'
    },
    {
      method: 'Phone Support',
      description: '+1 (555) 123-BOOK',
      icon: Phone,
      color: 'bg-blue-50 text-blue-600',
      availability: 'Mon-Fri 9AM-6PM EST',
      availabilityColor: 'text-gray-600'
    },
    {
      method: 'Email Support',
      description: 'support@bookhive.com',
      icon: Mail,
      color: 'bg-purple-50 text-purple-600',
      availability: 'Response within 24 hours',
      availabilityColor: 'text-gray-600'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
            <p className="text-gray-600">Get help with your BookHive store</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
              <Phone className="w-4 h-4 mr-2" />
              Call Support
            </button>
            <button 
              onClick={() => setShowNewTicketModal(true)}
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for help articles, FAQs, or support topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {supportOptions.map((option, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-4">
              <div className={`p-4 rounded-xl ${option.color} mr-4`}>
                <option.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{option.title}</h3>
                <p className="text-gray-600">{option.description}</p>
              </div>
            </div>
            <button className={`w-full flex items-center justify-center px-6 py-3 text-white rounded-lg transition-colors ${option.actionColor}`}>
              {option.action}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Support Tickets */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Support Tickets</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentTickets.map((ticket, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{ticket.title}</h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm text-gray-500">{ticket.id}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">Created {ticket.created}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${ticket.statusColor}`}>
                      {ticket.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Contact Support</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {contactMethods.map((contact, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg ${contact.color} mr-3 mt-1`}>
                      <contact.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{contact.method}</h4>
                      <p className="text-sm text-gray-600 mb-2">{contact.description}</p>
                      <p className={`text-xs ${contact.availabilityColor}`}>{contact.availability}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popular Help Topics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Popular Help Topics</h3>
            <div className="flex items-center space-x-3">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {faqCategories.map((category, index) => (
                  <option key={index} value={category.name}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTopics.map((topic, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <topic.icon className={`w-5 h-5 ${topic.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2 leading-tight">{topic.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{topic.category}</span>
                      <span className="text-xs text-gray-500">{topic.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Create New Ticket</h3>
                <button 
                  onClick={() => setShowNewTicketModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of your issue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Select a category</option>
                    <option>Account Issues</option>
                    <option>Payment Problems</option>
                    <option>Listing Issues</option>
                    <option>Exchange Problems</option>
                    <option>Technical Support</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please provide detailed information about your issue..."
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                  Create Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;