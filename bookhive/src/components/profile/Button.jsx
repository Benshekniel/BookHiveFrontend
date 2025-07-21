import React from "react";

const Button = ({ 
  children, 
  variant = "primary", 
  onClick, 
  type = "button",
  className = "",
  disabled = false
}) => {
  const baseStyles = "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm";
  
  const variants = {
    primary: "bg-[#1e3a8a] hover:bg-blue-800 text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    yellow: "bg-yellow-500 hover:bg-yellow-600 text-white"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button; 