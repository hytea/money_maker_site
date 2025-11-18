import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  symbol: string;
  size: number;
  opacity: number;
  color: string;
}

const MATH_SYMBOLS = ['+', '−', '×', '÷', '=', '√', 'π', '∑', '∫', '%', '∞', '≈', '≠', '≤', '≥'];
const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'];

export default function ParticleAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      const particles: Particle[] = [];
      const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 15000), 80);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          symbol: MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)],
          size: Math.random() * 20 + 15,
          opacity: Math.random() * 0.3 + 0.2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)]
        });
      }
      particlesRef.current = particles;
    };
    initParticles();

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Calculate distance from mouse
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        // Mouse interaction - repel particles
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          particle.vx -= (dx / distance) * force * 0.3;
          particle.vy -= (dy / distance) * force * 0.3;
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Apply friction
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Add slight random movement
        particle.vx += (Math.random() - 0.5) * 0.05;
        particle.vy += (Math.random() - 0.5) * 0.05;

        // Limit velocity
        const maxVelocity = 2;
        const velocity = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (velocity > maxVelocity) {
          particle.vx = (particle.vx / velocity) * maxVelocity;
          particle.vy = (particle.vy / velocity) * maxVelocity;
        }

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.8;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -0.8;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.font = `${particle.size}px Arial`;
        ctx.fillStyle = particle.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Add subtle rotation based on velocity
        const rotation = Math.atan2(particle.vy, particle.vx);
        ctx.translate(particle.x, particle.y);
        ctx.rotate(rotation);
        ctx.fillText(particle.symbol, 0, 0);
        ctx.restore();

        // Draw connections between nearby particles
        particlesRef.current.forEach((otherParticle) => {
          if (particle === otherParticle) return;

          const dx = otherParticle.x - particle.x;
          const dy = otherParticle.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.save();
            ctx.globalAlpha = (1 - distance / 120) * 0.15;
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Add visibility toggle for performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
