import React, { useState } from 'react';
import { BookOpen, Users, MessageSquare, AlertTriangle, Ban, Eye, Plus } from 'lucide-react';

const BookCircle = () => {
  const [activeTab, setActiveTab] = useState('circles');

  const bookCircles = [
    {
      id: 1,
      name: 'Modern Fiction Enthusiasts',
      members: 245,
      posts: 127,
      moderationLevel: 'low',
      lastActivity: '2 hours ago',
      status: 'active',
      reports: 2
    },
    {
      id: 2,
      name: 'Classic Literature Society',
      members: 189,
      posts: 89,
      moderationLevel: 'medium',
      lastActivity: '1 day ago',
      status: 'active',
      reports: 0
    },
    {
      id: 3,
      name: 'Science Fiction Universe',
      members: 312,
      posts: 234,
      moderationLevel: 'high',
      lastActivity: '30 minutes ago',
      status: 'monitored',
      reports: 5
    }
  ];

  const reportedContent = [
    {
      id: 1,
      circleId: 1,
      circleName: 'Modern Fiction Enthusiasts',
      reportedBy: 'user_sarah_92',
      reportType: 'Inappropriate Content',
      content: 'This book recommendation contains offensive language and inappropriate themes...',
      reportDate: '2024-01-15 14:30',
      status: 'pending',
      severity: 'medium'
    },
    {
      id: 2,
      circleId: 3,
      circleName: 'Science Fiction Universe',
      reportedBy: 'bookworm_alex',
      reportType: 'Spam',
      content: 'User keeps posting the same promotional content repeatedly...',
      reportDate: '2024-01-15 12:15',
      status: 'pending',
      severity: 'low'
    },
    {
      id: 3,
      circleId: 3,
      circleName: 'Science Fiction Universe',
      reportedBy: 'reader_mike_87',
      reportType: 'Harassment',
      content: 'User has been making personal attacks against other members...',
      reportDate: '2024-01-15 09:45',
      status: 'investigating',
      severity: 'high'
    }
  ];

  const moderationActions = [
    {
      id: 1,
      action: 'Temporary Ban',
      user: 'problem_user_123',
      reason: 'Repeated policy violations',
      duration: '7 days',
      date: '2024-01-15 16:20',
      moderator: 'Alex Johnson'
    },
    {
      id: 2,
      action: 'Content Removed',
      user: 'spam_account_456',
      reason: 'Promotional spam',
      duration: 'Permanent',
      date: '2024-01-15 14:45',
      moderator: 'Alex Johnson'
    },
    {
      id: 3,
      action: 'Warning Issued',
      user: 'new_reader_789',
      reason: 'Off-topic discussions',
      duration: 'N/A',
      date: '2024-01-15 11:30',
      moderator: 'Alex Johnson'
    }
  ];

  const getModerationColor = (level) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'monitored': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Circles</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">28</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Members</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1,247</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Reports</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">7</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Actions Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
            </div>
            <Ban className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('circles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'circles'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Book Circles
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reported Content
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'actions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Moderation Actions
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'circles' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {bookCircles.map((circle) => (
                <div key={circle.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{circle.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">Last activity: {circle.lastActivity}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(circle.status)}`}>
                        {circle.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModerationColor(circle.moderationLevel)}`}>
                        {circle.moderationLevel} risk
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{circle.members}</p>
                      <p className="text-gray-600 text-sm">Members</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{circle.posts}</p>
                      <p className="text-gray-600 text-sm">Posts</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${circle.reports > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {circle.reports}
                      </p>
                      <p className="text-gray-600 text-sm">Reports</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </button>
                    <div className="flex space-x-2">
                      <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">Settings</button>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">Moderate</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-4">
              {reportedContent.map((report) => (
                <div 
                  key={report.id}
                  className={`p-6 rounded-lg border-l-4 ${getSeverityColor(report.severity)} bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{report.reportType}</h3>
                        <span className="text-gray-600 text-sm">in {report.circleName}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.severity === 'high' ? 'bg-red-100 text-red-700' :
                          report.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {report.severity} severity
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{report.content}</p>
                      <p className="text-sm text-gray-600">
                        Reported by: {report.reportedBy} • {report.reportDate}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                        Investigate
                      </button>
                      <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                        Resolve
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-4">
              {moderationActions.map((action) => (
                <div key={action.id} className="p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{action.action}</h3>
                        <span className="text-gray-600">against {action.user}</span>
                      </div>
                      <p className="text-gray-600 mb-2">{action.reason}</p>
                      <p className="text-sm text-gray-600">
                        Duration: {action.duration} • By: {action.moderator} • {action.date}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Details</button>
                      <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">Undo</button>
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
          <span>Create Circle</span>
        </button>
      </div>
    </div>
  );
};

export default BookCircle;