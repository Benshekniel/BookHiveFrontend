import React from 'react';
import { Clock, User, BookOpen, AlertCircle } from 'lucide-react';

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
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'yellow': return 'bg-yellow-100 text-yellow-600';
      case 'red': return 'bg-red-100 text-red-600';
      case 'amber': return 'bg-amber-100 text-amber-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Clock className="w-6 h-6 text-blue-600" />
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-100">
              <div className={`p-3 rounded-full ${getColorClasses(activity.color)} shadow-sm`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;