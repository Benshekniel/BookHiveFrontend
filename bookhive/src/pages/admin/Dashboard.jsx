import React, { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Star,
  Clock,
  User,
  AlertCircle,
  UserPlus,
  BarChart,
  RefreshCw,
  Loader
} from 'lucide-react';
import AdminModeratorService from '../../services/adminService'; // Adjust the import path as needed

// MetricCard Component
const MetricCard = ({ title, value, change, changeType, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-500',
    yellow: 'bg-yellow-50 text-yellow-400',
    green: 'bg-green-50 text-green-500',
    purple: 'bg-blue-50 text-blue-500',
    pink: 'bg-red-50 text-red-500',
    amber: 'bg-yellow-400 text-white',
    white: 'bg-white text-slate-500'
  };

  const iconColorClasses = {
    blue: 'bg-blue-100 text-blue-500',
    yellow: 'bg-yellow-100 text-yellow-400',
    green: 'bg-green-100 text-green-500',
    purple: 'bg-blue-100 text-blue-500',
    pink: 'bg-red-100 text-red-500',
    amber: 'bg-yellow-400 text-white',
    white: 'bg-slate-100 text-slate-600'
  };

  return (
    <div className={`bg-white rounded-xl p-6 border-2 border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          <p className={`text-sm mt-2 font-medium ${changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
            {change} from last month
          </p>
        </div>
        <div className={`p-4 rounded-xl ${iconColorClasses[color]} shadow-md`}>
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </div>
  );
};

// RecentActivity Component
const RecentActivity = ({ activities, loading }) => {
  const getColorClasses = (type) => {
    switch (type?.toLowerCase()) {
      case 'user':
        return 'bg-blue-50 text-blue-500';
      case 'book':
        return 'bg-yellow-50 text-yellow-400';
      case 'alert':
      case 'dispute':
        return 'bg-red-50 text-red-500';
      case 'approval':
        return 'bg-green-50 text-green-500';
      default:
        return 'bg-slate-50 text-slate-600';
    }
  };

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'user':
        return User;
      case 'book':
        return BookOpen;
      case 'alert':
      case 'dispute':
        return AlertCircle;
      case 'approval':
        return UserPlus;
      default:
        return AlertCircle;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-blue-500" />
          Recent Activity
        </h3>
        <div className="flex items-center justify-center py-8">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Clock className="w-6 h-6 text-blue-500" />
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities && activities.length > 0 ? (
          activities.map((activity, index) => {
            const Icon = getIcon(activity.type);
            return (
              <div key={activity.id || index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-slate-200">
                <div className={`p-3 rounded-full ${getColorClasses(activity.type)} shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-slate-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No recent activities found</p>
          </div>
        )}
      </div>
    </div>
  );
};

// QuickActions Component
const QuickActions = ({ quickActionData, loading }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 border-blue-500 hover:bg-blue-100 text-blue-500 hover:shadow-lg';
      case 'yellow':
        return 'bg-yellow-50 border-yellow-400 hover:bg-yellow-100 text-yellow-400 hover:shadow-lg';
      case 'red':
        return 'bg-red-50 border-red-500 hover:bg-red-100 text-red-500 hover:shadow-lg';
      case 'green':
        return 'bg-green-50 border-green-500 hover:bg-green-100 text-green-500 hover:shadow-lg';
      default:
        return 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 hover:shadow-lg';
    }
  };

  // Default quick actions - these will be used as templates and populated with backend data
  const defaultQuickActions = [
    {
      title: 'Approve Users',
      description: 'pending approvals',
      icon: UserPlus,
      color: 'blue',
      key: 'pendingUserApprovals',
      action: () => console.log('Navigate to user approvals')
    },
    {
      title: 'Resolve Disputes',
      description: 'active disputes',
      icon: AlertTriangle,
      color: 'red',
      key: 'activeDisputes',
      action: () => console.log('Navigate to dispute resolution')
    },
    {
      title: 'Manage Moderators',
      description: 'active moderators',
      icon: Users,
      color: 'yellow',
      key: 'activeModerators',
      action: () => console.log('Navigate to moderator management')
    },
  ];

  // Prepare quick actions with backend data
  const prepareQuickActions = () => {
    return defaultQuickActions.map(action => {
      let count = '';
      let description = action.description;

      // If we have backend data, use it to populate counts
      if (quickActionData) {
        const backendCount = quickActionData[action.key];
        if (backendCount !== undefined) {
          count = typeof backendCount === 'number' ? backendCount.toString() : backendCount;
          description = `${count} ${action.description}`;
        }
      }

      return {
        ...action,
        description: description
      };
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
        <div className="flex items-center justify-center py-8">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  const quickActions = prepareQuickActions();

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
      <div className="space-y-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.action}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 transform hover:scale-105 ${getColorClasses(action.color)}`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-6 h-6" />
                <div>
                  <p className="font-semibold text-sm text-slate-900">{action.title}</p>
                  <p className="text-xs text-slate-600">{action.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Error Component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
    <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Dashboard</h3>
    <p className="text-red-700 mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
    >
      <RefreshCw className="w-4 h-4" />
      Retry
    </button>
  </div>
);

// Main Dashboard Component
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Default metric configuration for mapping backend data
  const defaultMetrics = [
    {
      title: 'Total Users',
      key: 'totalUsers',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Listings',
      key: 'activeListings',
      icon: BookOpen,
      color: 'white'
    },
    {
      title: 'Pending Approvals',
      key: 'pendingApprovals',
      icon: AlertTriangle,
      color: 'purple'
    },
    {
      title: 'Monthly Revenue',
      key: 'monthlyRevenue',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Active Events',
      key: 'activeEvents',
      icon: Calendar,
      color: 'white'
    },
    {
      title: 'Avg Trust Score',
      key: 'avgTrustScore',
      icon: Star,
      color: 'pink'
    }
  ];

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AdminModeratorService.getDashboardData();
      
      if (response.success) {
        setDashboardData(response.data);
        setLastUpdated(new Date());
        console.log('Dashboard data received:', response.data); // Debug log
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err); // Debug log
      setError(AdminModeratorService.handleError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Prepare metrics data
  const prepareMetrics = () => {
    if (!dashboardData?.metrics) {
      // Return default values if no backend data
      return defaultMetrics.map(metric => ({
        title: metric.title,
        value: '0',
        change: '0%',
        changeType: 'positive',
        icon: metric.icon,
        color: metric.color
      }));
    }
    
    return defaultMetrics.map(metric => ({
      title: metric.title,
      value: dashboardData.metrics[metric.key] || '0',
      change: dashboardData.metrics[metric.key + 'Change'] || '0%',
      changeType: dashboardData.metrics[metric.key + 'ChangeType'] || 'positive',
      icon: metric.icon,
      color: metric.color
    }));
  };

  if (error) {
    return (
      <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-2 text-lg">Welcome back! Here's what's happening on BookHive today.</p>
          </div>
        </div>
        <ErrorMessage message={error} onRetry={fetchDashboardData} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2 text-lg">Welcome back! Here's what's happening on BookHive today.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchDashboardData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className="text-right bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">Last updated</p>
            <p className="text-sm font-semibold text-slate-900">{lastUpdated.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border-2 border-slate-200 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-8 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded"></div>
                </div>
                <div className="w-16 h-16 bg-slate-200 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prepareMetrics().map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity 
            activities={dashboardData?.recentActivities} 
            loading={loading} 
          />
        </div>
        <div>
          <QuickActions 
            quickActionData={dashboardData?.quickActionCounts} 
            loading={loading} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;