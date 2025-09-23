import React from 'react';

export const Spinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={`animate-spin rounded-full border-b-2 border-current ${sizeClasses[size]}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};