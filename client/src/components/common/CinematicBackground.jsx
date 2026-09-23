import React, { useEffect, useRef } from 'react';

export const CinematicBackground = ({ children, className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particles = [];
    const numParticles = 60;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        color: i % 3 === 0 ? '#22d3ee' : i % 3 === 1 ? '#d946ef' : '#8b5cf6'
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    let animId = null;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connecting constellation threads
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.16;
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles and mouse gravitational threads
      for (let p of particles) {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 160) {
          const alpha = (1 - dist / 160) * 0.22;
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className={`relative min-h-screen bg-[#0d1322] text-slate-100 overflow-hidden flex flex-col justify-between ${className}`}>
      {/* 60 FPS Cinematic Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />

      {/* Ambient Moving Aurora Blurs */}
      <div className="fixed -top-24 left-[15%] w-[480px] h-[480px] bg-purple-600/15 rounded-full blur-[110px] pointer-events-none animate-pulse duration-10000" />
      <div className="fixed -bottom-24 right-[10%] w-[520px] h-[520px] bg-fuchsia-600/12 rounded-full blur-[120px] pointer-events-none animate-pulse duration-7000" />
      <div className="fixed top-[40%] right-[30%] w-[380px] h-[380px] bg-cyan-500/12 rounded-full blur-[100px] pointer-events-none" />

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full flex-1 flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};
