import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

const MetricCard = ({ title, value, change, changeType, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-500',
    yellow: 'bg-yellow-50 text-yellow-400',
    green: 'bg-green-50 text-green-500',
    purple: 'bg-blue-50 text-blue-500',
    pink: 'bg-red-50 text-red-500',
    amber: 'bg-yellow-400 text-white'
  };

  const iconColorClasses = {
    blue: 'bg-blue-100 text-blue-500',
    yellow: 'bg-yellow-100 text-yellow-400',
    green: 'bg-green-100 text-green-500',
    purple: 'bg-blue-100 text-blue-500',
    pink: 'bg-red-100 text-red-500',
    amber: 'bg-yellow-400 text-white'
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

export default MetricCard;