import React from 'react';

/**
 * StatsCard Component
 * Displays a single statistics card with icon, number, and label
 */
const StatsCard = ({ 
  icon: Icon, 
  label, 
  value, 
  trend = null,
  color = 'emerald' 
}) => {
  const colorMap = {
    emerald: { border: 'border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    blue: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-600' },
    green: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-600' },
    purple: { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-600' },
  };

  const colors = colorMap[color] || colorMap.emerald;

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${colors.border} hover:shadow-lg transition-shadow duration-200`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className={`text-3xl font-bold ${colors.text} mt-2`}>{value}</p>
          {trend && (
            <p className={`text-xs mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`text-3xl ${colors.bg} p-4 rounded-lg text-gray-700`}>
          <Icon size={32} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
