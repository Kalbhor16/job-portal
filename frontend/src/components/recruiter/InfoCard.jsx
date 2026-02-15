import React from 'react';

const InfoCard = ({ label, value, icon: Icon, clickable = false, onClick = null }) => {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors ${
        clickable ? 'cursor-pointer' : ''
      }`}
      onClick={clickable ? onClick : undefined}
    >
      {Icon && (
        <div className="flex-shrink-0 pt-1">
          <Icon className="w-5 h-5 text-primary-600" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-secondary-600 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-secondary-900 mt-1 break-words">{value}</p>
      </div>
    </div>
  );
};

export default InfoCard;
