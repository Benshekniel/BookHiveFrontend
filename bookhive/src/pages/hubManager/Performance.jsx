import { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Calendar, Download, Filter } from 'lucide-react';
import Card from '../../components/hubmanager/Card';

const Performance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const performanceStats = [
    { title: 'Total Deliveries', value: '1,247', icon: BarChart3, color: 'text-blue-500', change: '+12%', trend: 'up' },
    { title: 'Success Rate', value: '94.2%', icon: TrendingUp, color: 'text-green-500', change: '+2.1%', trend: 'up' },
    { title: 'Avg Delivery Time', value: '28 min', icon: Calendar, color: 'text-yellow-400', change: '-3 min', trend: 'up' },
    { title: 'Customer Rating', value: '4.8/5', icon: TrendingUp, color: 'text-green-500', change: '+0.2', trend: 'up' },
  ];

  const riderPerformance = [
    { name: 'Mike Johnson', deliveries: 156, successRate: 98, avgTime: 25, rating: 4.9 },
    { name: 'Alex Brown', deliveries: 142, successRate: 95, avgTime: 27, rating: 4.8 },
    { name: 'Emma Davis', deliveries: 138, successRate: 96, avgTime: 26, rating: 4.7 },
    { name: 'Tom Wilson', deliveries: 89, successRate: 92, avgTime: 32, rating: 4.6 },
  ];

  const routePerformance = [
    { route: 'Route A - Downtown', deliveries: 425, efficiency: 92, avgTime: 24 },
    { route: 'Route B - Residential North', deliveries: 356, efficiency: 88, avgTime: 28 },
    { route: 'Route C - Industrial Zone', deliveries: 298, efficiency: 85, avgTime: 35 },
  ];

  const weeklyData = [
    { day: 'Mon', deliveries: 45, success: 43 },
    { day: 'Tue', deliveries: 52, success: 49 },
    { day: 'Wed', deliveries: 48, success: 46 },
    { day: 'Thu', deliveries: 61, success: 58 },
    { day: 'Fri', deliveries: 55, success: 52 },
    { day: 'Sat', deliveries: 38, success: 36 },
    { day: 'Sun', deliveries: 32, success: 30 },
  ];

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

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">

      {/* Performance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceStats.map((stat, index) => (
          <Card key={index} className="p-6">
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
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance Chart */}
        <Card>
          <div className="p-6">
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
                          width: `${(data.deliveries / 70) * 100}%`,
                          backgroundColor: '#3b82f6',
                        }}
                      >
                        <span className="text-white text-xs font-medium">{data.deliveries}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Route Performance */}
        <Card>
          <div className="p-6">
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
        </Card>
      </div>

      {/* Rider Performance Table */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 font-poppins m-0">Rider Performance</h2>
            <button
              className="flex items-center gap-2 text-blue-500 font-medium text-sm hover:text-blue-900 transition-colors"
            >
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
                {
                  riderPerformance.map((rider, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
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
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Performance;
