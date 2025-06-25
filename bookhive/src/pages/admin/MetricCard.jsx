import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

const MetricCard = ({ title, value, change, changeType, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    pink: 'bg-pink-50 text-pink-700 border-pink-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200'
  };

  const iconColorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    pink: 'bg-pink-100 text-pink-600',
    amber: 'bg-amber-100 text-amber-600'
  };

  return (
    <div className={`bg-white rounded-xl p-6 border-2 ${colorClasses[color]} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className={`text-sm mt-2 font-medium ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
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