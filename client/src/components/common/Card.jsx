import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  glass = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border transition-all duration-200 ${
        glass
          ? 'bg-[#12192c]/80 backdrop-blur-xl border-white/10 shadow-xl'
          : 'bg-[#141b30]/90 border-white/[0.08] shadow-lg'
      } ${
        hover
          ? 'hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-950/20 hover:-translate-y-0.5 cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-5 pb-3 border-b border-white/[0.08] flex items-center justify-between ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-5 pt-3 border-t border-white/[0.08] flex items-center justify-between ${className}`}>
    {children}
  </div>
);
