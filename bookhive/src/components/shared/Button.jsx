import React from 'react';

const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  icon,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center';

  const variantStyles = {
    primary: {
      base: { backgroundColor: '#FFC107', color: '#FFFFFF' }, // bg-primary text-white
      hover: { backgroundColor: '#FFA000' }, // hover:bg-primary-dark
      focus: { outline: 'none', boxShadow: '0 0 0 2px rgba(255, 193, 7, 0.5)' }, // focus:ring-2 focus:ring-primary/50
    },
    secondary: {
      base: { backgroundColor: '#1E3A8A', color: '#FFFFFF' }, // bg-secondary text-white
      hover: { backgroundColor: '#152B70' }, // hover:bg-secondary-dark
      focus: { outline: 'none', boxShadow: '0 0 0 2px rgba(30, 58, 138, 0.5)' }, // focus:ring-2 focus:ring-secondary/50
    },
    outline: {
      base: { border: '2px solid #FFC107', color: '#FFC107', backgroundColor: 'transparent' }, // border-2 border-primary text-primary
      hover: { backgroundColor: '#FFC107', color: '#FFFFFF' }, // hover:bg-primary/10 (approximated as full bg for simplicity)
      focus: { outline: 'none', boxShadow: '0 0 0 2px rgba(255, 193, 7, 0.5)' }, // focus:ring-2 focus:ring-primary/50
    },
    ghost: {
      base: { color: '#1E3A8A', backgroundColor: 'transparent' }, // text-secondary
      hover: { backgroundColor: '#1E3A8A/10' }, // hover:bg-secondary/10 (approximated)
      focus: { outline: 'none', boxShadow: '0 0 0 2px rgba(30, 58, 138, 0.5)' }, // focus:ring-2 focus:ring-secondary/50
    },
  };

  const sizeStyles = {
    sm: { padding: '0.25rem 0.5rem', fontSize: '0.75rem' }, // text-xs py-1 px-2
    md: { padding: '0.5rem 1rem', fontSize: '0.875rem' }, // text-sm py-2 px-4
    lg: { padding: '0.75rem 1.5rem', fontSize: '1rem' }, // text-base py-3 px-6
  };

  const widthStyle = fullWidth ? { width: '100%' } : {};

  return (
    <button
      className={`${baseClasses} ${className}`}
      style={{
        ...variantStyles[variant].base,
        ...sizeStyles[size],
        ...widthStyle,
      }}
      onMouseOver={(e) => {
        Object.assign(e.target.style, variantStyles[variant].hover);
      }}
      onMouseOut={(e) => {
        Object.assign(e.target.style, variantStyles[variant].base);
      }}
      onFocus={(e) => {
        Object.assign(e.target.style, variantStyles[variant].focus);
      }}
      onBlur={(e) => {
        Object.assign(e.target.style, variantStyles[variant].base);
      }}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;