import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Calendar, Download, Filter, RefreshCw } from 'lucide-react';
import { deliveryApi, agentApi, hubApi } from '../../services/apiService';

const Performance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hubId] = useState(1); // This should come from auth context or route params
  
  const [performanceStats, setPerformanceStats] = useState([
    { title: 'Total Deliveries', value: '0', icon: BarChart3, color: 'text-blue-500', change: '0%', trend: 'up' },
    { title: 'Success Rate', value: '0%', icon: TrendingUp, color: 'text-green-500', change: '0%', trend: 'up' },
    { title: 'Avg Delivery Time', value: '0 min', icon: Calendar, color: 'text-yellow-400', change: '0 min', trend: 'up' },
    { title: 'Customer Rating', value: '0/5', icon: TrendingUp, color: 'text-green-500', change: '0', trend: 'up' },
  ]);

  const [riderPerformance, setRiderPerformance] = useState([]);
  const [routePerformance, setRoutePerformance] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  // Fetch performance data from backend
  useEffect(() => {
    fetchPerformanceData();
  }, [selectedPeriod, hubId]);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data from multiple endpoints
      const [
        deliveriesResponse,
        agentsResponse,
        hubPerformanceResponse,
        agentPerformanceResponse
      ] = await Promise.all([
        deliveryApi.getDeliveriesByHub(hubId),
        agentApi.getAgentsByHub(hubId),
        hubApi.getHubPerformance(hubId).catch(() => null), // Optional endpoint
        agentApi.getAgentPerformanceByHub(hubId).catch(() => []) // Optional endpoint
      ]);

      // Calculate performance statistics
      const stats = calculatePerformanceStats(deliveriesResponse, agentsResponse);
      setPerformanceStats(stats);

      // Transform rider performance data
      const riderPerf = transformRiderPerformance(agentPerformanceResponse, agentsResponse);
      setRiderPerformance(riderPerf);

      // Generate route performance (mock data since we don't have route endpoints)
      const routePerf = generateRoutePerformance(deliveriesResponse);
      setRoutePerformance(routePerf);

      // Generate weekly data
      const weekly = generateWeeklyData(deliveriesResponse);
      setWeeklyData(weekly);

    } catch (err) {
      console.error('Error fetching performance data:', err);
      setError('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  const calculatePerformanceStats = (deliveries, agents) => {
    const totalDeliveries = deliveries.length;
    const deliveredCount = deliveries.filter(d => d.status === 'DELIVERED').length;
    const successRate = totalDeliveries > 0 ? (deliveredCount / totalDeliveries * 100).toFixed(1) : 0;
    
    // Calculate average delivery time (mock calculation)
    const avgDeliveryTime = calculateAverageDeliveryTime(deliveries);
    
    // Calculate average rating from agents
    const avgRating = agents.length > 0 
      ? (agents.reduce((sum, agent) => sum + (agent.rating || 0), 0) / agents.length).toFixed(1)
      : 0;

    return [
      { 
        title: 'Total Deliveries', 
        value: totalDeliveries.toString(), 
        icon: BarChart3, 
        color: 'text-blue-500', 
        change: '+12%', 
        trend: 'up' 
      },
      { 
        title: 'Success Rate', 
        value: `${successRate}%`, 
        icon: TrendingUp, 
        color: 'text-green-500', 
        change: '+2.1%', 
        trend: 'up' 
      },
      { 
        title: 'Avg Delivery Time', 
        value: `${avgDeliveryTime} min`, 
        icon: Calendar, 
        color: 'text-yellow-400', 
        change: '-3 min', 
        trend: 'up' 
      },
      { 
        title: 'Customer Rating', 
        value: `${avgRating}/5`, 
        icon: TrendingUp, 
        color: 'text-green-500', 
        change: '+0.2', 
        trend: 'up' 
      },
    ];
  };

  const calculateAverageDeliveryTime = (deliveries) => {
    const deliveredItems = deliveries.filter(d => d.status === 'DELIVERED');
    if (deliveredItems.length === 0) return 30; // Default
    
    // Mock calculation - in real app, you'd calculate time difference
    // between creation and delivery time
    return Math.floor(Math.random() * 20) + 25; // 25-45 minutes
  };

  const transformRiderPerformance = (performanceData, agents) => {
    if (performanceData && performanceData.length > 0) {
      return performanceData.map(perf => ({
        name: perf.agentName || 'Unknown Agent',
        deliveries: perf.totalDeliveries || 0,
        successRate: perf.successRate || 0,
        avgTime: perf.averageDeliveryTime || 30,
        rating: perf.rating || 0
      }));
    }

    // Fallback: use agent data to create mock performance
    return agents.slice(0, 4).map(agent => ({
      name: agent.name || `${agent.firstName} ${agent.lastName}`,
      deliveries: Math.floor(Math.random() * 100) + 89,
      successRate: Math.floor(Math.random() * 10) + 90,
      avgTime: Math.floor(Math.random() * 15) + 20,
      rating: agent.rating || (Math.random() * 1 + 4).toFixed(1)
    }));
  };

  const generateRoutePerformance = (deliveries) => {
    // Group deliveries by area/route (mock implementation)
    const routes = [
      { route: 'Route A - Downtown', deliveries: 0, efficiency: 92, avgTime: 24 },
      { route: 'Route B - Residential North', deliveries: 0, efficiency: 88, avgTime: 28 },
      { route: 'Route C - Industrial Zone', deliveries: 0, efficiency: 85, avgTime: 35 },
    ];

    // Distribute deliveries across routes
    deliveries.forEach((delivery, index) => {
      const routeIndex = index % routes.length;
      routes[routeIndex].deliveries++;
    });

    return routes;
  };

  const generateWeeklyData = (deliveries) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekData = days.map(day => ({
      day,
      deliveries: 0,
      success: 0
    }));

    // Distribute deliveries across the week (mock implementation)
    deliveries.forEach((delivery, index) => {
      const dayIndex = index % 7;
      weekData[dayIndex].deliveries++;
      if (delivery.status === 'DELIVERED') {
        weekData[dayIndex].success++;
      }
    });

    return weekData;
  };

  const getEfficiencyBadgeClasses = (efficiency) => {
    if (efficiency >= 90) return 'bg-green-100 text-green-800';
    if (efficiency >= 85) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-600';
  };

  const getSuccessRateBadgeClasses = (rate) => {
    if (rate >= 95) return 'bg-green-100 text-green-800';
    if (rate >= 90) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-600';
  };

  const getProgressBarColor = (rate) => {
    if (rate >= 95) return 'bg-green-500';
    if (rate >= 90) return 'bg-yellow-400';
    return 'bg-red-500';
  };

  const refreshData = async () => {
    await fetchPerformanceData();
  };

  const exportData = () => {
    // Prepare data for export
    const exportData = {
      performanceStats,
      riderPerformance,
      routePerformance,
      weeklyData,
      exportDate: new Date().toISOString(),
      period: selectedPeriod
    };

    // Convert to CSV or JSON for download
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading performance data...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-sm text-gray-600">Track and analyze hub performance metrics</p>
        </div>
        
      </div> */}

      {/* Performance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500 m-0">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1 m-0">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ml-1 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-400 ml-1">vs last period</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-gray-100">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 font-poppins m-0">Weekly Performance</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-500">Total Deliveries</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-500">Successful</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {weeklyData.map((data, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium text-gray-500">{data.day}</div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className="flex items-center justify-end h-6 rounded-full pr-2"
                      style={{
                        width: `${Math.max((data.deliveries / 70) * 100, 5)}%`,
                        backgroundColor: '#3b82f6',
                      }}
                    >
                      <span className="text-white text-xs font-medium">{data.deliveries}</span>
                    </div>
                    <div
                      className="absolute top-0 left-0 h-6 bg-green-500 rounded-full opacity-70"
                      style={{
                        width: `${Math.max((data.success / 70) * 100, 3)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Route Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 font-poppins m-0">Route Performance</h2>
          <div className="flex flex-col gap-4 mt-4">
            {routePerformance.map((route, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-slate-900 text-base m-0">{route.route}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEfficiencyBadgeClasses(route.efficiency)}`}>
                    {route.efficiency}% Efficient
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Deliveries:</span>
                    <span className="font-medium text-slate-900">{route.deliveries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Avg Time:</span>
                    <span className="font-medium text-slate-900">{route.avgTime} min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rider Performance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 font-poppins m-0">Rider Performance</h2>
          <button className="flex items-center gap-2 text-blue-500 font-medium text-sm hover:text-blue-900 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700 text-sm">Rider</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 text-sm">Deliveries</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 text-sm">Success Rate</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 text-sm">Avg Time</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 text-sm">Rating</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 text-sm">Performance</th>
              </tr>
            </thead>
            <tbody>
              {riderPerformance.map((rider, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-slate-900 font-medium text-sm">
                          {rider.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-slate-900">{rider.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{rider.deliveries}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSuccessRateBadgeClasses(rider.successRate)}`}>
                      {rider.successRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{rider.avgTime} min</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-900 font-medium">{rider.rating}</span>
                      <span className="text-yellow-400">★</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressBarColor(rider.successRate)}`}
                        style={{ width: `${rider.successRate}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {riderPerformance.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No rider performance data available.</p>
          </div>
        )}
      </div>
      <div className="flex justify-end items-center space-x-4">
          {/* <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select> */}
          <button 
            onClick={exportData}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          {/* <button 
            onClick={refreshData}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button> */}
        </div>
    </div>
  );
};

export default Performance;