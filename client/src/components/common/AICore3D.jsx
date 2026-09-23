import React, { useRef, useEffect } from 'react';

export const AICore3D = ({
  size = 200,
  className = '',
  readiness = 78,
  interactive = true
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const width = size;
    const height = size;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Generate 3D Spherical Points
    const numPoints = 110;
    const points = [];
    const radius = size * 0.36;

    for (let i = 0; i < numPoints; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = 2 * Math.PI * Math.random();
      points.push({
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(theta),
      });
    }

    let rotX = 0;
    let rotY = 0;
    let targetRotX = 0.004;
    let targetRotY = 0.007;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let animId = null;

    const handleMouseDown = (e) => {
      if (!interactive) return;
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left - width / 2;
      const cy = e.clientY - rect.top - height / 2;

      if (isDragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        rotY += dx * 0.008;
        rotX += dy * 0.008;
        lastX = e.clientX;
        lastY = e.clientY;
      } else {
        targetRotY = (cx / width) * 0.018;
        targetRotX = -(cy / height) * 0.018;
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleTouchStart = (e) => {
      if (!interactive || e.touches.length === 0) return;
      isDragging = true;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (!interactive || !isDragging || e.touches.length === 0) return;
      const dx = e.touches[0].clientX - lastX;
      const dy = e.touches[0].clientY - lastY;
      rotY += dx * 0.01;
      rotX += dy * 0.01;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    if (interactive) {
      canvas.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleTouchEnd);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      rotX += targetRotX;
      rotY += targetRotY;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      // Project 3D points to 2D
      const projected = [];
      const fov = 220;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        // Rotate Y
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        // Rotate X
        const y1 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        const scale = fov / (fov + z2 + 100);
        const px = x1 * scale + width / 2;
        const py = y1 * scale + height / 2;

        projected.push({ x: px, y: py, z: z2, scale });
      }

      // Draw neural connections
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 28) {
            const alpha = (1 - dist / 28) * 0.35 * projected[i].scale;
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw 3D nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const nodeSize = Math.max(1, p.scale * 2.2);
        const alpha = Math.min(1, Math.max(0.15, (p.z + radius) / (2 * radius)));

        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeSize, 0, Math.PI * 2);

        if (p.z > 15) {
          ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`; // Cyan front
        } else if (p.z > -15) {
          ctx.fillStyle = `rgba(217, 70, 239, ${alpha})`; // Fuchsia mid
        } else {
          ctx.fillStyle = `rgba(139, 92, 246, ${alpha * 0.5})`; // Purple back
        }
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (interactive) {
        canvas.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [size, interactive, readiness]);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="cursor-grab active:cursor-grabbing select-none"
      />
    </div>
  );
};
