import React from 'react';
import { UserPlus, BookOpen, Calendar, AlertTriangle, Users, BarChart } from 'lucide-react';

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
      case 'blue': return 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700 hover:shadow-lg';
      case 'yellow': return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100 text-yellow-700 hover:shadow-lg';
      case 'red': return 'bg-red-50 border-red-200 hover:bg-red-100 text-red-700 hover:shadow-lg';
      default: return 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700 hover:shadow-lg';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
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
                <Icon className="w-6 h-6" />
                <div>
                  <p className="font-semibold text-sm">{action.title}</p>
                  <p className="text-xs opacity-75">{action.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;