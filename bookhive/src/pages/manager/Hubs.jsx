import { useState, useEffect, useMemo } from 'react';
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
  Route,
  RefreshCw
} from 'lucide-react';
import { hubApi, agentApi, deliveryApi } from '../../services/deliveryService';

const Hubs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [selectedHub, setSelectedHub] = useState(null);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRoutes: 0,
    todayDeliveries: 0,
    monthlyRevenue: 0,
    activeHubs: 0
  });

  // Fetch hubs data from backend
  useEffect(() => {
    fetchHubsData();
  }, []);

  const fetchHubsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all hubs
      const hubsResponse = await hubApi.getAllHubs();
      
      // Fetch hub statistics
      const hubStatsResponse = await hubApi.getHubStats();
      
      // Transform backend data to match frontend structure
      const transformedHubs = await Promise.all(hubsResponse.map(async (hub) => {
        try {
          // Get hub agents
          const agentsResponse = await hubApi.getHubAgents(hub.hubId);
          
          // Get hub deliveries for today
          const deliveriesResponse = await hubApi.getHubDeliveries(hub.hubId);
          const todayDeliveries = deliveriesResponse.filter(delivery => {
            const deliveryDate = new Date(delivery.createdAt || delivery.orderTime);
            const today = new Date();
            return deliveryDate.toDateString() === today.toDateString();
          });

          // Get hub performance
          let hubPerformance = null;
          try {
            hubPerformance = await hubApi.getHubPerformance(hub.hubId);
          } catch (perfError) {
            console.warn(`Could not fetch performance for hub ${hub.hubId}:`, perfError);
          }

          return {
            id: hub.hubId,
            name: hub.name || `Hub ${hub.hubId}`,
            location: hub.address || 'Unknown Location',
            coordinates: { 
              lat: hub.latitude || 6.9271, 
              lng: hub.longitude || 79.8612 
            },
            hubManager: hub.managerName || null,
            agents: agentsResponse.length,
            status: determineHubStatus(hub, agentsResponse, todayDeliveries),
            todayDeliveries: todayDeliveries.length,
            monthlyRevenue: hubPerformance?.monthlyRevenue || (Math.random() * 2000000 + 1000000),
            routes: hubPerformance?.totalRoutes || Math.floor(Math.random() * 30 + 15),
            city: hub.city || 'Unknown City',
            phoneNumber: hub.phoneNumber || 'N/A',
            email: hub.email || 'N/A',
            description: hub.description || `${hub.name || 'This hub'} serves the local community with efficient delivery services.`,
            establishedYear: hub.establishedYear || '2020',
            maxCapacity: hub.maxCapacity || 50
          };
        } catch (hubError) {
          console.error(`Error processing hub ${hub.hubId}:`, hubError);
          return {
            id: hub.hubId,
            name: hub.name || `Hub ${hub.hubId}`,
            location: hub.address || 'Unknown Location',
            coordinates: { lat: 6.9271, lng: 79.8612 },
            hubManager: hub.managerName || null,
            agents: 0,
            status: 'Offline',
            todayDeliveries: 0,
            monthlyRevenue: 0,
            routes: 0,
            city: hub.city || 'Unknown City',
            phoneNumber: hub.phoneNumber || 'N/A',
            email: hub.email || 'N/A'
          };
        }
      }));

      setHubs(transformedHubs);

      // Calculate overall stats
      const totalRoutes = transformedHubs.reduce((sum, hub) => sum + hub.routes, 0);
      const todayDeliveries = transformedHubs.reduce((sum, hub) => sum + hub.todayDeliveries, 0);
      const monthlyRevenue = transformedHubs.reduce((sum, hub) => sum + hub.monthlyRevenue, 0);
      const activeHubs = transformedHubs.filter(hub => hub.status === 'Operational').length;

      setStats({
        totalRoutes,
        todayDeliveries,
        monthlyRevenue,
        activeHubs
      });

    } catch (err) {
      console.error('Error fetching hubs data:', err);
      setError('Failed to load hubs data');
    } finally {
      setLoading(false);
    }
  };

  const determineHubStatus = (hub, agents, todayDeliveries) => {
    if (!hub.managerName) return 'Needs Hub Manager';
    if (agents.length > (hub.maxCapacity * 0.8)) return 'Near Capacity';
    return 'Operational';
  };

  const updateHub = async (hubId, updateData) => {
    try {
      await hubApi.updateHub(hubId, updateData);
      
      // Update local state
      setHubs(prevHubs => 
        prevHubs.map(hub => 
          hub.id === hubId 
            ? { ...hub, ...updateData }
            : hub
        )
      );
      
      alert('Hub updated successfully!');
    } catch (err) {
      console.error('Error updating hub:', err);
      alert('Failed to update hub');
    }
  };

  const assignManager = async (hubId, managerData) => {
    try {
      // In a real implementation, you would need a user ID
      // For now, we'll just update the hub with manager info
      await hubApi.updateHub(hubId, {
        managerName: managerData.name,
        managerEmail: managerData.email
      });
      
      // Update local state
      setHubs(prevHubs => 
        prevHubs.map(hub => 
          hub.id === hubId 
            ? { ...hub, hubManager: managerData.name, status: 'Operational' }
            : hub
        )
      );
      
      alert('Hub manager assigned successfully!');
    } catch (err) {
      console.error('Error assigning hub manager:', err);
      alert('Failed to assign hub manager');
    }
  };

  const refreshData = async () => {
    await fetchHubsData();
  };

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

  const ManageModal = ({ hub, onClose }) => {
    const [formData, setFormData] = useState({
      name: hub?.name || '',
      location: hub?.location || '',
      city: hub?.city || '',
      phoneNumber: hub?.phoneNumber || '',
      email: hub?.email || '',
      description: hub?.description || ''
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
      
      try {
        await updateHub(hub.id, {
          name: formData.name,
          address: formData.location,
          city: formData.city,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          description: formData.description
        });
        onClose();
      } catch (err) {
        console.error('Error saving hub:', err);
      } finally {
        setSaving(false);
      }
    };

    if (!hub) return null;
    
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30">
        <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-gray-200">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-slate-900 font-heading">Manage {hub.name}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700" disabled={saving}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Hub Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                disabled={saving}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                disabled={saving}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                disabled={saving}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone Number</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                disabled={saving}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                disabled={saving}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                disabled={saving}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const AssignHubManagerModal = ({ hub, onClose }) => {
    const [formData, setFormData] = useState({
      name: '',
      email: ''
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
      
      try {
        await assignManager(hub.id, formData);
        onClose();
      } catch (err) {
        console.error('Error assigning manager:', err);
      } finally {
        setSaving(false);
      }
    };

    if (!hub) return null;
    
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30">
        <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-gray-200">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-slate-900 font-heading">Assign Hub Manager for {hub.name}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700" disabled={saving}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Hub Manager Name</label>
              <input
                type="text"
                placeholder="Enter hub manager name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                disabled={saving}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Contact Email</label>
              <input
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                disabled={saving}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
                disabled={saving}
              >
                {saving ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading hubs...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={refreshData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Hub Management</h1>
        <button 
          onClick={refreshData}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Routes</p>
              <p className="text-2xl font-bold text-slate-900 font-heading">{stats.totalRoutes}</p>
              <p className="text-sm text-green-600">Across all provinces</p>
            </div>
            <Route className="text-yellow-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Today's Deliveries</p>
              <p className="text-2xl font-bold text-slate-900 font-heading">{stats.todayDeliveries}</p>
              <p className="text-sm text-green-600">+18% from yesterday</p>
            </div>
            <Package className="text-blue-800" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
              <p className="text-2xl font-bold text-slate-900 font-heading">Rs.{(stats.monthlyRevenue / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-green-600">All provinces</p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Hubs</p>
              <p className="text-2xl font-bold text-slate-900 font-heading">{stats.activeHubs}</p>
              <p className="text-sm text-gray-500">Nationwide coverage</p>
            </div>
            <MapPin className="text-blue-600" size={32} />
          </div>
        </div>
      </div>

      {/* Map View */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 font-heading">Hub Locations - Sri Lanka</h3>
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

        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-96 flex items-center justify-center relative border-2 border-dashed border-gray-300">
          <div className="text-center">
            <Map className="mx-auto mb-4 text-blue-600" size={48} />
            <p className="text-gray-700 mb-2 font-medium">Interactive Sri Lanka Map</p>
            <p className="text-sm text-gray-500 mb-4">Displaying {hubs.length} delivery hubs across all 9 provinces</p>
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
                <p className="text-lg font-bold text-slate-900">Rs.{(hub.monthlyRevenue / 1000).toLocaleString()}K</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <MapPin className="text-blue-600" size={16} />
                  <span className="text-sm font-medium">Routes</span>
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
                  <span className="text-sm">Assign Manager</span>
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