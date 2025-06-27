import { useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Truck,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Eye,
  Building2,
  ArrowLeft
} from 'lucide-react';

const Delivery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedHub, setSelectedHub] = useState(null);

  const hubs = [
    {
      id: 'H001',
      name: 'Downtown Hub',
      location: 'Business District',
      activeDeliveries: 12,
      completedToday: 45,
      totalDeliveries: 156
    },
    {
      id: 'H002',
      name: 'North Hub',
      location: 'Industrial Park',
      activeDeliveries: 8,
      completedToday: 38,
      totalDeliveries: 124
    },
    {
      id: 'H003',
      name: 'South Hub',
      location: 'Commerce District',
      activeDeliveries: 15,
      completedToday: 42,
      totalDeliveries: 189
    },
    {
      id: 'H004',
      name: 'West Hub',
      location: 'Logistics Avenue',
      activeDeliveries: 6,
      completedToday: 31,
      totalDeliveries: 98
    },
  ];

  const deliveries = [
    {
      id: 'D001',
      hubId: 'H001',
      agent: 'John Smith',
      pickup: '123 Main St',
      dropoff: '456 Oak Ave',
      status: 'In Transit',
      priority: 'High',
      startTime: '09:15 AM',
      estimatedArrival: '10:30 AM',
      distance: '5.2 km',
      progress: 65
    },
    {
      id: 'D002',
      hubId: 'H001',
      agent: 'Sarah Johnson',
      pickup: '789 Pine Rd',
      dropoff: '321 Elm St',
      status: 'Delivered',
      priority: 'Medium',
      startTime: '08:45 AM',
      estimatedArrival: '09:30 AM',
      distance: '3.8 km',
      progress: 100
    },
    {
      id: 'D003',
      hubId: 'H002',
      agent: 'Mike Wilson',
      pickup: '654 Cedar Ln',
      dropoff: '987 Birch Dr',
      status: 'Pickup',
      priority: 'Low',
      startTime: '10:00 AM',
      estimatedArrival: '11:15 AM',
      distance: '7.1 km',
      progress: 20
    },
    {
      id: 'D004',
      hubId: 'H003',
      agent: 'Lisa Brown',
      pickup: '147 Maple St',
      dropoff: '258 Willow Ave',
      status: 'Delayed',
      priority: 'High',
      startTime: '09:30 AM',
      estimatedArrival: '11:00 AM',
      distance: '6.3 km',
      progress: 40
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'In Transit':
        return <Truck className="text-blue-600" size={20} />;
      case 'Pickup':
        return <RotateCcw className="text-yellow-400" size={20} />;
      case 'Delayed':
        return <AlertTriangle className="text-red-600" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-600 text-white';
      case 'In Transit':
        return 'bg-blue-600 text-white';
      case 'Pickup':
        return 'bg-yellow-400 text-white';
      case 'Delayed':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

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

  const hubDeliveries = selectedHub
    ? deliveries.filter(d => d.hubId === selectedHub.id)
    : deliveries;

  const filteredDeliveries = hubDeliveries.filter(delivery => {
    const matchesSearch = delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.agent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || delivery.status.toLowerCase().replace(' ', '') === selectedFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    all: hubDeliveries.length,
    intransit: hubDeliveries.filter(d => d.status === 'In Transit').length,
    delivered: hubDeliveries.filter(d => d.status === 'Delivered').length,
    pickup: hubDeliveries.filter(d => d.status === 'Pickup').length,
    delayed: hubDeliveries.filter(d => d.status === 'Delayed').length,
  };

  if (!selectedHub) {
    return (
      <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
        type="text"
        placeholder="Search hubs by name or location..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
        />
      </div>

      {/* Hubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {hubs.map((hub) => (
        <div
          key={hub.id}
          onClick={() => setSelectedHub(hub)}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-900"
        >
          <div className="flex items-center justify-between mb-4">
          <Building2 className="text-blue-600" size={32} />
          <span className="text-sm text-gray-500">{hub.id}</span>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-1 font-heading">{hub.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{hub.location}</p>

          <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Active</span>
            <span className="text-sm font-medium text-blue-600">{hub.activeDeliveries}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Completed Today</span>
            <span className="text-sm font-medium text-green-600">{hub.completedToday}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total</span>
            <span className="text-sm font-medium text-slate-900">{hub.totalDeliveries}</span>
          </div>
          </div>

          <button className="w-full mt-4 bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors">
          View Deliveries
          </button>
        </div>
        ))}
      </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedHub(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-heading">{selectedHub.name} Deliveries</h2>
            <p className="text-gray-600">Monitor deliveries from {selectedHub.location}</p>
          </div>
        </div>
        <button className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2">
          <Eye size={20} />
          <span>Analytics</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-slate-900">{statusCounts.all}</p>
            </div>
            <Truck className="text-gray-400" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-blue-600">{statusCounts.intransit}</p>
            </div>
            <Truck className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.delivered}</p>
            </div>
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pickup</p>
              <p className="text-2xl font-bold text-yellow-400">{statusCounts.pickup}</p>
            </div>
            <RotateCcw className="text-yellow-400" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delayed</p>
              <p className="text-2xl font-bold text-red-600">{statusCounts.delayed}</p>
            </div>
            <AlertTriangle className="text-red-600" size={24} />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search deliveries..."
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
            <option value="intransit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="pickup">Pickup</option>
            <option value="delayed">Delayed</option>
          </select>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="space-y-4">
        {filteredDeliveries.map((delivery) => (
          <div key={delivery.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  {getStatusIcon(delivery.status)}
                  <h3 className="text-lg font-semibold text-slate-900">{delivery.id}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                    {delivery.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(delivery.priority)}`}>
                    {delivery.priority}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="text-green-600" size={16} />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Pickup</p>
                        <p className="text-sm text-gray-600">{delivery.pickup}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="text-red-600" size={16} />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Drop-off</p>
                        <p className="text-sm text-gray-600">{delivery.dropoff}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Agent</p>
                      <p className="text-sm text-gray-600">{delivery.agent}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">Started</p>
                        <p className="text-sm text-gray-600">{delivery.startTime}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">ETA</p>
                        <p className="text-sm text-gray-600">{delivery.estimatedArrival}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-gray-600">{delivery.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${delivery.status === 'Delivered' ? 'bg-green-600' :
                          delivery.status === 'Delayed' ? 'bg-red-600' :
                            'bg-blue-600'
                        }`}
                      style={{ width: `${delivery.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <MapPin size={16} />
                  <span>Track</span>
                </button>
                <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDeliveries.length === 0 && (
        <div className="text-center py-12">
          <Truck className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500">No deliveries found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default Delivery;