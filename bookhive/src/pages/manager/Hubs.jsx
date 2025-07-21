import { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Settings,
  Map,
  Navigation,
  Maximize2,
  X,
  Package,
  Route
} from 'lucide-react';

const Hubs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [selectedHub, setSelectedHub] = useState(null);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const hubs = [
    {
      id: 'H001',
      name: 'Downtown Hub',
      location: '123 Business District, Downtown',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      hubManager: 'David Miller',
      agents: 8,
      status: 'Operational',
      todayDeliveries: 45,
      monthlyRevenue: 125000,
      routes: 20
    },
    {
      id: 'H002',
      name: 'North Hub',
      location: '456 Industrial Park, North Zone',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      hubManager: 'Jennifer Adams',
      agents: 6,
      status: 'Operational',
      todayDeliveries: 38,
      monthlyRevenue: 98000,
      routes: 15
    },
    {
      id: 'H003',
      name: 'South Hub',
      location: '789 Commerce St, South District',
      coordinates: { lat: 40.6892, lng: -74.0445 },
      hubManager: 'Robert Chen',
      agents: 7,
      status: 'Near Capacity',
      todayDeliveries: 42,
      monthlyRevenue: 112000,
      routes: 18
    },
    {
      id: 'H004',
      name: 'West Hub',
      location: '321 Logistics Ave, West Side',
      coordinates: { lat: 40.7282, lng: -74.0776 },
      hubManager: null,
      agents: 5,
      status: 'Needs Hub Manager',
      todayDeliveries: 31,
      monthlyRevenue: 76000,
      routes: 12
    },
    {
      id: 'H005',
      name: 'East Hub',
      location: '654 Distribution Center, East End',
      coordinates: { lat: 40.7505, lng: -73.9934 },
      hubManager: 'Maria Rodriguez',
      agents: 9,
      status: 'Operational',
      todayDeliveries: 52,
      monthlyRevenue: 103000,
      routes: 22
    },
    {
      id: 'H006',
      name: 'Central Hub',
      location: '987 Main Plaza, Central District',
      coordinates: { lat: 40.7411, lng: -74.0018 },
      hubManager: 'James Wilson',
      agents: 12,
      status: 'Operational',
      todayDeliveries: 67,
      monthlyRevenue: 150000,
      routes: 25
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Operational':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'Near Capacity':
        return <AlertCircle className="text-yellow-400" size={20} />;
      case 'Needs Hub Manager':
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
      case 'Needs Hub Manager':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const filteredHubs = useMemo(() => {
    return hubs.filter(hub =>
      hub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hub.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, hubs]);

  const totalDeliveries = hubs.reduce((sum, hub) => sum + hub.todayDeliveries, 0);
  const totalRevenue = hubs.reduce((sum, hub) => sum + hub.monthlyRevenue, 0);
  const totalRoutes = hubs.reduce((sum, hub) => sum + hub.routes, 0);

  const ManageModal = ({ hub, onClose }) => {
    if (!hub) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-gray-200">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-slate-900 font-heading">Manage {hub.name}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Hub Name</label>
              <input
                type="text"
                defaultValue={hub.name}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Location</label>
              <input
                type="text"
                defaultValue={hub.location}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
                onClick={() => console.log('Save hub details:', hub.id)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AssignHubManagerModal = ({ hub, onClose }) => {
    if (!hub) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-gray-200">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-slate-900 font-heading">Assign Hub Manager for {hub.name}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Hub Manager Name</label>
              <input
                type="text"
                placeholder="Enter hub manager name"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Contact Email</label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors"
                onClick={() => console.log('Assign hub manager for:', hub.id)}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">


      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Routes</p>
              <p className="text-2xl font-bold text-slate-900 font-heading">{totalRoutes}</p>
              <p className="text-sm text-green-600">Across all hubs</p>
            </div>
            <Route className="text-yellow-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Today's Deliveries</p>
              <p className="text-2xl font-bold text-slate-900 font-heading">{totalDeliveries}</p>
              <p className="text-sm text-green-600">+12% from yesterday</p>
            </div>
            <Package className="text-blue-800" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
              <p className="text-2xl font-bold text-slate-900 font-heading">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600">Across all hubs</p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
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
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
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

      {/* Hubs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredHubs.map((hub) => (
          <div key={hub.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
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
                  <span className="text-sm font-medium">Deliveries</span>
                </div>
                <p className="text-lg font-bold text-slate-900">{hub.todayDeliveries}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingUp className="text-green-600" size={16} />
                  <span className="text-sm font-medium">Monthly Revenue</span>
                </div>
                <p className="text-lg font-bold text-slate-900">${hub.monthlyRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <MapPin className="text-blue-600" size={16} />
                  <span className="text-sm font-medium">Number of Routes</span>
                </div>
                <p className="text-lg font-bold text-slate-900">{hub.routes}</p>
              </div>
            </div>

            {/* Hub Manager Info */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-slate-900 mb-1">Hub Manager</p>
              {hub.hubManager ? (
                <p className="text-sm text-gray-600">{hub.hubManager}</p>
              ) : (
                <p className="text-sm text-red-600">No hub manager assigned</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                className="flex-1 bg-blue-900 text-white py-2 px-3 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center space-x-1"
                onClick={() => {
                  setSelectedHub(hub);
                  setShowManageModal(true);
                }}
              >
                <Settings size={16} />
                <span className="text-sm">Manage</span>
              </button>
              {!hub.hubManager && (
                <button
                  className="flex-1 bg-yellow-400 text-white py-2 px-3 rounded-lg hover:bg-yellow-500 transition-colors"
                  onClick={() => {
                    setSelectedHub(hub);
                    setShowAssignModal(true);
                  }}
                >
                  <span className="text-sm">Assign Hub Manager</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredHubs.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500">No hubs found matching your search</p>
        </div>
      )}

      {showManageModal && (
        <ManageModal hub={selectedHub} onClose={() => setShowManageModal(false)} />
      )}
      {showAssignModal && (
        <AssignHubManagerModal hub={selectedHub} onClose={() => setShowAssignModal(false)} />
      )}
    </div>
  );
};

export default Hubs;