import { useState } from 'react';
import { 
  Search, 
  Plus, 
  MapPin, 
  Users,
  Package,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Settings,
  Map,
  Navigation,
  Maximize2
} from 'lucide-react';

const Hubs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showMap, setShowMap] = useState(false);

  const hubs = [
    {
      id: 'H001',
      name: 'Downtown Hub',
      location: '123 Business District, Downtown',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      capacity: 500,
      currentLoad: 470,
      supervisor: 'David Miller',
      agents: 8,
      status: 'Operational',
      todayDeliveries: 45,
      efficiency: 94
    },
    {
      id: 'H002',
      name: 'North Hub',
      location: '456 Industrial Park, North Zone',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      capacity: 350,
      currentLoad: 285,
      supervisor: 'Jennifer Adams',
      agents: 6,
      status: 'Operational',
      todayDeliveries: 38,
      efficiency: 91
    },
    {
      id: 'H003',
      name: 'South Hub',
      location: '789 Commerce St, South District',
      coordinates: { lat: 40.6892, lng: -74.0445 },
      capacity: 400,
      currentLoad: 384,
      supervisor: 'Robert Chen',
      agents: 7,
      status: 'Near Capacity',
      todayDeliveries: 42,
      efficiency: 96
    },
    {
      id: 'H004',
      name: 'West Hub',
      location: '321 Logistics Ave, West Side',
      coordinates: { lat: 40.7282, lng: -74.0776 },
      capacity: 300,
      currentLoad: 150,
      supervisor: null,
      agents: 5,
      status: 'Needs Supervisor',
      todayDeliveries: 31,
      efficiency: 88
    },
    {
      id: 'H005',
      name: 'East Hub',
      location: '654 Distribution Center, East End',
      coordinates: { lat: 40.7505, lng: -73.9934 },
      capacity: 450,
      currentLoad: 320,
      supervisor: 'Maria Rodriguez',
      agents: 9,
      status: 'Operational',
      todayDeliveries: 52,
      efficiency: 93
    },
    {
      id: 'H006',
      name: 'Central Hub',
      location: '987 Main Plaza, Central District',
      coordinates: { lat: 40.7411, lng: -74.0018 },
      capacity: 600,
      currentLoad: 480,
      supervisor: 'James Wilson',
      agents: 12,
      status: 'Operational',
      todayDeliveries: 67,
      efficiency: 97
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Operational':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'Near Capacity':
        return <AlertCircle className="text-yellow-400" size={20} />;
      case 'Needs Supervisor':
        return <AlertCircle className="text-red-600" size={20} />;
      default:
        return <AlertCircle className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Operational':
        return 'bg-green-600 text-white';
      case 'Near Capacity':
        return 'bg-yellow-400 text-white';
      case 'Needs Supervisor':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getCapacityColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-600';
    if (percentage >= 75) return 'bg-yellow-400';
    return 'bg-green-600';
  };

  const filteredHubs = hubs.filter(hub => 
    hub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hub.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCapacity = hubs.reduce((sum, hub) => sum + hub.capacity, 0);
  const totalLoad = hubs.reduce((sum, hub) => sum + hub.currentLoad, 0);
  const totalDeliveries = hubs.reduce((sum, hub) => sum + hub.todayDeliveries, 0);
  const avgEfficiency = Math.round(hubs.reduce((sum, hub) => sum + hub.efficiency, 0) / hubs.length);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Hub Management</h2>
          <p className="text-gray-600">Monitor and manage all delivery hubs</p>
        </div>
        <button className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Hub</span>
        </button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Capacity</p>
              <p className="text-2xl font-bold text-slate-900 font-heading">{totalCapacity}</p>
              <p className="text-sm text-gray-500">{totalLoad} packages</p>
            </div>
            <Package className="text-blue-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Today's Deliveries</p>
              <p className="text-2xl font-bold text-slate-900 font-heading">{totalDeliveries}</p>
              <p className="text-sm text-green-600">+12% from yesterday</p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Efficiency</p>
              <p className="text-2xl font-bold text-slate-900 font-heading">{avgEfficiency}%</p>
              <p className="text-sm text-green-600">Excellent performance</p>
            </div>
            <CheckCircle className="text-green-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Hubs</p>
              <p className="text-2xl font-bold text-slate-900 font-heading">{hubs.length}</p>
              <p className="text-sm text-gray-500">All regions covered</p>
            </div>
            <MapPin className="text-blue-600" size={32} />
          </div>
        </div>
      </div>

      {/* Map View */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 font-heading">Hub Locations</h3>
          <div className="flex space-x-2">
            <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Navigation size={16} />
              <span>Optimize Routes</span>
            </button>
            <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Maximize2 size={16} />
              <span>Full Screen</span>
            </button>
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center relative">
          <div className="text-center">
            <Map className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500 mb-4">Interactive Map View</p>
            <p className="text-sm text-gray-400">Map integration would show hub locations with real-time status</p>
          </div>
          
          {/* Simulated Hub Markers */}
          <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span>Operational</span>
            </div>
          </div>
          <div className="ml-0.5 absolute top-4 left-32 bg-white p-2 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span>Near Capacity</span>
            </div>
          </div>
          <div className="ml-4 absolute top-4 left-60 bg-white p-2 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span>Needs Attention</span>
            </div>
          </div>
        </div>
      </div>

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

      {/* Hubs Grid - 3 per row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredHubs.map((hub) => {
          const capacityPercentage = Math.round((hub.currentLoad / hub.capacity) * 100);
          
          return (
            <div key={hub.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              {/* Hub Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 font-heading">{hub.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center space-x-1">
                    <MapPin size={14} />
                    <span>{hub.location}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(hub.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(hub.status)}`}>
                    {hub.status}
                  </span>
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Capacity Usage</span>
                  <span className="font-medium">{hub.currentLoad}/{hub.capacity} ({capacityPercentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${getCapacityColor(capacityPercentage)}`}
                    style={{ width: `${capacityPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Hub Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Users className="text-blue-600" size={16} />
                    <span className="text-sm font-medium">Agents</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{hub.agents}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <TrendingUp className="text-green-600" size={16} />
                    <span className="text-sm font-medium">Efficiency</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{hub.efficiency}%</p>
                </div>
              </div>

              {/* Supervisor Info */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-slate-900 mb-1">Supervisor</p>
                {hub.supervisor ? (
                  <p className="text-sm text-gray-600">{hub.supervisor}</p>
                ) : (
                  <p className="text-sm text-red-600">No supervisor assigned</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-900 text-white py-2 px-3 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center space-x-1">
                  <Settings size={16} />
                  <span className="text-sm">Manage</span>
                </button>
                {!hub.supervisor && (
                  <button className="flex-1 bg-yellow-400 text-white py-2 px-3 rounded-lg hover:bg-yellow-500 transition-colors">
                    <span className="text-sm">Assign Supervisor</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredHubs.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500">No hubs found matching your search</p>
        </div>
      )}
    </div>
  );
};

export default Hubs;