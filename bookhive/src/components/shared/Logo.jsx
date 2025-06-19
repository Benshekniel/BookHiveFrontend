import React from 'react';
import { BookOpen } from 'lucide-react';

const Logo = ({ size = 'md', variant = 'default' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const colorClasses = {
    default: 'text-blue',
    light: 'text-white',
  };

  return (
    <div className={`flex items-center font-bold ${sizeClasses[size]} ${colorClasses[variant]}`} style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
      <BookOpen className="mr-2 text-yellow" style={{ color: '#ffd639' }} />
      <span>Book<span style={{ color: '#ffd639' }}>Hive</span></span>
    </div>
  );
};

export default Logo;