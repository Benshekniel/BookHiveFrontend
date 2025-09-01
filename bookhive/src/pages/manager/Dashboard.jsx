import { useState, useEffect } from 'react';
import { Package, Users, Clock, AlertTriangle, Truck, XCircle, CheckCircle, Building2, MapPin, TrendingUp, RefreshCw, Timer, Archive, BarChart3 } from 'lucide-react';
import { BarChart, Bar, LineChart, XAxis, Line, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { deliveryApi, agentApi, hubApi, transactionApi } from '../../services/deliveryService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeDeliveries: 0,
    availableRiders: 0,
    totalDeliveries: 0,
    totalHubs: 0,
    totalRevenue: 0,
    totalTransactions: 0
  });
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [hubData, setHubData] = useState([]);
  const [hubDeliveryData, setHubDeliveryData] = useState([]);
  const [hubRevenueData, setHubRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Fetch dashboard data on component mount only
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching dashboard data...');
      
      // Phase 1: Fetch basic data for immediate display (faster)
      const [
        deliveriesResponse,
        agentsResponse,
        hubsResponse
      ] = await Promise.all([
        deliveryApi.getAllDeliveries().catch(err => {
          console.error('Failed to fetch deliveries:', err);
          return [];
        }),
        agentApi.getAllAgents().catch(err => {
          console.error('Failed to fetch agents:', err);
          return [];
        }),
        hubApi.getAllHubs().catch(err => {
          console.error('Failed to fetch hubs:', err);
          return [];
        })
      ]);

      console.log('Phase 1 - Basic data fetched:', {
        deliveries: deliveriesResponse.length,
        agents: agentsResponse.length,
        hubs: hubsResponse.length
      });

      // Calculate basic stats immediately
      const activeDeliveries = deliveriesResponse.filter(d => 
        ['IN_TRANSIT', 'PICKED_UP', 'ASSIGNED'].includes(d.status)
      ).length;
      
      const availableRiders = agentsResponse.filter(a => 
        a.availabilityStatus === 'AVAILABLE'
      ).length;

      const totalDeliveries = deliveriesResponse.length;
      const totalHubs = hubsResponse.length;

      // Set basic stats immediately (before transaction data)
      setStats({
        activeDeliveries,
        availableRiders,
        totalDeliveries,
        totalHubs,
        totalRevenue: 0, // Will be updated after transaction fetch
        totalTransactions: 0
      });

      // Process recent deliveries immediately
      const sortedDeliveries = [...deliveriesResponse]
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 5);

      const transformedDeliveries = sortedDeliveries.map(delivery => ({
        id: delivery.trackingNumber || `DEL${delivery.deliveryId}`,
        customer: delivery.customerName || delivery.recipientName || 'Unknown Customer',
        rider: delivery.agentName || 'Unassigned',
        status: mapBackendStatus(delivery.status),
        time: formatTime(delivery.updatedAt || delivery.createdAt)
      }));

      setRecentDeliveries(transformedDeliveries);

      // Generate alerts immediately
      const generatedAlerts = generateAlerts(deliveriesResponse, agentsResponse);
      setAlerts(generatedAlerts);

      // Stop main loading - user can see basic data now
      setLoading(false);
      setLastUpdated(new Date());

      // Phase 2: Fetch transaction data and process charts in background
      setChartsLoading(true);
      await fetchTransactionDataAndProcessCharts(hubsResponse, deliveriesResponse, agentsResponse);
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data: ' + err.message);
      setLoading(false);
    }
  };

  const fetchTransactionDataAndProcessCharts = async (hubs, deliveries, agents) => {
    try {
      console.log('Phase 2 - Fetching transaction data...');
      
      // Fetch transactions
      const transactionsResponse = await transactionApi.getAllTransactions().catch(err => {
        console.error('Failed to fetch transactions:', err);
        return [];
      });

      console.log('Transaction data fetched:', transactionsResponse.length);

      // Calculate total revenue
      const totalRevenue = calculateTotalRevenue(transactionsResponse);

      // Update stats with transaction data
      setStats(prevStats => ({
        ...prevStats,
        totalRevenue,
        totalTransactions: transactionsResponse.length
      }));

      // Process hub data efficiently (without additional API calls)
      processHubDataEfficiently(hubs, deliveries, agents, transactionsResponse);
      
    } catch (error) {
      console.error('Error in phase 2:', error);
    } finally {
      setChartsLoading(false);
    }
  };

  const processHubDataEfficiently = (hubs, allDeliveries, allAgents, allTransactions) => {
    try {
      console.log('Processing hub data efficiently...');
      
      // Create lookup maps for better performance
      const deliveriesByHub = new Map();
      const agentsByHub = new Map();
      const transactionMap = new Map();

      // Build transaction map for quick lookup
      allTransactions.forEach(transaction => {
        transactionMap.set(transaction.transactionId, transaction);
      });

      // Group deliveries by hub (using hubName matching since hubId might not be direct)
      allDeliveries.forEach(delivery => {
        const hubKey = delivery.hubId || delivery.hubName;
        if (hubKey) {
          if (!deliveriesByHub.has(hubKey)) {
            deliveriesByHub.set(hubKey, []);
          }
          deliveriesByHub.get(hubKey).push(delivery);
        }
      });

      // Group agents by hub
      allAgents.forEach(agent => {
        const hubKey = agent.hubId || agent.hubName;
        if (hubKey) {
          if (!agentsByHub.has(hubKey)) {
            agentsByHub.set(hubKey, []);
          }
          agentsByHub.get(hubKey).push(agent);
        }
      });

      console.log('Lookup maps created:', {
        hubsWithDeliveries: deliveriesByHub.size,
        hubsWithAgents: agentsByHub.size,
        transactions: transactionMap.size
      });

      // Process each hub efficiently
      const hubProcessedData = hubs.map(hub => {
        const hubKey = hub.hubId;
        const hubKeyAlt = hub.name;
        
        // Get hub data from maps
        const hubDeliveries = deliveriesByHub.get(hubKey) || deliveriesByHub.get(hubKeyAlt) || [];
        const hubAgents = agentsByHub.get(hubKey) || agentsByHub.get(hubKeyAlt) || [];
        
        const agentCount = hubAgents.length;
        const totalDeliveries = hubDeliveries.length;
        const completedDeliveries = hubDeliveries.filter(d => d.status === 'DELIVERED').length;
        
        // Calculate revenue efficiently
        const revenue = hubDeliveries.reduce((total, delivery) => {
          if (delivery.transactionId) {
            const transaction = transactionMap.get(delivery.transactionId);
            if (transaction && (transaction.paymentStatus === 'COMPLETED' || transaction.paymentStatus === 'PAID')) {
              const amount = parseFloat(transaction.paymentAmount || 0);
              return total + (isNaN(amount) ? 0 : amount);
            }
          }
          return total;
        }, 0);

        console.log(`Hub ${hub.name}: ${agentCount} agents, ${totalDeliveries} deliveries, Rs.${revenue} revenue`);

        return {
          id: hub.hubId,
          name: hub.name || `Hub ${hub.hubId}`,
          city: hub.city || 'Unknown',
          agents: agentCount,
          deliveries: totalDeliveries,
          completedDeliveries,
          revenue: revenue,
          transactionCount: hubDeliveries.filter(d => d.transactionId).length
        };
      });

      // Sort and set data for different charts
      const sortedByAgents = [...hubProcessedData].sort((a, b) => b.agents - a.agents);
      const sortedByDeliveries = [...hubProcessedData].sort((a, b) => b.deliveries - a.deliveries);
      const sortedByRevenue = [...hubProcessedData].sort((a, b) => b.revenue - a.revenue);

      setHubData(sortedByAgents);
      setHubDeliveryData(sortedByDeliveries);
      setHubRevenueData(sortedByRevenue);

      console.log('Hub data processing completed');

    } catch (error) {
      console.error('Error processing hub data efficiently:', error);
      setHubData([]);
      setHubDeliveryData([]);
      setHubRevenueData([]);
    }
  };

  const calculateTotalRevenue = (transactions) => {
    try {
      return transactions
        .filter(t => t.paymentStatus === 'COMPLETED' || t.paymentStatus === 'PAID')
        .reduce((total, transaction) => {
          const amount = parseFloat(transaction.paymentAmount || 0);
          return total + (isNaN(amount) ? 0 : amount);
        }, 0);
    } catch (error) {
      console.error('Error calculating total revenue:', error);
      return 0;
    }
  };

  const mapBackendStatus = (backendStatus) => {
    if (!backendStatus) return 'Unknown';
    
    const statusMap = {
      'PENDING': 'Pending',
      'ASSIGNED': 'Assigned',
      'PICKED_UP': 'Picked Up',
      'IN_TRANSIT': 'In Transit',
      'DELIVERED': 'Delivered',
      'CANCELLED': 'Cancelled',
      'DELAYED': 'Delayed',
      'FAILED': 'Failed'
    };
    return statusMap[backendStatus] || backendStatus;
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
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
    } catch (error) {
      return 'Unknown';
    }
  };

  const generateAlerts = (deliveries, agents) => {
    const alerts = [];
    
    try {
      // Check for delayed deliveries
      const delayedDeliveries = deliveries.filter(d => d.status === 'DELAYED' || d.status === 'FAILED');
      if (delayedDeliveries.length > 0) {
        alerts.push({
          type: 'warning',
          message: `${delayedDeliveries.length} delivery(s) are delayed or failed`,
          time: '5 min ago'
        });
      }

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
        d.status === 'PENDING' && (!d.agentId && !d.agentName)
      );
      if (unassignedDeliveries.length > 0) {
        alerts.push({
          type: 'info',
          message: `${unassignedDeliveries.length} pending deliveries need agent assignment`,
          time: '10 min ago'
        });
      }

      // Check for high delivery load
      const activeDeliveries = deliveries.filter(d => 
        ['IN_TRANSIT', 'PICKED_UP', 'ASSIGNED'].includes(d.status)
      );
      if (activeDeliveries.length > 20) {
        alerts.push({
          type: 'warning',
          message: `High delivery volume: ${activeDeliveries.length} active deliveries`,
          time: '15 min ago'
        });
      }

    } catch (error) {
      console.error('Error generating alerts:', error);
    }

    return alerts.slice(0, 3);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'In Transit':
        return <Clock className="text-yellow-600" size={16} />;
      case 'Picked Up':
        return <TrendingUp className="text-blue-600" size={16} />;
      case 'Assigned':
        return <Users className="text-purple-600" size={16} />;
      case 'Pending':
        return <Timer className="text-orange-600" size={16} />;
      default:
        return <XCircle className="text-red-600" size={16} />;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'Rs.0';
    return `Rs.${amount.toLocaleString()}`;
  };

  const formatChartCurrency = (value) => {
    if (!value || value === 0) return 'Rs.0';
    if (value >= 1000000) {
      return `Rs.${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `Rs.${(value / 1000).toFixed(0)}K`;
    }
    return `Rs.${value}`;
  };

  // Show loading spinner only on initial load
  if (loading) {
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
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <p className="text-red-600">{error}</p>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Header with manual refresh */}
      {/* <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Total Revenue: {formatCurrency(stats.totalRevenue)} • {stats.totalTransactions} Transactions
            {chartsLoading && <span className="ml-2 text-blue-600">(Loading charts...)</span>}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={fetchDashboardData}
            disabled={loading || chartsLoading}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${(loading || chartsLoading) ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Loading...' : chartsLoading ? 'Updating...' : 'Refresh'}</span>
          </button>
        </div>
      </div> */}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Available Agents',
            value: stats.availableRiders,
            change: `Out of ${stats.availableRiders + (stats.totalDeliveries > 0 ? Math.floor(stats.totalDeliveries * 0.1) : 5)} total`,
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
          },
          {
            title: 'Active Deliveries',
            value: stats.activeDeliveries,
            change: `${stats.totalDeliveries} total deliveries`,
            icon: Truck,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50'
          },
          {
            title: 'Total Hubs',
            value: stats.totalHubs,
            change: 'All operational',
            icon: Building2,
            color: 'text-green-600',
            bg: 'bg-green-50'
          },
          {
            title: 'System Alerts',
            value: alerts.length,
            change: alerts.length > 0 ? 'Needs attention' : 'All clear',
            icon: AlertTriangle,
            color: alerts.length > 0 ? 'text-red-600' : 'text-green-600',
            bg: alerts.length > 0 ? 'bg-red-50' : 'bg-green-50'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 font-heading">{stat.value}</p>
                  {/* <p className="text-xs text-gray-500 mt-1">{stat.change}</p> */}
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900 font-heading">
              Recent Delivery Updates
            </h3>
            <span className="text-sm text-gray-500">
              {stats.totalDeliveries} total deliveries
            </span>
          </div>
          <div className="space-y-4">
            {recentDeliveries.length > 0 ? (
              recentDeliveries.map((delivery, index) => (
                <div key={`${delivery.id}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent deliveries</p>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Agents by Hub - Top 10 */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900 font-heading">
              Top 10 Hubs by Agents
            </h3>
            {/* {chartsLoading && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Loading...</span>
              </div>
            )} */}
          </div>
          <div className="mt-10">
            {hubData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={hubData.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Agents']}
                    labelFormatter={(label) => `Hub: ${label}`}
                  />
                  <Bar dataKey="agents" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{chartsLoading ? 'Loading chart data...' : 'No hub data available'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Hub - Top 10 */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900 font-heading">
              Top 10 Hubs by Revenue (from Transactions)
            </h3>
            {/* {chartsLoading && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Loading...</span>
              </div>
            )} */}
          </div>
          {hubRevenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={hubRevenueData.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis tickFormatter={formatChartCurrency} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                  labelFormatter={(label) => `Hub: ${label}`}
                />
                <Line type="monotone" dataKey="revenue" stroke="#FBBF24" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{chartsLoading ? 'Loading revenue data...' : 'No revenue data available'}</p>
            </div>
          )}
        </div>

        {/* Deliveries by Hub - Top 10 */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900 font-heading">
              Top 10 Hubs by Deliveries
            </h3>
            {/* {chartsLoading && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Loading...</span>
              </div>
            )} */}
          </div>
          {hubDeliveryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={hubDeliveryData.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [value, 'Deliveries']}
                  labelFormatter={(label) => `Hub: ${label}`}
                />
                <Bar dataKey="deliveries" fill="#22C55E" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{chartsLoading ? 'Loading delivery data...' : 'No delivery data available'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 font-heading">
            System Alerts
          </h3>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div 
                key={index} 
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  alert.type === 'error' ? 'bg-red-50 border border-red-200' :
                  alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-blue-50 border border-blue-200'
                }`}
              >
                <AlertTriangle 
                  className={`h-5 w-5 ${
                    alert.type === 'error' ? 'text-red-600' :
                    alert.type === 'warning' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} 
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;