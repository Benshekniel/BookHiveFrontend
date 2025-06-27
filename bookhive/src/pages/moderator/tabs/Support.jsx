import React, { useState } from 'react';
import { MessageSquare, Clock, CheckCircle, AlertCircle, User, Plus } from 'lucide-react';

const Support = () => {
  const [activeTab, setActiveTab] = useState('tickets');

  const supportTickets = [
    {
      id: 'TK-1001',
      subject: 'Unable to complete book exchange',
      user: 'john_reader_42',
      category: 'Transaction',
      priority: 'high',
      status: 'open',
      created: '2024-01-15 09:30',
      lastUpdate: '2024-01-15 14:20',
      assignedTo: 'Alex Johnson',
      messages: 3
    },
    {
      id: 'TK-1002',
      subject: 'Account verification issues',
      user: 'new_user_sarah',
      category: 'Account',
      priority: 'medium',
      status: 'in-progress',
      created: '2024-01-15 11:15',
      lastUpdate: '2024-01-15 12:45',
      assignedTo: 'Alex Johnson',
      messages: 5
    },
    {
      id: 'TK-1003',
      subject: 'TrustScore calculation error',
      user: 'bookworm_mike',
      category: 'Technical',
      priority: 'low',
      status: 'resolved',
      created: '2024-01-14 16:20',
      lastUpdate: '2024-01-15 10:30',
      assignedTo: 'System Admin',
      messages: 2
    },
    {
      id: 'TK-1004',
      subject: 'Inappropriate content in book circle',
      user: 'concerned_reader',
      category: 'Content Moderation',
      priority: 'high',
      status: 'escalated',
      created: '2024-01-15 13:45',
      lastUpdate: '2024-01-15 15:10',
      assignedTo: 'Senior Moderator',
      messages: 7
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'response',
      user: 'john_reader_42',
      ticket: 'TK-1001',
      action: 'User replied to ticket',
      time: '15 minutes ago'
    },
    {
      id: 2,
      type: 'escalation',
      user: 'concerned_reader',
      ticket: 'TK-1004',
      action: 'Ticket escalated to senior moderator',
      time: '1 hour ago'
    },
    {
      id: 3,
      type: 'resolution',
      user: 'bookworm_mike',
      ticket: 'TK-1003',
      action: 'Ticket marked as resolved',
      time: '2 hours ago'
    },
    {
      id: 4,
      type: 'assignment',
      user: 'new_user_sarah',
      ticket: 'TK-1002',
      action: 'Ticket assigned to Alex Johnson',
      time: '3 hours ago'
    }
  ];

  const quickResponses = [
    {
      id: 1,
      title: 'Account Verification',
      template: 'Thank you for contacting support. To verify your account, please provide a clear photo of your government-issued ID. Make sure all information is clearly visible and matches your profile details.'
    },
    {
      id: 2,
      title: 'Book Exchange Issue',
      template: 'We understand you\'re experiencing issues with your book exchange. We\'re investigating this matter and will update you within 24 hours with a resolution.'
    },
    {
      id: 3,
      title: 'TrustScore Question',
      template: 'Your TrustScore is calculated based on successful exchanges, community feedback, and platform activity. If you believe there\'s an error, please provide details about your recent transactions.'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'escalated': return 'bg-red-100 text-red-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
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

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Transaction': return '💳';
      case 'Account': return '👤';
      case 'Technical': return '🔧';
      case 'Content Moderation': return '🛡️';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
    
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Open Tickets</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">23</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Resolved Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2.5h</p>
            </div>
            <AlertCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tickets'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Support Tickets
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'activity'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Recent Activity
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Quick Responses
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'tickets' && (
            <div className="space-y-4">
              {supportTickets.map((ticket) => (
                <div 
                  key={ticket.id}
                  className={`p-6 rounded-lg border-l-4 ${getPriorityColor(ticket.priority)} bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{getCategoryIcon(ticket.category)}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{ticket.subject}</h3>
                          <p className="text-gray-600 text-sm">Ticket #{ticket.id}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                          ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {ticket.priority}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        User: {ticket.user} • Category: {ticket.category} • Created: {ticket.created} • Messages: {ticket.messages}
                      </p>

                      <p className="text-sm text-gray-500">
                        Assigned to: {ticket.assignedTo} • Last update: {ticket.lastUpdate}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                        Reply
                      </button>
                      {ticket.status === 'open' && (
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                          Assign
                        </button>
                      )}
                      {ticket.status === 'in-progress' && (
                        <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-600">
                      User: {activity.user} • Ticket: {activity.ticket} • {activity.time}
                    </p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {quickResponses.map((template) => (
                <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{template.title}</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Edit
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{template.template}</p>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                      Use Template
                    </button>
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors">
                      Copy
                    </button>
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
          <span>Create Ticket</span>
        </button>
      </div>
    </div>
  );
};

export default Support;