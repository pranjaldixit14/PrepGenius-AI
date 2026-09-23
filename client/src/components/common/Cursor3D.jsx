import React, { useEffect, useRef, useState } from 'react';

export const Cursor3D = () => {
  const [enabled, setEnabled] = useState(false);
  const [hoverLabel, setHoverLabel] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const spotlightRef = useRef(null);

  // Position references for smooth interpolation (lerp)
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef(null);

  useEffect(() => {
    // Only enable on desktop/laptop devices with a fine pointer (mouse/trackpad)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    setEnabled(true);

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check if hovering over interactive or 3D elements
      const target = e.target;
      const interactiveEl = target.closest(
        'button, a, [data-tilt], [data-cursor-label], [role="button"], input, select, canvas'
      );

      if (interactiveEl) {
        setIsHovered(true);
        const label =
          interactiveEl.getAttribute('data-cursor-label') ||
          (interactiveEl.closest('[data-tilt]') ? '✦ 3D TILT' : '') ||
          (interactiveEl.tagName === 'A' ? '➔ OPEN' : '') ||
          (interactiveEl.tagName === 'BUTTON' ? '⚡ ACTION' : '') ||
          '';
        setHoverLabel(label);
      } else {
        setIsHovered(false);
        setHoverLabel('');
      }
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // 60 FPS animation loop with spring lag
    const render = () => {
      const lerpFactor = 0.22;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerpFactor;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerpFactor;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isVisible]);

  if (!enabled) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* 3D Ambient Spotlight following cursor to illuminate surfaces */}
      <div
        ref={spotlightRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full blur-3xl pointer-events-none transition-transform duration-75 ease-out"
        style={{
          background: isHovered
            ? 'radial-gradient(circle, rgba(168, 85, 247, 0.14) 0%, rgba(6, 182, 212, 0.08) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 65%)',
          willChange: 'transform'
        }}
      />

      {/* Outer 3D Visualization Ring / Morphing Target Lens */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none will-change-transform"
      >
        <div
          className={`rounded-full border transition-all duration-200 ease-out flex items-center justify-center ${
            isHovered
              ? isPressed
                ? 'w-10 h-10 border-cyan-400 bg-cyan-500/15 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-90'
                : 'w-12 h-12 border-fuchsia-400/80 bg-purple-600/10 shadow-[0_0_25px_rgba(217,70,239,0.35)] scale-110'
              : isPressed
              ? 'w-6 h-6 border-purple-400 bg-purple-500/20 scale-75'
              : 'w-8 h-8 border-purple-500/40 bg-transparent scale-100'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            perspective: '400px'
          }}
        >
          {/* Subtle 3D crosshair reticle when hovered */}
          {isHovered && (
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          )}
        </div>

        {/* Micro-label for 3D visualization feedback */}
        {isHovered && hoverLabel && (
          <span className="mt-1.5 px-2 py-0.5 rounded-full bg-[#0a0515]/90 border border-purple-500/50 text-[9px] font-mono font-bold tracking-wider text-cyan-300 shadow-lg whitespace-nowrap animate-in fade-in zoom-in duration-150">
            {hoverLabel}
          </span>
        )}
      </div>

      {/* Inner Precision Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none will-change-transform"
      >
        <div
          className={`rounded-full transition-transform duration-100 ${
            isHovered
              ? 'w-1.5 h-1.5 bg-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.9)] scale-125'
              : 'w-1.5 h-1.5 bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.8)] scale-100'
          }`}
        />
      </div>
    </div>
  );
};
