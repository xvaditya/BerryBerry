import { useEffect, useRef, useCallback, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
}

function isMobile(): boolean {
  return window.innerWidth < 768 || 'ontouchstart' in window;
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [visible, setVisible] = useState(true);

  const createParticle = useCallback((width: number, height: number): Particle => {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 2.5 + 0.8,
      opacity: Math.random() * 0.3 + 0.1,
      hue: Math.random() * 30 + 340,
      life: 0,
      maxLife: Math.random() * 400 + 200,
    };
  }, []);

  useEffect(() => {
    // Hide particles on mobile completely
    if (isMobile()) {
      setVisible(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Use devicePixelRatio for crisp rendering but cap at 1 for performance
    const dpr = 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Mouse tracking (desktop only)
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Fewer particles for performance
    const count = Math.min(35, Math.floor(window.innerWidth / 50));
    particlesRef.current = Array.from({ length: count }, () =>
      createParticle(window.innerWidth, window.innerHeight)
    );

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.life++;
        if (p.life > p.maxLife) {
          Object.assign(p, createParticle(window.innerWidth, window.innerHeight));
          p.life = 0;
        }

        // Mouse repulsion (skip if mouse hasn't moved)
        if (mx > 0) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const distSq = dx * dx + dy * dy;
          if (distSq < 22500 && distSq > 0) { // 150^2
            const dist = Math.sqrt(distSq);
            const force = (150 - dist) / 150;
            p.vx += (dx / dist) * force * 0.1;
            p.vy += (dy / dist) * force * 0.1;
          }
        }

        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;

        // Opacity lifecycle
        const lifeProgress = p.life / p.maxLife;
        const fadeOpacity = lifeProgress < 0.1
          ? lifeProgress / 0.1
          : lifeProgress > 0.9
          ? (1 - lifeProgress) / 0.1
          : 1;

        const alpha = p.opacity * fadeOpacity;

        // Single draw call per particle (no glow — saves 50% GPU)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${alpha})`;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, [createParticle]);

  if (!visible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: 0.5 }}
    />
  );
}
