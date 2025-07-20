import React from 'react';
import { TrendingUp, Users, BookOpen, Calendar, DollarSign, Star, BarChart3, UserPlus } from 'lucide-react';

const Analytics = () => {
  const stats = [
    { label: 'Total Users', value: '12,847', change: '+12.5%', icon: Users, color: 'bg-blue-500 text-white' },
    { label: 'Active Books', value: '3,421', change: '+8.2%', icon: BookOpen, color: 'bg-yellow-400 text-white' },
    { label: 'Monthly Transactions', value: '1,234', change: '+24.1%', icon: DollarSign, color: 'bg-blue-500 text-white' },
    { label: 'Events Hosted', value: '47', change: '+15.3%', icon: Calendar, color: 'bg-yellow-400 text-white' },
  ];

  const topGenres = [
    { name: 'Fiction', percentage: 35, color: 'bg-blue-500' },
    { name: 'Non-Fiction', percentage: 28, color: 'bg-yellow-400' },
    { name: 'Science', percentage: 15, color: 'bg-blue-500' },
    { name: 'History', percentage: 12, color: 'bg-yellow-400' },
    { name: 'Biography', percentage: 10, color: 'bg-blue-500' },
  ];

  const topUsers = [
    { name: 'Kasun Perera', transactions: 45, trustScore: 4.9, type: 'Lender' },
    { name: 'Nimali Silva', transactions: 38, trustScore: 4.8, type: 'Seller' },
    { name: 'Rajesh Fernando', transactions: 32, trustScore: 4.7, type: 'Reader' },
    { name: 'Priya Wickrama', transactions: 28, trustScore: 4.6, type: 'Lender' },
  ];

  // Sample data for monthly revenue
  const monthlyRevenue = [
    { month: 'Jan', revenue: 15420 },
    { month: 'Feb', revenue: 18350 },
    { month: 'Mar', revenue: 22100 },
    { month: 'Apr', revenue: 19800 },
    { month: 'May', revenue: 25600 },
    { month: 'Jun', revenue: 28900 },
    { month: 'Jul', revenue: 31200 },
    { month: 'Aug', revenue: 29800 },
    { month: 'Sep', revenue: 33400 },
    { month: 'Oct', revenue: 36700 },
    { month: 'Nov', revenue: 39200 },
    { month: 'Dec', revenue: 42100 }
  ];

  // Sample data for yearly new users
  const yearlyUsers = [
    { year: '2020', users: 1200 },
    { year: '2021', users: 2800 },
    { year: '2022', users: 4500 },
    { year: '2023', users: 7200 },
    { year: '2024', users: 12847 }
  ];

  const maxRevenue = Math.max(...monthlyRevenue.map(item => item.revenue));
  const maxUsers = Math.max(...yearlyUsers.map(item => item.users));

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Analytics & Reports</h1>
          <p className="text-slate-600 mt-2 text-lg">Platform insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-950 transition-colors duration-200 shadow-sm">
            Export Report
          </button>
          <select className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Last Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
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
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Popular Genres</h3>
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
                      style={{ width: `${genre.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-slate-600 w-10 font-medium">{genre.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Top Users</h3>
          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.split(' ').map(n => n[0]).join('')}
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
        </div>
      </div>

      {/* Monthly Revenue and Yearly Users Graphs in One Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Graph */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-blue-500" />
              Monthly Revenue (2024)
            </h3>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">LKR 42,100</p>
              <p className="text-sm text-green-500 font-medium">+18.2% vs last month</p>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2 px-4">
            {monthlyRevenue.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-blue-500 rounded-t-lg transition-all duration-500 hover:bg-blue-600 relative group"
                  style={{ height: `${(item.revenue / maxRevenue) * 200}px` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    LKR {item.revenue.toLocaleString()}
                  </div>
                </div>
                <span className="text-xs text-slate-600 mt-2 font-medium">{item.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-500">Platform commission fees and subscription revenue</p>
          </div>
        </div>

        {/* Yearly New Users Graph */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-yellow-500" />
              Yearly New User Growth
            </h3>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">12,847</p>
              <p className="text-sm text-green-500 font-medium">Total registered users</p>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between space-x-4 px-4">
            {yearlyUsers.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-yellow-400 rounded-t-lg transition-all duration-500 hover:bg-yellow-500 relative group"
                  style={{ height: `${(item.users / maxUsers) * 200}px` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.users.toLocaleString()} users
                  </div>
                </div>
                <span className="text-sm text-slate-600 mt-2 font-bold">{item.year}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-500">Cumulative user registrations by year</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;