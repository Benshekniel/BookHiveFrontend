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
    border: variant === 'outline' ? '2px solid #ffd639' : 'none',
  };

  const variantStyles = {
    primary: { backgroundColor: '#ffd639', color: '#FFFFFF' },
    secondary: { backgroundColor: '#407aff', color: '#FFFFFF' },
    outline: { color: '#ffd639', backgroundColor: 'transparent' },
    ghost: { color: '#407aff', backgroundColor: 'transparent' },
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
        if (variant === 'primary') e.target.style.backgroundColor = '#FFC107';
        if (variant === 'secondary') e.target.style.backgroundColor = '#1A3AFF';
        if (variant === 'outline') {
          e.target.style.backgroundColor = '#ffd639';
          e.target.style.color = '#FFFFFF';
          e.target.style.borderColor = '#ffd639';
        }
        if (variant === 'ghost') e.target.style.backgroundColor = 'rgba(64, 122, 255, 0.1)';
      }}
      onMouseOut={(e) => {
        e.target.style.backgroundColor = variantStyles[variant].backgroundColor;
        if (variant === 'outline') {
          e.target.style.color = '#ffd639';
          e.target.style.backgroundColor = 'transparent';
          e.target.style.borderColor = '#ffd639';
        }
        if (variant === 'ghost') e.target.style.backgroundColor = 'transparent';
      }}
      onFocus={(e) => {
        if (variant === 'outline') e.target.style.boxShadow = '0 0 0 2px rgba(255, 214, 57, 0.5)';
      }}
      onBlur={(e) => {
        if (variant === 'outline') e.target.style.boxShadow = 'none';
      }}
    >
      {icon && <span style={{ marginRight: '0.5rem' }}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;