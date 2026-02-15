import React from 'react';

const SectionHeader = ({ icon: Icon, title, description, action = null }) => {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex-shrink-0 pt-1">
            <Icon className="w-6 h-6 text-primary-600" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-secondary-900">{title}</h2>
          {description && (
            <p className="text-sm text-secondary-600 mt-1">{description}</p>
          )}
        </div>
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
