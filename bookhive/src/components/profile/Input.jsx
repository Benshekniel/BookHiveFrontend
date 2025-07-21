import React from "react";

const Input = ({
  label,
  icon: Icon,
  type = "text",
  name,
  value,
  onChange,
  disabled = false,
  placeholder = "",
  required = false,
  className = ""
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`w-full ${Icon ? 'pl-10' : 'px-4'} py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] disabled:bg-gray-50 ${className}`}
        />
      </div>
    </div>
  );
};

export default Input; 