import { useState } from 'react';
import {
  MessageSquare,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Plus
} from 'lucide-react';

const Support = () => {
  const [message, setMessage] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const supportTickets = [
    {
      id: 'T001',
      subject: 'Agent Vehicle Breakdown',
      message: 'Agent John Smith reports vehicle breakdown on Route 95. Need immediate assistance.',
      priority: 'High',
      status: 'Open',
      createdAt: '2 hours ago',
      responses: [
        {
          from: 'Support Team',
          message: 'We have received your request and are dispatching a replacement vehicle.',
          time: '1 hour ago'
        }
      ]
    },
    {
      id: 'T002',
      subject: 'System Access Issue',
      message: 'Unable to access delivery tracking system since morning. Getting error 500.',
      priority: 'Medium',
      status: 'In Progress',
      createdAt: '4 hours ago',
      responses: [
        {
          from: 'Support Team',
          message: 'We are investigating the server issues. Will update you shortly.',
          time: '3 hours ago'
        },
        {
          from: 'Manager',
          message: 'The issue seems to be with the authentication service.',
          time: '2 hours ago'
        }
      ]
    },
    {
      id: 'T003',
      subject: 'Hub Capacity Management',
      message: 'North Hub is consistently reaching 95% capacity. Need guidance on expansion.',
      priority: 'Low',
      status: 'Resolved',
      createdAt: '1 day ago',
      responses: [
        {
          from: 'Support Team',
          message: 'Please submit a formal capacity expansion request with usage analytics.',
          time: '1 day ago'
        }
      ]
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-600 text-white';
      case 'Medium':
        return 'bg-yellow-400 text-white';
      case 'Low':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open':
        return <AlertCircle className="text-red-600" size={16} />;
      case 'In Progress':
        return <Clock className="text-yellow-400" size={16} />;
      case 'Resolved':
        return <CheckCircle className="text-green-600" size={16} />;
      default:
        return <Clock className="text-gray-400" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-red-600 text-white';
      case 'In Progress':
        return 'bg-yellow-400 text-white';
      case 'Resolved':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleCreateTicket = () => {
    console.log('Creating new support ticket');
  };

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Open Tickets</p>
              <p className="text-2xl font-bold text-red-600 font-heading">
                {supportTickets.filter(t => t.status === 'Open').length}
              </p>
            </div>
            <MessageSquare className="text-red-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-2xl font-bold text-yellow-400 font-heading">
                {supportTickets.filter(t => t.status === 'In Progress').length}
              </p>
            </div>
            <Clock className="text-yellow-400" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Resolved</p>
              <p className="text-2xl font-bold text-green-600 font-heading">
                {supportTickets.filter(t => t.status === 'Resolved').length}
              </p>
            </div>
            <CheckCircle className="text-green-600" size={32} />
          </div>
        </div>
        <div className="bg-cardBg rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg Response Time</p>
              <p className="text-2xl font-bold text-textPrimary mt-1">2.5h</p>
            </div>
            <AlertCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support Tickets */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 font-heading">
            Support Tickets
          </h3>

          <div className="space-y-4">
            {supportTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${selectedTicket?.id === ticket.id ? 'border-blue-900 bg-blue-50' : 'border-gray-200'
                  }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-slate-900">{ticket.subject}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(ticket.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ticket.message}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{ticket.id}</span>
                  <span>{ticket.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Details / Conversation */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          {selectedTicket ? (
            <div className="h-full flex flex-col">
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 font-heading">
                  {selectedTicket.subject}
                </h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{selectedTicket.message}</p>
              </div>

              {/* Conversation */}
              <div className="flex-1 space-y-4 mb-4">
                {selectedTicket.responses.map((response, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-900">{response.from}</span>
                      <span className="text-xs text-gray-500">{response.time}</span>
                    </div>
                    <p className="text-sm text-gray-700">{response.message}</p>
                  </div>
                ))}
              </div>

              {/* Reply */}
              {selectedTicket.status !== 'Resolved' && (
                <div className="border-t pt-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your response..."
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <MessageSquare className="mx-auto mb-4" size={48} />
                <p>Select a ticket to view conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Contact */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 font-heading">
          Quick Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <MessageSquare className="mx-auto mb-2 text-blue-600" size={24} />
            <h4 className="font-medium text-slate-900 mb-1">Live Chat</h4>
            <p className="text-sm text-gray-600 mb-2">Get instant help</p>
            <button className="text-blue-600 text-sm font-medium hover:underline">
              Start Chat
            </button>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <AlertCircle className="mx-auto mb-2 text-yellow-400" size={24} />
            <h4 className="font-medium text-slate-900 mb-1">Emergency</h4>
            <p className="text-sm text-gray-600 mb-2">Critical issues only</p>
            <button className="text-yellow-400 text-sm font-medium hover:underline">
              Call Now
            </button>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <CheckCircle className="mx-auto mb-2 text-green-600" size={24} />
            <h4 className="font-medium text-slate-900 mb-1">Knowledge Base</h4>
            <p className="text-sm text-gray-600 mb-2">Self-help resources</p>
            <button className="text-green-600 text-sm font-medium hover:underline">
              Browse FAQ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;