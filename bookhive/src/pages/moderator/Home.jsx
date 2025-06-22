import React from 'react';
import StatsCard from '../../components/shared/StatsCard';
import { 
  Users, 
  BookOpen, 
  Heart, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Flag
} from 'lucide-react';

const Home = () => {
  const stats = [
    {
      title: 'Pending Registrations',
      value: '24',
      icon: Users,
      change: '+12% from yesterday',
      changeType: 'positive'
    },
    {
      title: 'Active Book Circles',
      value: '156',
      icon: BookOpen,
      change: '+5 new this week',
      changeType: 'positive'
    },
    {
      title: 'Charity Events',
      value: '8',
      icon: Heart,
      change: '3 ending soon',
      changeType: 'neutral'
    },
    {
      title: 'Reported Content',
      value: '7',
      icon: Flag,
      change: 'Needs attention',
      changeType: 'negative'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'registration',
      message: 'New user registration: Sarah Chen',
      time: '2 minutes ago',
      priority: 'high'
    },
    {
      id: 2,
      type: 'report',
      message: 'Content reported in "Modern Fiction" circle',
      time: '15 minutes ago',
      priority: 'high'
    },
    {
      id: 3,
      type: 'charity',
      message: 'New charity donation request from City Library',
      time: '1 hour ago',
      priority: 'medium'
    },
    {
      id: 4,
      type: 'competition',
      message: 'Poetry competition voting deadline approaching',
      time: '2 hours ago',
      priority: 'medium'
    },
    {
      id: 5,
      type: 'support',
      message: 'Support ticket #1247 requires escalation',
      time: '3 hours ago',
      priority: 'low'
    }
  ];

  const quickActions = [
    { title: 'Review Registrations', description: '24 pending approvals', action: 'users', color: 'bg-blue-500' },
    { title: 'Handle Reports', description: '7 content reports', action: 'compliance', color: 'bg-red-500' },
    { title: 'Charity Requests', description: '3 awaiting review', action: 'charity', color: 'bg-green-500' },
    { title: 'Support Tickets', description: '12 open tickets', action: 'support', color: 'bg-yellow-500' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-error';
      case 'medium': return 'border-l-secondary';
      case 'low': return 'border-l-success';
      default: return 'border-l-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-cardBg rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-textPrimary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <div key={index} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <div className={`w-3 h-3 rounded-full ${action.color} mb-3`}></div>
              <h3 className="font-semibold text-textPrimary">{action.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{action.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-cardBg rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-textPrimary">Recent Activities</h2>
          <button className="text-accent hover:text-primary text-sm font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div 
              key={activity.id}
              className={`p-4 rounded-lg border-l-4 ${getPriorityColor(activity.priority)} bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-textPrimary font-medium">{activity.message}</p>
                  <p className="text-gray-500 text-sm mt-1">{activity.time}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.priority === 'high' ? 'bg-red-100 text-red-700' :
                    activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {activity.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-cardBg rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-textPrimary mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Platform Uptime</span>
              <span className="flex items-center text-success">
                <CheckCircle className="w-4 h-4 mr-1" />
                99.9%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Users</span>
              <span className="text-textPrimary font-medium">2,847</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Books in Circulation</span>
              <span className="text-textPrimary font-medium">15,623</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Avg Response Time</span>
              <span className="text-textPrimary font-medium">1.2s</span>
            </div>
          </div>
        </div>

        <div className="bg-cardBg rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-textPrimary mb-4">Moderation Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Actions Today</span>
              <span className="text-textPrimary font-medium">47</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Users Approved</span>
              <span className="text-success font-medium">23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Content Moderated</span>
              <span className="text-textPrimary font-medium">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Disputes Resolved</span>
              <span className="text-success font-medium">8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;