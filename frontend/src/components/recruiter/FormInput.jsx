import React from 'react';
import { AlertCircle } from 'lucide-react';

const FormInput = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  error = '',
  disabled = false,
  maxLength = null,
  className = '',
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed transition-colors ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        } ${className}`}
      />
      {error && (
        <div className="flex items-center gap-2 mt-1 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
};

export default FormInput;
