import React from 'react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 lg:p-12 text-center rounded-2xl border border-dashed border-[#e2e8e5] bg-white ${className}`}>
      {Icon && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4 shadow-sm">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h4 className="text-base font-bold text-slate-900 mb-1">{title}</h4>
      <p className="text-xs lg:text-sm text-slate-500 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
