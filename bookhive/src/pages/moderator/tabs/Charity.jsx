import React, { useState } from 'react';
import { Heart, Plus, Eye, CheckCircle, Clock, Users, BookOpen, Calendar } from 'lucide-react';

const Charity = () => {
  const [activeTab, setActiveTab] = useState('requests');

  const donationRequests = [
    {
      id: 1,
      organization: 'City Public Library',
      requestDate: '2024-01-15',
      booksRequested: 150,
      category: 'Children Literature',
      status: 'pending',
      priority: 'high',
      description: 'Request for children\'s books to support literacy program in underserved communities.'
    },
    {
      id: 2,
      organization: 'Rural Education Foundation',
      requestDate: '2024-01-14',
      booksRequested: 200,
      category: 'Educational',
      status: 'approved',
      priority: 'medium',
      description: 'Textbooks needed for rural schools lacking educational resources.'
    },
    {
      id: 3,
      organization: 'Senior Center Reading Club',
      requestDate: '2024-01-13',
      booksRequested: 75,
      category: 'Fiction',
      status: 'pending',
      priority: 'low',
      description: 'Large print books for elderly readers in community center.'
    }
  ];

  const activeEvents = [
    {
      id: 1,
      title: 'Books for Children Initiative',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      booksCollected: 450,
      targetBooks: 500,
      participants: 127,
      status: 'active'
    },
    {
      id: 2,
      title: 'Winter Reading Drive',
      startDate: '2024-01-10',
      endDate: '2024-02-10',
      booksCollected: 125,
      targetBooks: 300,
      participants: 45,
      status: 'active'
    },
    {
      id: 3,
      title: 'Educational Resources Campaign',
      startDate: '2023-12-15',
      endDate: '2024-01-15',
      booksCollected: 300,
      targetBooks: 250,
      participants: 89,
      status: 'completed'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-error';
      case 'medium': return 'border-l-secondary';
      case 'low': return 'border-l-success';
      default: return 'border-l-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Charity Management</h1>
          <p className="text-gray-600 mt-1">Manage donation requests and charity events</p>
        </div>
        <button className="bg-secondary hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Create Event</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-cardBg rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Requests</p>
              <p className="text-2xl font-bold text-textPrimary mt-1">8</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-cardBg rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Events</p>
              <p className="text-2xl font-bold text-textPrimary mt-1">5</p>
            </div>
            <Heart className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-cardBg rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Books Donated</p>
              <p className="text-2xl font-bold text-textPrimary mt-1">2,847</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-cardBg rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Participants</p>
              <p className="text-2xl font-bold text-textPrimary mt-1">456</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-cardBg rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Donation Requests
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'events'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active Events
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'requests' && (
            <div className="space-y-4">
              {donationRequests.map((request) => (
                <div 
                  key={request.id}
                  className={`p-6 rounded-lg border-l-4 ${getPriorityColor(request.priority)} bg-gray-50 hover:bg-gray-100 transition-colors`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-textPrimary">{request.organization}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.priority === 'high' ? 'bg-red-100 text-red-700' :
                          request.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {request.priority} priority
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{request.description}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Requested:</span>
                          <p className="font-medium">{request.booksRequested} books</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <p className="font-medium">{request.category}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <p className="font-medium">{request.requestDate}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="p-2 text-accent hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      {request.status === 'pending' && (
                        <button className="p-2 text-success hover:bg-green-50 rounded-lg transition-colors">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-textPrimary">{event.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {event.startDate} - {event.endDate}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{event.booksCollected}/{event.targetBooks} books</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-success h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min((event.booksCollected / event.targetBooks) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{event.participants} participants</span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-accent hover:text-primary text-sm font-medium">Edit</button>
                        <button className="text-gray-600 hover:text-textPrimary text-sm font-medium">View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Charity;