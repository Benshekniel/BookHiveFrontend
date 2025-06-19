import React from 'react';
import { BookOpen } from 'lucide-react';

const Logo = ({ 
  size = 'md', 
  variant = 'default' 
}) => {
  const sizeStyles = {
    sm: { fontSize: '1.125rem' }, // text-lg
    md: { fontSize: '1.5rem' }, // text-2xl
    lg: { fontSize: '2.25rem' }, // text-4xl
  };

  const colorStyles = {
    default: { color: '#1E3A8A' }, // text-secondary
    light: { color: '#FFFFFF' }, // text-white
  };

  return (
    <div className="flex items-center font-bold" style={{ ...sizeStyles[size], ...colorStyles[variant], fontFamily: "'Poppins', system-ui, sans-serif" }}>
      <BookOpen className="mr-2" style={{ color: '#FFC107' }} /> {/* text-primary */}
      <span>Book<span style={{ color: '#FFC107' }}>Hive</span></span>
    </div>
  );
};

export default Logo;