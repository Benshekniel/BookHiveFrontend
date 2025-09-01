import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, BookOpen, Calendar, DollarSign, Star, UserPlus } from 'lucide-react';
import AdminModeratorService from '../../services/adminService';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [yearlyUsers, setYearlyUsers] = useState([]);
  const [selectedYear] = useState(new Date().getFullYear());
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 Days');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedYear]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Based on the Postman response, it looks like you might be getting all data from one endpoint
      // Let's try the dashboard endpoint first
      let dashboardData;
      try {
        dashboardData = await AdminModeratorService.getDashboardData();
        console.log('Dashboard Response:', JSON.stringify(dashboardData, null, 2));
      } catch (dashboardError) {
        console.log('Dashboard endpoint not available, trying individual endpoints...');
      }

      // If dashboard data is available, use it; otherwise, fetch individual endpoints
      if (dashboardData && (dashboardData.stats || dashboardData.popularGenres)) {
        await processAnalyticsData(dashboardData);
      } else {
        // Fallback to individual API calls
        const [
          statsResponse,
          genresResponse,
          topUsersResponse,
          revenueResponse,
          yearlyUsersResponse
        ] = await Promise.all([
          AdminModeratorService.getAnalyticsStats(),
          AdminModeratorService.getPopularGenres(),
          AdminModeratorService.getTopUsers(4),
          AdminModeratorService.getMonthlyRevenue(selectedYear),
          AdminModeratorService.getYearlyUsers()
        ]);

        console.log('=== INDIVIDUAL API RESPONSES ===');
        console.log('Stats Response:', JSON.stringify(statsResponse, null, 2));
        console.log('Genres Response:', JSON.stringify(genresResponse, null, 2));
        console.log('Top Users Response:', JSON.stringify(topUsersResponse, null, 2));
        console.log('Monthly Revenue Response:', JSON.stringify(revenueResponse, null, 2));
        console.log('Yearly Users Response:', JSON.stringify(yearlyUsersResponse, null, 2));

        // Process individual responses
        await processIndividualResponses({
          statsResponse,
          genresResponse,
          topUsersResponse,
          revenueResponse,
          yearlyUsersResponse
        });
      }

    } catch (err) {
      console.error('Error fetching analytics data:', err);
      console.error('Error stack:', err.stack);
      setError(`Failed to load analytics data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = async (data) => {
    console.log('Processing analytics data:', JSON.stringify(data, null, 2));

    // Process stats data
    const iconMap = {
      'Total Users': Users,
      'Active Books': BookOpen,
      'Total Revenue': DollarSign,
      'Active Exchanges': Calendar,
      'Monthly Transactions': DollarSign,
      'Events Hosted': Calendar,
    };
    
    const colorMap = {
      'Total Users': 'bg-blue-500 text-white',
      'Active Books': 'bg-yellow-400 text-white',
      'Total Revenue': 'bg-blue-500 text-white',
      'Active Exchanges': 'bg-yellow-400 text-white',
      'Monthly Transactions': 'bg-blue-500 text-white',
      'Events Hosted': 'bg-yellow-400 text-white',
    };

    // Handle stats from the nested structure
    const statsData = data.stats?.stats || [];
    console.log('Processing stats:', statsData);
    
    const processedStats = Array.isArray(statsData) ? statsData.map(stat => ({
      label: stat.label || 'Unknown',
      value: stat.value || '0',
      change: stat.change || '+0%',
      icon: iconMap[stat.label] || Users,
      color: colorMap[stat.label] || 'bg-blue-500 text-white'
    })) : [];
    setStats(processedStats);

    // Handle genres from the nested structure
    const genreData = data.popularGenres?.topGenres || [];
    console.log('Processing genres:', genreData);
    
    const genreColors = ['bg-blue-500', 'bg-yellow-400', 'bg-green-500', 'bg-purple-500', 'bg-red-500'];
    const processedGenres = Array.isArray(genreData) ? genreData.map((genre, index) => ({
      name: genre.name || 'Unknown',
      percentage: genre.percentage || 0,
      color: genreColors[index % genreColors.length]
    })) : [];
    setTopGenres(processedGenres);

    // Handle top users from the nested structure
    const userData = data.topUsers?.topUsers || [];
    console.log('Processing users:', userData);
    
    const processedUsers = Array.isArray(userData) ? userData.map(user => ({
      name: user.name || user.username || 'Unknown User',
      type: user.type || user.userType || 'User',
      trustScore: user.trustScore || user.rating || 0,
      transactions: user.transactions || user.transactionCount || 0
    })) : [];
    setTopUsers(processedUsers);

    // Handle monthly revenue from the nested structure
    const revenueData = data.monthlyRevenue?.monthlyRevenue || [];
    console.log('Processing revenue:', revenueData);
    
    const processedRevenue = Array.isArray(revenueData) ? revenueData.map(item => ({
      month: item.month || 'Unknown',
      revenue: parseFloat(item.revenue || 0)
    })) : [];
    setMonthlyRevenue(processedRevenue);

    // Handle yearly users from the nested structure
    const yearlyData = data.yearlyUsers?.yearlyUsers || [];
    console.log('Processing yearly users:', yearlyData);
    
    const processedYearlyUsers = Array.isArray(yearlyData) ? yearlyData.map(item => ({
      year: item.year || 'Unknown',
      users: parseInt(item.users || 0)
    })) : [];
    setYearlyUsers(processedYearlyUsers);

    console.log('=== FINAL PROCESSED DATA ===');
    console.log('Final Stats:', processedStats);
    console.log('Final Genres:', processedGenres);
    console.log('Final Users:', processedUsers);
    console.log('Final Revenue:', processedRevenue);
    console.log('Final Yearly Users:', processedYearlyUsers);
  };

  const processIndividualResponses = async (responses) => {
    const { statsResponse, genresResponse, topUsersResponse, revenueResponse, yearlyUsersResponse } = responses;

    // Process stats data
    const iconMap = {
      'Total Users': Users,
      'Active Books': BookOpen,
      'Total Revenue': DollarSign,
      'Active Exchanges': Calendar,
      'Monthly Transactions': DollarSign,
      'Events Hosted': Calendar,
    };
    
    const colorMap = {
      'Total Users': 'bg-blue-500 text-white',
      'Active Books': 'bg-yellow-400 text-white',
      'Total Revenue': 'bg-blue-500 text-white',
      'Active Exchanges': 'bg-yellow-400 text-white',
      'Monthly Transactions': 'bg-blue-500 text-white',
      'Events Hosted': 'bg-yellow-400 text-white',
    };

    // Handle stats with multiple fallback options
    let statsData = [];
    if (statsResponse) {
      statsData = statsResponse.stats?.stats || 
                 statsResponse.stats || 
                 statsResponse.data?.stats || 
                 statsResponse.data || 
                 (Array.isArray(statsResponse) ? statsResponse : []);
    }
    
    const processedStats = Array.isArray(statsData) ? statsData.map(stat => ({
      label: stat.label || 'Unknown',
      value: stat.value || '0',
      change: stat.change || '+0%',
      icon: iconMap[stat.label] || Users,
      color: colorMap[stat.label] || 'bg-blue-500 text-white'
    })) : [];
    setStats(processedStats);

    // Handle genres with multiple fallback options
    let genreData = [];
    if (genresResponse) {
      genreData = genresResponse.popularGenres?.topGenres ||
                 genresResponse.topGenres ||
                 genresResponse.genres || 
                 genresResponse.data?.genres || 
                 genresResponse.data || 
                 (Array.isArray(genresResponse) ? genresResponse : []);
    }
    
    const genreColors = ['bg-blue-500', 'bg-yellow-400', 'bg-green-500', 'bg-purple-500', 'bg-red-500'];
    const processedGenres = Array.isArray(genreData) ? genreData.map((genre, index) => ({
      name: genre.name || 'Unknown',
      percentage: genre.percentage || 0,
      color: genreColors[index % genreColors.length]
    })) : [];
    setTopGenres(processedGenres);

    // Handle top users with multiple fallback options
    let userData = [];
    if (topUsersResponse) {
      userData = topUsersResponse.topUsers?.topUsers ||
                topUsersResponse.topUsers ||
                topUsersResponse.users || 
                topUsersResponse.data?.users || 
                topUsersResponse.data || 
                (Array.isArray(topUsersResponse) ? topUsersResponse : []);
    }
    
    const processedUsers = Array.isArray(userData) ? userData.map(user => ({
      name: user.name || user.username || 'Unknown User',
      type: user.type || user.userType || 'User',
      trustScore: user.trustScore || user.rating || 0,
      transactions: user.transactions || user.transactionCount || 0
    })) : [];
    setTopUsers(processedUsers);

    // Handle monthly revenue with multiple fallback options
    let revenueData = [];
    if (revenueResponse) {
      revenueData = revenueResponse.monthlyRevenue?.monthlyRevenue ||
                   revenueResponse.monthlyRevenue ||
                   revenueResponse.monthlyData || 
                   revenueResponse.data?.monthlyData || 
                   revenueResponse.data || 
                   (Array.isArray(revenueResponse) ? revenueResponse : []);
    }
    
    const processedRevenue = Array.isArray(revenueData) ? revenueData.map(item => ({
      month: item.month || 'Unknown',
      revenue: parseFloat(item.revenue || 0)
    })) : [];
    setMonthlyRevenue(processedRevenue);

    // Handle yearly users with multiple fallback options
    let yearlyData = [];
    if (yearlyUsersResponse) {
      yearlyData = yearlyUsersResponse.yearlyUsers?.yearlyUsers ||
                  yearlyUsersResponse.yearlyUsers ||
                  yearlyUsersResponse.yearlyData || 
                  yearlyUsersResponse.data?.yearlyData || 
                  yearlyUsersResponse.data || 
                  (Array.isArray(yearlyUsersResponse) ? yearlyUsersResponse : []);
    }
    
    const processedYearlyUsers = Array.isArray(yearlyData) ? yearlyData.map(item => ({
      year: item.year || 'Unknown',
      users: parseInt(item.users || 0)
    })) : [];
    setYearlyUsers(processedYearlyUsers);
  };

  const handleExportReport = async () => {
    try {
      console.log('Exporting report...');
      // Add export logic here
    } catch (err) {
      console.error('Error exporting report:', err);
    }
  };

  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
    fetchAnalyticsData();
  };

  if (loading) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchAnalyticsData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Analytics & Reports</h1>
          <p className="text-slate-600 mt-2 text-lg">Platform insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportReport}
            className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors duration-200 shadow-sm"
          >
            Export Report
          </button>
          <select 
            value={selectedPeriod}
            onChange={handlePeriodChange}
            className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          >
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Last Year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.length > 0 ? stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-500 mt-2 font-medium">{stat.change} from last month</p>
                </div>
                <div className={`p-4 rounded-xl shadow-md ${stat.color}`}>
                  <Icon className="w-7 h-7" />
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-4 text-center py-8">
            <p className="text-slate-600">No statistics data available.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Genres */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Popular Genres</h3>
          {topGenres.length > 0 ? (
            <div className="space-y-4">
              {topGenres.map((genre, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${genre.color}`}></div>
                    <span className="text-sm font-semibold text-slate-900">{genre.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${genre.color}`}
                        style={{ width: `${Math.min(genre.percentage, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-600 w-10 font-medium">{genre.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-slate-600">No genre data available.</p>
              <p className="text-xs text-slate-500 mt-2">Check console for API response details</p>
            </div>
          )}
        </div>

        {/* Top Users */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Top Users</h3>
          {topUsers.length > 0 ? (
            <div className="space-y-4">
              {topUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-slate-600 font-medium">{user.trustScore}</span>
                    </div>
                    <p className="text-xs text-slate-500">{user.transactions} transactions</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-slate-600">No top users available.</p>
              <p className="text-xs text-slate-500 mt-2">Top users list is empty in the API response</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-blue-500" />
              Monthly Revenue ({selectedYear})
            </h3>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">
                LKR {monthlyRevenue.length > 0 ? monthlyRevenue[monthlyRevenue.length - 1]?.revenue?.toLocaleString() : '0'}
              </p>
              <p className="text-sm text-green-500 font-medium">+18.2% vs last month</p>
            </div>
          </div>
          {monthlyRevenue.length > 0 ? (
            <div className="h-64 flex items-end justify-between space-x-2 px-4">
              {monthlyRevenue.map((item, index) => {
                const maxRevenue = Math.max(...monthlyRevenue.map(r => r.revenue || 0), 1);
                const heightPercentage = (item.revenue / maxRevenue) * 100;
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-blue-500 rounded-t-lg transition-all duration-500 hover:bg-blue-600 relative group"
                      style={{ height: `${Math.max(heightPercentage * 2, 10)}px` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        LKR {item.revenue?.toLocaleString() || '0'}
                      </div>
                    </div>
                    <span className="text-xs text-slate-600 mt-2 font-medium">{item.month}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-slate-600">No revenue data available.</p>
              <p className="text-xs text-slate-500 mt-2">Check console for API response details</p>
            </div>
          )}
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-500">Platform commission fees and subscription revenue</p>
          </div>
        </div>

        {/* Yearly User Growth */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-yellow-500" />
              Yearly New User Growth
            </h3>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">
                {yearlyUsers.length > 0 ? yearlyUsers[yearlyUsers.length - 1]?.users?.toLocaleString() : '0'}
              </p>
              <p className="text-sm text-green-500 font-medium">Total registered users</p>
            </div>
          </div>
          {yearlyUsers.length > 0 ? (
            <div className="h-64 flex items-end justify-between space-x-4 px-4">
              {yearlyUsers.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-yellow-400 rounded-t-lg transition-all duration-500 hover:bg-yellow-500 relative group"
                    style={{ height: `${Math.max((item.users / Math.max(...yearlyUsers.map(u => u.users || 0), 1)) * 200, 10)}px` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.users?.toLocaleString() || '0'} users
                    </div>
                  </div>
                  <span className="text-sm text-slate-600 mt-2 font-bold">{item.year}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-slate-600">No user growth data available.</p>
              <p className="text-xs text-slate-500 mt-2">Check console for API response details</p>
            </div>
          )}
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-500">Cumulative user registrations by year</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;