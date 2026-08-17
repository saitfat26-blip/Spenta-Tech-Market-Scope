import React, { useEffect, useRef } from 'react';

interface MarketPulseCanvasProps {
  className?: string;
  intensity?: number;
}

export const MarketPulseCanvas: React.FC<MarketPulseCanvasProps> = ({ 
  className = "w-full h-full",
  intensity = 1.0 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 400;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Particle nodes for market telemetry
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * (canvas.width || 800),
      y: Math.random() * (canvas.height || 400),
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.7 + 0.3,
      pulseSpeed: Math.random() * 0.04 + 0.02
    }));

    const render = () => {
      time += 0.025 * intensity;
      const width = canvas.width;
      const height = canvas.height;

      // Dark background clear with subtle trail
      ctx.fillStyle = 'rgba(5, 7, 11, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Grid lines
      ctx.strokeStyle = 'rgba(14, 116, 144, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw Multi-Layered Glowing Sine/Market Waves (Market Pulse)
      const waveConfigs = [
        { freq: 0.008, speed: 1.5, amp: 45, yOffset: height * 0.5, color: 'rgba(56, 189, 248, 0.65)', glow: 'rgba(56, 189, 248, 0.2)' },
        { freq: 0.012, speed: -1.2, amp: 35, yOffset: height * 0.48, color: 'rgba(129, 140, 248, 0.55)', glow: 'rgba(129, 140, 248, 0.15)' },
        { freq: 0.005, speed: 2.0, amp: 55, yOffset: height * 0.52, color: 'rgba(52, 211, 153, 0.45)', glow: 'rgba(52, 211, 153, 0.12)' }
      ];

      waveConfigs.forEach((cfg) => {
        // Gradient Fill under the wave
        const grad = ctx.createLinearGradient(0, cfg.yOffset - cfg.amp, 0, height);
        grad.addColorStop(0, cfg.glow);
        grad.addColorStop(1, 'rgba(5, 7, 11, 0)');

        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 6) {
          // Complex waveform composed of fundamental + harmonics + market spike pulses
          const spike = Math.sin(x * 0.03 + time * 3) > 0.85 ? Math.sin(x * 0.08 + time * 4) * 20 : 0;
          const y = cfg.yOffset + Math.sin(x * cfg.freq + time * cfg.speed) * cfg.amp + Math.cos(x * cfg.freq * 2 + time) * 15 + spike;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Wave line
        ctx.beginPath();
        for (let x = 0; x <= width; x += 6) {
          const spike = Math.sin(x * 0.03 + time * 3) > 0.85 ? Math.sin(x * 0.08 + time * 4) * 20 : 0;
          const y = cfg.yOffset + Math.sin(x * cfg.freq + time * cfg.speed) * cfg.amp + Math.cos(x * cfg.freq * 2 + time) * 15 + spike;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = cfg.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = cfg.color;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // 3. Draw Telemetry Pulses & Radar Scanline
      const scanX = (time * 120) % width;
      const scanGrad = ctx.createLinearGradient(scanX - 60, 0, scanX, 0);
      scanGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      scanGrad.addColorStop(1, 'rgba(6, 182, 212, 0.35)');

      ctx.fillStyle = scanGrad;
      ctx.fillRect(scanX - 60, 0, 60, height);

      // Scanline laser
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(scanX, 0);
      ctx.lineTo(scanX, height);
      ctx.stroke();

      // 4. Update & Draw Particles / Nodes
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(time * 2 + idx));

        ctx.fillStyle = `rgba(56, 189, 248, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles with subtle lines
        particles.slice(idx + 1, idx + 4).forEach((other) => {
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.strokeStyle = `rgba(14, 165, 233, ${(1 - dist / 80) * 0.25})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      // 5. Draw Digital HUD Ticks on Top and Bottom
      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.font = '9px monospace';
      ctx.fillText(`MARKET_PULSE_HZ: ${(30 + Math.sin(time) * 5).toFixed(2)}`, 16, 24);
      ctx.fillText(`TELEMETRY: HW_INFLUX // SPATIAL_AI_RUN`, 16, 38);
      ctx.fillText(`VEO_ABSTRACT_SPECTRAL: ACTIVE`, width - 180, 24);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`block pointer-events-none ${className}`}
    />
  );
};
