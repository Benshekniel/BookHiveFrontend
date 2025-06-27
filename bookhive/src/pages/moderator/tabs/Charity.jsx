import React, { useState } from 'react';
import { Heart, Plus, Eye, CheckCircle, Clock, Users, BookOpen, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

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

  const impactMetrics = {
    totalBooks: 2847,
    beneficiaries: 1256,
    organizations: 45,
    geographicReach: 12
  };

  const monthlyDonations = [
    { month: 'Jan', books: 450, beneficiaries: 180 },
    { month: 'Feb', books: 380, beneficiaries: 150 },
    { month: 'Mar', books: 520, beneficiaries: 210 },
    { month: 'Apr', books: 340, beneficiaries: 140 },
    { month: 'May', books: 480, beneficiaries: 190 },
    { month: 'Jun', books: 420, beneficiaries: 170 }
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
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  // Add more months: July and after
  const extendedMonthlyDonations = [
    ...monthlyDonations,
    { month: 'Jul', books: 390, beneficiaries: 160 },
    { month: 'Aug', books: 510, beneficiaries: 200 },
    { month: 'Sep', books: 470, beneficiaries: 185 },
    { month: 'Oct', books: 430, beneficiaries: 175 },
    { month: 'Nov', books: 495, beneficiaries: 195 },
    { month: 'Dec', books: 520, beneficiaries: 210 }
  ];

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Events</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
            </div>
            <Heart className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Books Donated</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2,847</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Participants</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">456</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Books Donated Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Book Donations</h3>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={extendedMonthlyDonations} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="books" fill="#3b82f6" name="Books Donated" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Beneficiaries Reached Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Beneficiaries Reached</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={extendedMonthlyDonations} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="beneficiaries" fill="#22c55e" name="Beneficiaries" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'requests'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Donation Requests
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'events'
                  ? 'border-blue-600 text-blue-600'
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
                  className={`p-6 rounded-lg border-l-4 ${getPriorityColor(request.priority)} bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{request.organization}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.priority === 'high' ? 'bg-red-100 text-red-700' :
                            request.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                          }`}>
                          {request.priority} priority
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{request.description}</p>
                      <p className="text-sm text-gray-600">
                        Requested: {request.booksRequested} books • Category: {request.category} • Date: {request.requestDate}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      {request.status === 'pending' && (
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
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
                      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
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
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
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
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                        <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Create Event</span>
        </button>
      </div>
    </div>
  );
};

export default Charity;