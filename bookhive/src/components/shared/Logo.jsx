import React from 'react';
import { BookOpen } from 'lucide-react';

const Logo = ({ size = 'md', variant = 'default' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const colorClasses = {
    default: 'text-blue-900',
    light: 'text-white',
  };

  return (
    <div className={`flex items-center font-bold ${sizeClasses[size]} ${colorClasses[variant]}`} style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
      <img src="/logo-blue.png" alt="BookHive Logo" className="mr-2" style={{ width: '1.5em', height: '1.5em' }} />
      <span>Book<span style={{ color: '#ffd639' }}>Hive</span></span>
    </div>
  );
};

export default Logo;