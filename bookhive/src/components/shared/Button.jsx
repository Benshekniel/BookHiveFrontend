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
  const baseStyle = {
    fontWeight: 'medium',
    borderRadius: '0.5rem',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const variantStyles = {
    primary: { backgroundColor: '#ffd639', color: '#FFFFFF' }, // Updated to yellow, blue
    secondary: { backgroundColor: '#407aff', color: '#FFFFFF' }, // Updated to blue
    outline: { border: '2px solid #ffd639', color: '#ffd639', backgroundColor: 'transparent' }, // Updated to yellow
    ghost: { color: '#407aff', backgroundColor: 'transparent' }, // Updated to blue
  };

  const sizeStyles = {
    sm: { padding: '0.25rem 0.5rem', fontSize: '0.75rem' },
    md: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    lg: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
  };

  const widthStyle = fullWidth ? { width: '100%' } : {};

  const style = {
    ...baseStyle,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...widthStyle,
  };

  return (
    <button
      className={className}
      style={style}
      {...props}
      onMouseOver={(e) => {
        if (variant === 'primary') e.target.style.backgroundColor = '#FFC107'; // Updated to yellow-dark
        if (variant === 'secondary') e.target.style.backgroundColor = '#1A3AFF'; // Updated to blue-dark
        if (variant === 'outline') (e.target.style.backgroundColor = '#ffd639', e.target.style.color = '#FFFFFF'); // Updated to yellow, white
        if (variant === 'ghost') e.target.style.backgroundColor = 'rgba(64, 122, 255, 0.1)'; // Updated to blue/10
      }}
      onMouseOut={(e) => {
        e.target.style.backgroundColor = variantStyles[variant].backgroundColor;
        if (variant === 'outline') e.target.style.color = '#ffd639'; // Updated to yellow
        if (variant === 'ghost') e.target.style.backgroundColor = 'transparent';
      }}
    >
      {icon && <span style={{ marginRight: '0.5rem' }}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;