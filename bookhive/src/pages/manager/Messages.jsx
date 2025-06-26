import { useState } from 'react';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  AlertCircle,
  Clock,
  CheckCircle,
  User
} from 'lucide-react';

const Messages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const messages = [
    {
      id: 'M001',
      from: 'John Smith',
      type: 'Agent',
      subject: 'Delivery Delay - Traffic Issue',
      preview: 'Heavy traffic on Route 95, estimated 15 min delay for delivery D045...',
      time: '5 mins ago',
      status: 'unread',
      priority: 'high'
    },
    {
      id: 'M002',
      from: 'System Alert',
      type: 'System',
      subject: 'New Delivery Request Received',
      preview: 'New delivery request from Downtown Hub requires immediate assignment...',
      time: '12 mins ago',
      status: 'read',
      priority: 'medium'
    },
    {
      id: 'M003',
      from: 'Sarah Johnson',
      type: 'Agent',
      subject: 'Vehicle Maintenance Required',
      preview: 'My van needs urgent maintenance, requesting backup vehicle for today...',
      time: '1 hour ago',
      status: 'unread',
      priority: 'high'
    },
    {
      id: 'M004',
      from: 'Mike Wilson',
      type: 'Agent',
      subject: 'Delivery Completed Successfully',
      preview: 'Package D032 delivered successfully. Customer very satisfied...',
      time: '2 hours ago',
      status: 'read',
      priority: 'low'
    },
    {
      id: 'M005',
      from: 'Hub Supervisor',
      type: 'Hub',
      subject: 'Capacity Alert - North Hub',
      preview: 'North Hub approaching 90% capacity, consider redirecting new packages...',
      time: '3 hours ago',
      status: 'unread',
      priority: 'medium'
    },
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Agent':
        return <User className="text-blue-600" size={16} />;
      case 'System':
        return <AlertCircle className="text-yellow-400" size={16} />;
      case 'Hub':
        return <MessageSquare className="text-green-600" size={16} />;
      default:
        return <MessageSquare className="text-gray-400" size={16} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-600 bg-red-50';
      case 'medium':
        return 'border-l-yellow-400 bg-yellow-50';
      case 'low':
        return 'border-l-green-600 bg-green-50';
      default:
        return 'border-l-gray-300 bg-gray-50';
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.from.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'unread' && message.status === 'unread') ||
                         (selectedFilter === 'agents' && message.type === 'Agent') ||
                         (selectedFilter === 'system' && message.type === 'System') ||
                         (selectedFilter === 'hubs' && message.type === 'Hub');
    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Messages</h2>
          <p className="text-gray-600">Communication center for agents and system alerts</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {unreadCount} Unread
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-transparent"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="agents">From Agents</option>
            <option value="system">System Alerts</option>
            <option value="hubs">Hub Messages</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <MessageSquare className="text-blue-600" size={20} />
            <span className="font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">{messages.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <AlertCircle className="text-red-600" size={20} />
            <span className="font-medium">Unread</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">{unreadCount}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <User className="text-blue-600" size={20} />
            <span className="font-medium">Agents</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">{messages.filter(m => m.type === 'Agent').length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green-600" size={20} />
            <span className="font-medium">System</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">{messages.filter(m => m.type === 'System').length}</p>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-2">
        {filteredMessages.map((message) => (
          <div 
            key={message.id} 
            className={`bg-white rounded-lg p-4 border-l-4 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${getPriorityColor(message.priority)} ${
              message.status === 'unread' ? 'bg-blue-50 border-l-blue-600' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getTypeIcon(message.type)}
                  <span className="font-medium text-slate-900">{message.from}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {message.type}
                  </span>
                  {message.status === 'unread' && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{message.subject}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{message.preview}</p>
              </div>
              <div className="flex items-center space-x-4 ml-4">
                <div className="flex items-center space-x-1 text-gray-500">
                  <Clock size={14} />
                  <span className="text-xs">{message.time}</span>
                </div>
                <button className="bg-blue-900 text-white px-3 py-1 rounded text-sm hover:bg-blue-800 transition-colors">
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500">No messages found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default Messages;