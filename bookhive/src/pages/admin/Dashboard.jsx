import React from 'react';
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
  BarChart
} from 'lucide-react';

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
const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'user',
      message: 'New user registration: Kasun Perera',
      time: '5 minutes ago',
      icon: User,
      color: 'blue'
    },
    {
      id: 2,
      type: 'book',
      message: 'Book listing approved: "The Alchemist" by Paulo Coelho',
      time: '15 minutes ago',
      icon: BookOpen,
      color: 'yellow'
    },
    {
      id: 3,
      type: 'alert',
      message: 'Dispute reported: Book return issue',
      time: '1 hour ago',
      icon: AlertCircle,
      color: 'red'
    },
    {
      id: 4,
      type: 'user',
      message: 'User suspended: Suspicious activity detected',
      time: '2 hours ago',
      icon: User,
      color: 'amber'
    },
    {
      id: 5,
      type: 'book',
      message: 'Book listing rejected: Inappropriate content',
      time: '3 hours ago',
      icon: BookOpen,
      color: 'red'
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-500';
      case 'yellow':
        return 'bg-yellow-50 text-yellow-400';
      case 'red':
        return 'bg-red-50 text-red-500';
      case 'amber':
        return 'bg-yellow-400 text-white';
      default:
        return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Clock className="w-6 h-6 text-blue-500" />
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-slate-200">
              <div className={`p-3 rounded-full ${getColorClasses(activity.color)} shadow-sm`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// QuickActions Component
const QuickActions = () => {
  const actions = [
    {
      title: 'Approve Users',
      description: '23 pending approvals',
      icon: UserPlus,
      color: 'blue',
      action: () => console.log('Navigate to user approvals')
    },
    {
      title: 'Review Content',
      description: '8 reported items',
      icon: BookOpen,
      color: 'yellow',
      action: () => console.log('Navigate to content moderation')
    },
    {
      title: 'Create Event',
      description: 'Add new event',
      icon: Calendar,
      color: 'blue',
      action: () => console.log('Navigate to event creation')
    },
    {
      title: 'Resolve Disputes',
      description: '3 active disputes',
      icon: AlertTriangle,
      color: 'red',
      action: () => console.log('Navigate to dispute resolution')
    },
    {
      title: 'Manage Moderators',
      description: '12 active moderators',
      icon: Users,
      color: 'yellow',
      action: () => console.log('Navigate to moderator management')
    },
    {
      title: 'View Reports',
      description: 'Monthly analytics',
      icon: BarChart,
      color: 'blue',
      action: () => console.log('Navigate to analytics')
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 border-blue-500 hover:bg-blue-100 text-blue-500 hover:shadow-lg';
      case 'yellow':
        return 'bg-yellow-50 border-yellow-400 hover:bg-yellow-400 text-yellow-400 hover:shadow-lg';
      case 'red':
        return 'bg-red-50 border-red-500 hover:bg-red-100 text-red-500 hover:shadow-lg';
      default:
        return 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 hover:shadow-lg';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.action}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 transform hover:scale-105 ${getColorClasses(action.color)}`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-6 h-6 ${getColorClasses(action.color).split(' ').find(c => c.startsWith('text-'))}`} />
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

// Main Dashboard Component
const Dashboard = () => {
  const metrics = [
    {
      title: 'Total Users',
      value: '12,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Listings',
      value: '3,421',
      change: '+8.2%',
      changeType: 'positive',
      icon: BookOpen,
      color: 'white'
    },
    {
      title: 'Pending Approvals',
      value: '23',
      change: '-15.3%',
      changeType: 'positive',
      icon: AlertTriangle,
      color: 'purple'
    },
    {
      title: 'Monthly Revenue',
      value: 'LKR 245K',
      change: '+24.1%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Active Events',
      value: '7',
      change: '+2',
      changeType: 'positive',
      icon: Calendar,
      color: 'white'
    },
    {
      title: 'Avg Trust Score',
      value: '4.8',
      change: '+0.2',
      changeType: 'positive',
      icon: Star,
      color: 'pink'
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