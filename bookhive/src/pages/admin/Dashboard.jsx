import React from 'react';
import { Users, BookOpen, AlertTriangle, TrendingUp, Calendar, Star } from 'lucide-react';
import MetricCard from './MetricCard';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';

const Dashboard = () => {
  const metrics = [
    {
      title: 'Total Users',
      value: '12,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-900'
    },
    {
      title: 'Active Listings',
      value: '3,421',
      change: '+8.2%',
      changeType: 'positive',
      icon: BookOpen,
      color: 'bg-yellow-400'
    },
    {
      title: 'Pending Approvals',
      value: '23',
      change: '-15.3%',
      changeType: 'positive',
      icon: AlertTriangle,
      color: 'bg-blue-500'
    },
    {
      title: 'Monthly Revenue',
      value: 'LKR 245K',
      change: '+24.1%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-blue-900'
    },
    {
      title: 'Active Events',
      value: '7',
      change: '+2',
      changeType: 'positive',
      icon: Calendar,
      color: 'bg-yellow-400'
    },
    {
      title: 'Avg Trust Score',
      value: '4.8',
      change: '+0.2',
      changeType: 'positive',
      icon: Star,
      color: 'bg-blue-500'
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2 text-lg">Welcome back! Here's what's happening on BookHive today.</p>
        </div>
        <div className="text-right bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Last updated</p>
          <p className="text-sm font-semibold text-slate-900">{new Date().toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;