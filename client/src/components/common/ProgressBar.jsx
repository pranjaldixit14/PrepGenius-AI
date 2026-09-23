import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  showPercentage = true,
  color = 'emerald',
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorGradients = {
    cyan: 'from-emerald-600 to-teal-500',
    emerald: 'from-emerald-600 to-teal-500',
    amber: 'from-amber-500 to-orange-400',
    blue: 'from-blue-600 to-indigo-500',
    rose: 'from-rose-500 to-pink-500',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs text-slate-700 mb-1.5">
          {label && <span className="font-semibold">{label}</span>}
          {showPercentage && <span className="font-bold text-slate-900">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-[#e2e8e5] ${sizeStyles[size] || sizeStyles.md}`}>
        <div
          className={`h-full bg-gradient-to-r ${colorGradients[color] || colorGradients.emerald} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
