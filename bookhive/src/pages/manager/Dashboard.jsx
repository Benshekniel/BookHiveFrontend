import { useState, useEffect } from 'react';
import { Package, Users, Clock, AlertTriangle,Truck,XCircle , CheckCircle ,Building2 ,MapPin, TrendingUp, RefreshCw, Timer, Archive, BarChart3 } from 'lucide-react';
import { BarChart, Bar,LineChart , XAxis,Line, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { deliveryApi, agentApi, hubApi } from '../../services/deliveryService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeDeliveries: 0,
    availableRiders: 0,
    totalDeliveries: 0,
    totalDeliveryTime: 0
  });
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
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

      // Calculate total deliveries (all deliveries)
      const totalDeliveries = deliveriesResponse.length;

      // Calculate total delivery time (sum of all delivery times)
      const deliveredOrders = deliveriesResponse.filter(d => d.status === 'DELIVERED');
      let totalDeliveryTime = 0;
      
      if (deliveredOrders.length > 0) {
        totalDeliveryTime = deliveredOrders.reduce((acc, delivery) => {
          if (delivery.createdAt && delivery.deliveredAt) {
            const created = new Date(delivery.createdAt);
            const delivered = new Date(delivery.deliveredAt);
            const timeDiff = (delivered - created) / (1000 * 60); // in minutes
            return acc + timeDiff;
          }
          // Fallback: use random time between 20-60 minutes for demo
          return acc + (20 + Math.random() * 40);
        }, 0);
        totalDeliveryTime = Math.round(totalDeliveryTime);
      } else {
        // Fallback for demo purposes - calculate based on total deliveries
        totalDeliveryTime = totalDeliveries * 35; // 35 minutes per delivery average
      }

      setStats({
        activeDeliveries,
        availableRiders,
        totalDeliveries,
        totalDeliveryTime
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

      // Generate weekly delivery performance data
      const weeklyPerformanceData = generateWeeklyData(deliveriesResponse);
      setWeeklyData(weeklyPerformanceData);

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

  const generateWeeklyData = (deliveries) => {
    // Generate weekly performance data for the last 7 days
    const days = ['Colombo Hub', 'Kandy Hub', 'Galle Hub', 'Negombo Hub', 'Matara Hub'];
    const today = new Date();
    
    const weeklyData = days.map((hub, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index)); // Get the date for each day
      
      // Filter deliveries for this specific hub (simplified)
      const hubDeliveries = deliveries.filter(delivery => {
        const deliveryDate = new Date(delivery.createdAt || delivery.updatedAt);
        return deliveryDate.toDateString() === date.toDateString();
      });
      
      // Calculate metrics for this hub
      const totalAgents = hubDeliveries.length > 0 ? hubDeliveries.length : Math.floor(Math.random() * 50) + 20;
      
      return {
        name: hub,
        agents: totalAgents
      };
    });
    
    return weeklyData;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'In Transit':
        return <Clock className="text-yellow-600" size={16} />;
      case 'Pickup':
        return <TrendingUp className="text-blue-600" size={16} />;
      default:
        return <XCircle className="text-red-600" size={16} />;
    }
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Active Agents',
            value: stats.availableRiders,
            change: '+5 from yesterday',
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
          },
          {
            title: 'Active Deliveries',
            value: stats.activeDeliveries,
            change: '+18 from yesterday',
            icon: Truck,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50'
          },
          {
            title: 'Total Hubs',
            value: '12',
            change: 'All operational',
            icon: Building2,
            color: 'text-green-600',
            bg: 'bg-green-50'
          },
          {
            title: 'Pending Issues',
            value: alerts.length,
            change: 'Needs attention',
            icon: AlertTriangle,
            color: 'text-red-600',
            bg: 'bg-red-50'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 font-heading">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Deliveries */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 font-heading">
            Recent Delivery Updates
          </h3>
          <div className="space-y-4">
            {recentDeliveries.map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(delivery.status)}
                  <div>
                    <p className="font-medium text-slate-900">{delivery.id}</p>
                    <p className="text-sm text-gray-600">{delivery.rider}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{delivery.status}</p>
                  <p className="text-xs text-gray-500">{delivery.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Agents by Hub */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 font-heading">
            Delivery Agents by Hub
          </h3>
          <div className='mt-15'>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Agents']} />
              <Bar dataKey="agents" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Hub */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 font-heading">
            Revenue by Hub (LKR)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[
              { name: 'Colombo Hub', revenue: 450000 },
              { name: 'Kandy Hub', revenue: 280000 },
              { name: 'Galle Hub', revenue: 320000 },
              { name: 'Negombo Hub', revenue: 195000 },
              { name: 'Matara Hub', revenue: 240000 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `Rs.${(value/1000).toFixed(0)}K`} />
              <Tooltip formatter={(value) => [`Rs.${value.toLocaleString()}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#FBBF24" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Deliveries by Hub */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 font-heading">
            Deliveries by Hub
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Colombo Hub', deliveries: 567 },
              { name: 'Kandy Hub', deliveries: 345 },
              { name: 'Galle Hub', deliveries: 398 },
              { name: 'Negombo Hub', deliveries: 234 },
              { name: 'Matara Hub', deliveries: 289 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Deliveries']} />
              <Bar dataKey="deliveries" fill="#22C55E" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;