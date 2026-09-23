import React from 'react';

export const Badge = ({
  children,
  variant = 'cyan',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  const variantStyles = {
    cyan: 'bg-[#08202d] text-cyan-300 border border-cyan-500/40',
    emerald: 'bg-[#08221c] text-emerald-300 border border-emerald-500/40',
    blue: 'bg-[#101b38] text-blue-300 border border-blue-500/40',
    amber: 'bg-[#291707] text-amber-300 border border-amber-500/40',
    rose: 'bg-[#2b0c16] text-rose-300 border border-rose-500/40',
    magenta: 'bg-[#230f36] text-fuchsia-300 border border-fuchsia-500/40',
    purple: 'bg-[#190e30] text-purple-300 border border-purple-500/40',
    slate: 'bg-[#140c26] text-slate-300 border border-[#2b184d]',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-lg ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.cyan
      } ${className}`}
    >
      {children}
    </span>
  );
};
