import React from 'react';
import { Plus, Briefcase, Mail, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * QuickActions Component
 * Provides quick navigation buttons for common recruiter tasks
 */
const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Plus,
      label: 'Post New Job',
      color: 'emerald',
      action: () => navigate('/post-job'),
    },
    {
      icon: Briefcase,
      label: 'Manage Jobs',
      color: 'blue',
      action: () => navigate('/my-jobs'),
    },
    {
      icon: Mail,
      label: 'Messages',
      color: 'purple',
      action: () => navigate('/messages'),
    },
    {
      icon: Settings,
      label: 'Company Profile',
      color: 'orange',
      action: () => navigate('/profile'),
    },
  ];

  const colorClasses = {
    emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            onClick={action.action}
            className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-200 ${colorClasses[action.color]} border border-current border-opacity-20 hover:shadow-md`}
          >
            <Icon size={24} />
            <span className="font-semibold text-left">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default QuickActions;
