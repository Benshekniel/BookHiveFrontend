import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  return (
    <div className={`fixed top-18 right-6 p-4 rounded-lg shadow-lg z-1000 ${bgColor}`}>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default Toast; 