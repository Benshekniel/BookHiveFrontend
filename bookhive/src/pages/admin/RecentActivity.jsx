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

export default RecentActivity;