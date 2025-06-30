import React, { useState } from 'react';
import { BookOpen, Plus, Search, Filter, Eye } from 'lucide-react';

const BookRequest = () => {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');

  const requests = [
    {
      id: 1,
      title: 'Mathematics Textbooks Grade 10',
      subject: 'Mathematics',
      quantity: 25,
      description: 'Need basic algebra and geometry textbooks for 25 students in rural area',
      status: 'approved',
      dateRequested: '2024-01-15',
      urgency: 'high'
    },
    {
      id: 2,
      title: 'English Literature Collection',
      subject: 'English',
      quantity: 15,
      description: 'Classic literature books for high school reading program',
      status: 'pending',
      dateRequested: '2024-01-14',
      urgency: 'medium'
    },
    {
      id: 3,
      title: 'Science Laboratory Manuals',
      subject: 'Science',
      quantity: 30,
      description: 'Physics, Chemistry, and Biology lab manuals for practical sessions',
      status: 'delivered',
      dateRequested: '2024-01-10',
      urgency: 'low'
    }
  ];

  const filteredRequests = requests.filter(request => 
    filter === 'all' || request.status === filter
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-success/10 text-success';
      case 'pending': return 'bg-secondary/10 text-primary';
      case 'delivered': return 'bg-accent/10 text-accent';
      case 'rejected': return 'bg-error/10 text-error';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-error/10 text-error';
      case 'medium': return 'bg-secondary/10 text-primary';
      case 'low': return 'bg-success/10 text-success';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-textPrimary">Book Requests</h1>
          <p className="text-gray-600 mt-2">Manage your book requests and track their status</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>New Request</span>
        </button>
      </div>

      {/* New Request Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-heading font-semibold text-textPrimary mb-4">
            Create New Book Request
          </h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Book Title/Subject
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  placeholder="Mathematics Grade 10 Textbooks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Subject Category
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors">
                  <option>Mathematics</option>
                  <option>English</option>
                  <option>Science</option>
                  <option>History</option>
                  <option>Geography</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Quantity Needed
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">
                  Urgency Level
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors">
                  <option>High - Urgent</option>
                  <option>Medium - Moderate</option>
                  <option>Low - Can Wait</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Description of Need
              </label>
              <textarea
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                placeholder="Please describe why you need these books, who will benefit, and any specific requirements..."
              ></textarea>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Submit Request
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search requests..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="delivered">Delivered</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-heading font-semibold text-textPrimary">
                        {request.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Priority
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{request.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>Subject: {request.subject}</span>
                      <span>Quantity: {request.quantity} books</span>
                      <span>Requested: {request.dateRequested}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-primary transition-colors">
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? "You haven't made any book requests yet." 
              : `No ${filter} requests found.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default BookRequest;