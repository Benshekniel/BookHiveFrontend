import { useState, useEffect } from 'react';
import { Package, Users, Clock, AlertTriangle, MapPin, TrendingUp, RefreshCw } from 'lucide-react';
import { deliveryApi, agentApi, hubApi } from '../../services/apiService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeDeliveries: 0,
    availableRiders: 0,
    pendingTasks: 0,
    urgentAlerts: 0
  });
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch data from multiple endpoints
      const [deliveriesResponse, agentsResponse] = await Promise.all([
        deliveryApi.getAllDeliveries(),
        agentApi.getAllAgents()
      ]);

      // Calculate stats
      const activeDeliveries = deliveriesResponse.filter(d => 
        ['IN_TRANSIT', 'PICKED_UP'].includes(d.status)
      ).length;
      
      const availableRiders = agentsResponse.filter(a => 
        a.availabilityStatus === 'AVAILABLE'
      ).length;
      
      const pendingTasks = deliveriesResponse.filter(d => 
        d.status === 'PENDING'
      ).length;
      
      const urgentAlerts = deliveriesResponse.filter(d => 
        d.status === 'DELAYED' || (d.priority === 'URGENT' && d.status !== 'DELIVERED')
      ).length;

      setStats({
        activeDeliveries,
        availableRiders,
        pendingTasks,
        urgentAlerts
      });

      // Transform recent deliveries
      const transformedDeliveries = deliveriesResponse
        .slice(0, 5) // Get latest 5
        .map(delivery => ({
          id: delivery.trackingNumber || `DEL${delivery.id}`,
          customer: delivery.customerName || 'Unknown Customer',
          rider: delivery.agentName || 'Unassigned',
          status: mapBackendStatus(delivery.status),
          time: formatTime(delivery.updatedAt || delivery.createdAt)
        }));

      setRecentDeliveries(transformedDeliveries);

      // Generate alerts based on data
      const generatedAlerts = generateAlerts(deliveriesResponse, agentsResponse);
      setAlerts(generatedAlerts);

      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const mapBackendStatus = (backendStatus) => {
    const statusMap = {
      'PENDING': 'Pending',
      'ASSIGNED': 'Assigned',
      'PICKED_UP': 'Picked Up',
      'IN_TRANSIT': 'In Transit',
      'DELIVERED': 'Delivered',
      'CANCELLED': 'Cancelled',
      'DELAYED': 'Delayed'
    };
    return statusMap[backendStatus] || 'Unknown';
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const generateAlerts = (deliveries, agents) => {
    const alerts = [];
    
    // Check for delayed deliveries
    const delayedDeliveries = deliveries.filter(d => d.status === 'DELAYED');
    delayedDeliveries.forEach(delivery => {
      alerts.push({
        type: 'warning',
        message: `Delivery ${delivery.trackingNumber || delivery.id} is running late`,
        time: formatTime(delivery.updatedAt)
      });
    });

    // Check for unavailable riders
    const unavailableRiders = agents.filter(a => a.availabilityStatus === 'UNAVAILABLE');
    if (unavailableRiders.length > 0) {
      alerts.push({
        type: 'error',
        message: `${unavailableRiders.length} rider(s) are currently unavailable`,
        time: '5 min ago'
      });
    }

    // Check for pending deliveries without agents
    const unassignedDeliveries = deliveries.filter(d => 
      d.status === 'PENDING' && !d.agentId
    );
    if (unassignedDeliveries.length > 0) {
      alerts.push({
        type: 'info',
        message: `${unassignedDeliveries.length} pending deliveries need agent assignment`,
        time: '10 min ago'
      });
    }

    return alerts.slice(0, 3); // Show only latest 3 alerts
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-500 m-0">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 m-0">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-gray-100">
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {children}
    </div>
  );

  if (loading && recentDeliveries.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">
      {/* Header */}
      {/* <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hub Dashboard</h1>
          <p className="text-sm text-gray-600">Last updated: {lastUpdated.toLocaleTimeString()}</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div> */}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Active Deliveries" 
          value={stats.activeDeliveries} 
          icon={Package} 
          color="text-blue-500" 
        />
        <StatCard 
          title="Available Riders" 
          value={stats.availableRiders} 
          icon={Users} 
          color="text-green-500" 
        />
        <StatCard 
          title="Pending Tasks" 
          value={stats.pendingTasks} 
          icon={Clock} 
          color="text-yellow-400" 
        />
        <StatCard 
          title="Urgent Alerts" 
          value={stats.urgentAlerts} 
          icon={AlertTriangle} 
          color="text-red-500" 
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Recent Deliveries */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-poppins font-semibold text-slate-900 mb-4 m-0">Recent Deliveries</h2>
            <div>
              {recentDeliveries.length > 0 ? (
                recentDeliveries.map((delivery) => (
                  <div key={delivery.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                    <div className="flex flex-col">
                      <p className="font-medium text-slate-900 m-0">{delivery.id}</p>
                      <p className="text-sm text-gray-500 m-0">{delivery.customer} • {delivery.rider}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={
                        `px-2 py-1 rounded-full text-xs font-medium
                        ${delivery.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          delivery.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                          delivery.status === 'Picked Up' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'}`
                      }>
                        {delivery.status}
                      </span>
                      <p className="text-sm text-gray-500 mt-1 m-0">{delivery.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent deliveries</p>
              )}
            </div>
          </div>
        </Card>

        {/* Alerts */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-poppins font-semibold text-slate-900 mb-4 m-0">Alerts & Notifications</h2>
            <div>
              {alerts.length > 0 ? (
                alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`
                      p-3 rounded-lg border-l-4 mb-4
                      ${alert.type === 'error' ? 'bg-red-50 border-red-400' :
                        alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                        'bg-blue-50 border-blue-400'}
                    `}
                  >
                    <p className="text-sm text-slate-900 m-0">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1 m-0">{alert.time}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No active alerts</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Maps Section */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 mt-1">
        {/* Delivery Locations Map */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-poppins font-semibold text-slate-900 m-0">Delivery Locations Map</h2>
            </div>
            <div className="relative w-full h-[400px] bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1642678901234!5m2!1sen!2sus"
                width="100%"
                height="100%"
                className="border-0 w-full h-full"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Delivery Locations Map"
              />
              {/* Overlay with delivery markers */}
              <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow text-xs">
                <div className="font-semibold mb-2">Active Deliveries</div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>In Transit: {stats.activeDeliveries}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Pending: {stats.pendingTasks}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Delayed: {stats.urgentAlerts}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Routes Overview */}
        <Card>
          <div className="p-3">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-poppins font-semibold text-slate-900 m-0">Routes Overview</h2>
            </div>
            <div className="relative w-full h-[400px] bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96797.57915830869!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1642678901234!5m2!1sen!2sus"
                width="100%"
                height="100%"
                className="border-0 w-full h-full"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Routes Overview Map"
              />
              {/* Routes Legend */}
              {/* <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow text-xs">
                <div className="font-semibold mb-2">Active Routes</div>
                {routes.map((route, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <div className={`w-4 h-[3px] ${route.color} rounded`}></div>
                    <div className="flex flex-col">
                      <span className="font-medium">{route.id}</span>
                      <span className={
                        `px-2 py-[2px] rounded-full text-[10px] font-medium
                        ${route.efficiency >= 90 ? 'bg-green-100 text-green-800' :
                          route.efficiency >= 85 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-50 text-red-600'}`
                      }>
                        {route.efficiency}%
                      </span>
                </div>
              </div>
                ))}
              </div> */}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;