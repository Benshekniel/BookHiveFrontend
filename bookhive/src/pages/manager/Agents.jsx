import { useState } from 'react';
import { 
  Search, 
  Plus, 
  MessageCircle, 
  Star, 
  Car, 
  Bike,
  Filter,
  MoreHorizontal
} from 'lucide-react';

const Agents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const agents = [
    {
      id: 'A001',
      name: 'John Smith',
      phone: '+1 234-567-8901',
      vehicle: 'Motorcycle',
      status: 'Active',
      rating: 4.8,
      completedDeliveries: 245,
      avatar: 'JS'
    },
    {
      id: 'A002',
      name: 'Sarah Johnson',
      phone: '+1 234-567-8902',
      vehicle: 'Van',
      status: 'Active',
      rating: 4.9,
      completedDeliveries: 312,
      avatar: 'SJ'
    },
    {
      id: 'A003',
      name: 'Mike Wilson',
      phone: '+1 234-567-8903',
      vehicle: 'Car',
      status: 'Offline',
      rating: 4.6,
      completedDeliveries: 189,
      avatar: 'MW'
    },
    {
      id: 'A004',
      name: 'Lisa Brown',
      phone: '+1 234-567-8904',
      vehicle: 'Motorcycle',
      status: 'On Delivery',
      rating: 4.7,
      completedDeliveries: 278,
      avatar: 'LB'
    },
  ];

  const getVehicleIcon = (vehicle) => {
    switch (vehicle) {
      case 'Motorcycle':
      case 'Bike':
        return <Bike size={16} />;
      default:
        return <Car size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-600 text-white';
      case 'On Delivery':
        return 'bg-yellow-400 text-white';
      case 'Offline':
        return 'bg-gray-400 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || agent.status.toLowerCase() === selectedFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Agents Management</h2>
          <p className="text-gray-600">Manage delivery agents and their performance</p>
        </div>
        <button className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Agent</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search agents..."
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
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="offline">Offline</option>
            <option value="on delivery">On Delivery</option>
          </select>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
            {/* Agent Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center font-semibold">
                  {agent.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{agent.name}</h3>
                  <p className="text-sm text-gray-600">{agent.id}</p>
                </div>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreHorizontal size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Agent Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                  {agent.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Vehicle</span>
                <div className="flex items-center space-x-1">
                  {getVehicleIcon(agent.vehicle)}
                  <span className="text-sm font-medium">{agent.vehicle}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rating</span>
                <div className="flex items-center space-x-1">
                  <Star className="text-yellow-400 fill-current" size={14} />
                  <span className="text-sm font-medium">{agent.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Deliveries</span>
                <span className="text-sm font-medium">{agent.completedDeliveries}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 mt-4 pt-4 border-t">
              <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1">
                <MessageCircle size={16} />
                <span className="text-sm">Chat</span>
              </button>
              <button className="flex-1 border border-gray-300 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-sm">Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No agents found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default Agents;