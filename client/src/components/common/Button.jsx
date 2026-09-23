import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  const variantStyles = {
    primary: 'btn-gradient-primary font-bold shadow-lg shadow-purple-950/60 hover:shadow-purple-900/40',
    secondary: 'bg-[#130b26] hover:bg-[#1c1138] text-slate-200 hover:text-white border border-[#2b184f] hover:border-purple-500/50 shadow-sm',
    outline: 'bg-transparent hover:bg-purple-950/40 text-purple-300 hover:text-white border border-purple-500/40 hover:border-purple-400',
    ghost: 'bg-transparent hover:bg-purple-950/30 text-slate-400 hover:text-white',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0 text-white" />
          <span className="text-white">Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
};
