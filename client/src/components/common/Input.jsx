import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-200 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative rounded-xl">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full bg-[#10172a]/90 border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
            Icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-rose-500/80 focus:border-rose-400 focus:ring-rose-500/20'
              : 'border-white/15 hover:border-purple-500/50 focus:border-purple-500 focus:ring-purple-500/20'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-400 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-xs text-slate-400">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';
