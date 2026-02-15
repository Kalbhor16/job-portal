import React from 'react';

const ActionButton = ({
  label,
  icon: Icon,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  className = '',
}) => {
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-secondary-200 hover:bg-secondary-300 text-secondary-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-primary-500 hover:bg-primary-600 text-white',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-lg
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading && (
        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
      )}
      {Icon && !loading && <Icon className="w-5 h-5" />}
      <span>{label}</span>
    </button>
  );
};

export default ActionButton;
