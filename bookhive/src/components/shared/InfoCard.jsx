import React from 'react';
import { Heart, Bell, Trophy, Shield } from 'lucide-react';

const InfoCard = ({ title, icon: Icon, items }) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start justify-between bg-gray-50 p-3 rounded-md">
            <div>
              <p className="font-medium text-sm text-gray-800">{item.title}</p>
              <p className="text-xs text-gray-500">{item.subtitle}</p>
            </div>
            {item.status && (
              <span
                className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  item.status === 'Approved'
                    ? 'bg-green-100 text-green-700'
                    : item.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : item.status === 'Urgent'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {item.status}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoCard;
