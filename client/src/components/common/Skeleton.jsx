import React from 'react';

export const Skeleton = ({ className = '', variant = 'text' }) => {
  const variantStyles = {
    text: 'h-4 rounded-md',
    circle: 'rounded-full',
    card: 'h-36 rounded-2xl',
  };

  return (
    <div
      className={`animate-pulse bg-slate-200/80 ${variantStyles[variant] || ''} ${className}`}
    />
  );
};
