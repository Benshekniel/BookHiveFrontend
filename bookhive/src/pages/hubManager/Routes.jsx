import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  MapPin, 
  Users, 
  BarChart3, 
  Edit, 
  Trash2, 
  Eye,
  TrendingUp,
  TrendingDown,
  Clock,
  Package,
  RefreshCw
} from 'lucide-react';
import { deliveryApi, agentApi, hubApi } from '../../services/apiService';

const Routes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [routes, setRoutes] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hubId] = useState(1); // This should come from auth context or route params

  // Fetch routes and agents data
  useEffect(() => {
    fetchRoutesData();
  }, [hubId]);

  const fetchRoutesData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch deliveries and agents to generate route data
      const [deliveriesResponse, agentsResponse] = await Promise.all([
        deliveryApi.getDeliveriesByHub(hubId),
        agentApi.getAgentsByHub(hubId)
      ]);

      // Generate routes based on delivery patterns and agent assignments
      const generatedRoutes = generateRoutesFromData(deliveriesResponse, agentsResponse);
      setRoutes(generatedRoutes);
      setAgents(agentsResponse);

    } catch (err) {
      console.error('Error fetching routes data:', err);
      setError('Failed to load routes data');
    } finally {
      setLoading(false);
    }
  };

  const generateRoutesFromData = (deliveries, agents) => {
    // Create routes based on delivery patterns and geographic areas
    const baseRoutes = [
      {
        id: 1,
        name: 'Zone A - Downtown',
        description: 'Central business district and shopping areas',
        coverage: '15.2 km²',
        coordinates: { lat: 40.7589, lng: -73.9851 },
      },
      {
        id: 2,
        name: 'Zone B - Suburbs',
        description: 'Residential areas and local shopping centers',
        coverage: '28.7 km²',
        coordinates: { lat: 40.7282, lng: -73.7949 },
      },
      {
        id: 3,
        name: 'Zone C - Industrial',
        description: 'Industrial parks and business complexes',
        coverage: '22.1 km²',
        coordinates: { lat: 40.6892, lng: -74.0445 },
      },
      {
        id: 4,
        name: 'Zone D - University',
        description: 'University campus and student housing',
        coverage: '8.5 km²',
        coordinates: { lat: 40.8075, lng: -73.9626 },
      }
    ];

    // Assign agents and calculate metrics for each route
    return baseRoutes.map((route, index) => {
      // Distribute agents across routes
      const routeAgents = agents.filter((_, agentIndex) => agentIndex % baseRoutes.length === index);
      const assignedRiders = routeAgents.filter(agent => agent.availabilityStatus === 'AVAILABLE').length;
      const totalRiders = routeAgents.length;

      // Calculate deliveries for this route
      const routeDeliveries = deliveries.filter((_, deliveryIndex) => 
        deliveryIndex % baseRoutes.length === index
      );
      const dailyDeliveries = routeDeliveries.length;

      // Calculate efficiency based on delivery success rate
      const successfulDeliveries = routeDeliveries.filter(d => d.status === 'DELIVERED').length;
      const efficiency = routeDeliveries.length > 0 
        ? Math.floor((successfulDeliveries / routeDeliveries.length) * 100)
        : 85 + Math.floor(Math.random() * 15); // Fallback to random 85-100%

      // Calculate average delivery time (mock calculation)
      const avgDeliveryTime = 20 + (index * 5) + Math.floor(Math.random() * 10);

      // Determine performance trend
      const performanceChange = (Math.random() - 0.5) * 20; // -10% to +10%
      const trend = performanceChange >= 0 ? 'up' : 'down';
      const changeText = `${performanceChange >= 0 ? '+' : ''}${performanceChange.toFixed(1)}%`;

      return {
        ...route,
        assignedRiders,
        totalRiders,
        avgDeliveryTime: `${avgDeliveryTime} min`,
        efficiency,
        status: 'active',
        dailyDeliveries,
        performance: { trend, change: changeText },
        agents: routeAgents
      };
    });
  };

  const assignRiderToRoute = async (routeId, agentId) => {
    try {
      // In a real implementation, you would have route assignment endpoints
      // For now, we'll update the local state
      setRoutes(prevRoutes => 
        prevRoutes.map(route => {
          if (route.id === routeId) {
            // Check if agent is already assigned
            const isAlreadyAssigned = route.agents.some(agent => agent.id === agentId);
            if (!isAlreadyAssigned) {
              const agentToAssign = agents.find(agent => agent.id === agentId);
              if (agentToAssign) {
                return {
                  ...route,
                  agents: [...route.agents, agentToAssign],
                  assignedRiders: route.assignedRiders + 1,
                  totalRiders: route.totalRiders + 1
                };
              }
            }
          }
          return route;
        })
      );

      // Remove agent from other routes
      setRoutes(prevRoutes => 
        prevRoutes.map(route => {
          if (route.id !== routeId) {
            return {
              ...route,
              agents: route.agents.filter(agent => agent.id !== agentId),
              assignedRiders: Math.max(0, route.assignedRiders - 1),
              totalRiders: Math.max(0, route.totalRiders - 1)
            };
          }
          return route;
        })
      );

      console.log(`Assigned agent ${agentId} to route ${routeId}`);
    } catch (err) {
      console.error('Error assigning rider to route:', err);
      alert('Failed to assign rider to route');
    }
  };

  const deleteRoute = async (routeId) => {
    if (!window.confirm('Are you sure you want to delete this route?')) {
      return;
    }

    try {
      // In a real implementation, you would call a delete endpoint
      setRoutes(prevRoutes => prevRoutes.filter(route => route.id !== routeId));
      console.log(`Deleted route ${routeId}`);
    } catch (err) {
      console.error('Error deleting route:', err);
      alert('Failed to delete route');
    }
  };

  const refreshData = async () => {
    await fetchRoutesData();
  };

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableAgents = agents.filter(agent => 
    !routes.some(route => route.agents.some(routeAgent => routeAgent.id === agent.id))
  );

  const MapView = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-900" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
          Route Performance Map
        </h2>
        {/* <button 
          onClick={refreshData}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 text-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button> */}
      </div>
      
      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg h-96 mb-4 overflow-hidden">
        {/* Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-green-50"></div>
        
        {/* Route Markers */}
        {routes.map((route) => (
          <div
            key={route.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              left: `${20 + (route.id * 18)}%`,
              top: `${30 + (route.id * 15)}%`
            }}
          >
            {/* Route Marker */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg transition-all duration-300 group-hover:scale-110 ${
              route.efficiency >= 90 ? 'bg-green-500' :
              route.efficiency >= 85 ? 'bg-yellow-500' : 'bg-red-500'
            }`}>
              {route.id}
            </div>
            
            {/* Route Info Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
                <div className="font-semibold">{route.name}</div>
                <div className="text-xs">Efficiency: {route.efficiency}%</div>
                <div className="text-xs">Deliveries: {route.dailyDeliveries}/day</div>
                <div className="text-xs">Riders: {route.assignedRiders}/{route.totalRiders}</div>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
            </div>
            
            {/* Performance Indicator */}
            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
              route.performance.trend === 'up' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {route.performance.trend === 'up' ? (
                <TrendingUp className="w-2 h-2 text-white" />
              ) : (
                <TrendingDown className="w-2 h-2 text-white" />
              )}
            </div>
          </div>
        ))}
        
        {/* Map Grid Lines */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div key={`v-${i}`} className="absolute bg-blue-300" style={{ left: `${i * 10}%`, width: '1px', height: '100%' }}></div>
          ))}
          {[...Array(8)].map((_, i) => (
            <div key={`h-${i}`} className="absolute bg-blue-300" style={{ top: `${i * 12.5}%`, height: '1px', width: '100%' }}></div>
          ))}
        </div>
        
        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
          <h4 className="font-semibold text-slate-900 text-sm mb-2">Performance Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Excellent (90%+)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Good (85-89%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Needs Improvement (&lt;85%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading routes...</p>
        </div>
      </div>
    );
  }

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
      {/* Header */}
      {/* <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Routes Management</h1>
          <p className="text-sm text-gray-600">Manage delivery routes and assignments</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Route</span>
        </button>
      </div> */}
     
      {/* Map View */}
      <MapView />

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Route</span>
        </button>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRoutes.map((route) => (
          <div key={route.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>{route.name}</h3>
                <p className="text-gray-600 mt-1">{route.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  route.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                </span>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                  route.performance.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {route.performance.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{route.performance.change}</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Riders</span>
                </div>
                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {route.assignedRiders}/{route.totalRiders}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Efficiency</span>
                </div>
                <p className="text-lg font-semibold text-slate-900 mt-1">{route.efficiency}%</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">Coverage</span>
                </div>
                <p className="text-lg font-semibold text-slate-900 mt-1">{route.coverage}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600">Avg. Time</span>
                </div>
                <p className="text-lg font-semibold text-slate-900 mt-1">{route.avgDeliveryTime}</p>
              </div>
            </div>

            {/* Daily Deliveries */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Daily Deliveries</span>
                <span className="text-sm font-medium text-slate-900">{route.dailyDeliveries}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${Math.min((route.dailyDeliveries / 50) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Assigned Riders */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Riders ({route.agents.length})</h4>
              <div className="flex flex-wrap gap-2">
                {route.agents.slice(0, 3).map((agent) => (
                  <div key={agent.id} className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                      {(agent.name || `${agent.firstName} ${agent.lastName}`).split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-xs text-blue-700">{agent.name || `${agent.firstName} ${agent.lastName}`}</span>
                  </div>
                ))}
                {route.agents.length > 3 && (
                  <div className="bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-xs text-gray-600">+{route.agents.length - 3} more</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button 
                onClick={() => console.log('View route details:', route.id)}
                className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
              <button 
                onClick={() => console.log('Edit route:', route.id)}
                className="bg-gray-50 text-slate-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => deleteRoute(route.id)}
                className="bg-gray-50 text-red-500 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRoutes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No routes found matching your search criteria.</p>
        </div>
      )}

      {/* Route Assignment Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>Quick Route Assignment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select 
            id="routeSelect"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Route</option>
            {routes.map(route => (
              <option key={route.id} value={route.id}>{route.name}</option>
            ))}
          </select>
          <select 
            id="riderSelect"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Rider</option>
            {availableAgents.map(agent => (
              <option key={agent.id} value={agent.id}>
                {agent.name || `${agent.firstName} ${agent.lastName}`}
              </option>
            ))}
          </select>
          <button 
            onClick={() => {
              const routeSelect = document.getElementById('routeSelect');
              const riderSelect = document.getElementById('riderSelect');
              const routeId = parseInt(routeSelect.value);
              const riderId = parseInt(riderSelect.value);
              
              if (routeId && riderId) {
                assignRiderToRoute(routeId, riderId);
                routeSelect.value = '';
                riderSelect.value = '';
              } else {
                alert('Please select both a route and a rider');
              }
            }}
            className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
          >
            Assign Rider
          </button>
        </div>
        
        {availableAgents.length === 0 && (
          <p className="text-amber-600 text-sm mt-2">
            No unassigned riders available. All riders are currently assigned to routes.
          </p>
        )}
      </div>
    </div>
  );
};

export default Routes;