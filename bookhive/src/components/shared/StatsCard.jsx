import React from 'react';

const StatsCard = ({ title, value, icon: Icon, change, changeType = 'positive' }) => {
  return (
    <div className="bg-cardBg rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-textPrimary mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${changeType === 'positive' ? 'text-success' : 'text-error'}`}>
              {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-xl">
          <Icon className="w-6 h-6 text-accent" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;