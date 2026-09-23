import React, { useRef, useState, useCallback } from 'react';

export const Card3D = ({
  children,
  className = '',
  maxTilt = 8,
  scale = 1.015,
  glare = true,
  onClick,
  style = {},
  ...props
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;
    cardRef.current.style.setProperty('--mouse-x', `${((x / rect.width) * 100).toFixed(1)}%`);
    cardRef.current.style.setProperty('--mouse-y', `${((y / rect.height) * 100).toFixed(1)}%`);
  }, [maxTilt, scale]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
        transition: isHovered
          ? 'transform 0.1s ease-out, box-shadow 0.25s ease'
          : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease',
        ...style
      }}
      className={`relative overflow-hidden transition-all select-none ${className}`}
      {...props}
    >
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 z-50 rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle 240px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.09), transparent 80%)`
          }}
        />
      )}
      <div style={{ transformStyle: 'preserve-3d' }} className="w-full h-full">
        {children}
      </div>
    </div>
  );
};
