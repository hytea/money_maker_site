import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  symbol: string;
  size: number;
  opacity: number;
  baseColor: string;
  colorIntensity: number; // 0 = grayscale, 1 = full color
}

const MATH_SYMBOLS = ['+', '−', '×', '÷', '=', '√', 'π', '∑', '∫', '%', '∞', '≈', '≠', '≤', '≥'];
const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'];

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

// Helper function to blend color with grayscale
function blendToGrayscale(hex: string, intensity: number): string {
  const rgb = hexToRgb(hex);
  const gray = Math.round(rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114);

  const r = Math.round(gray + (rgb.r - gray) * intensity);
  const g = Math.round(gray + (rgb.g - gray) * intensity);
  const b = Math.round(gray + (rgb.b - gray) * intensity);

  return `rgb(${r}, ${g}, ${b})`;
}

export default function ParticleAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 }); // Start off-screen
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
          vx: 0, // Start stationary
          vy: 0, // Start stationary
          symbol: MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)],
          size: Math.random() * 20 + 15,
          opacity: Math.random() * 0.12 + 0.08, // Reduced opacity (was 0.3 + 0.2)
          baseColor: COLORS[Math.floor(Math.random() * COLORS.length)],
          colorIntensity: 0 // Start grayscale
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
        const maxDistance = 200;

        // Update color intensity based on mouse proximity
        const targetIntensity = distance < maxDistance ? 1 - (distance / maxDistance) : 0;
        particle.colorIntensity += (targetIntensity - particle.colorIntensity) * 0.1; // Smooth transition

        // Mouse interaction - only apply force when mouse is nearby
        if (distance < maxDistance && distance > 0) {
          const force = (maxDistance - distance) / maxDistance;
          particle.vx -= (dx / distance) * force * 0.2;
          particle.vy -= (dy / distance) * force * 0.2;
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Apply strong friction to reduce jitter
        particle.vx *= 0.92;
        particle.vy *= 0.92;

        // Stop almost-zero velocities completely
        if (Math.abs(particle.vx) < 0.01) particle.vx = 0;
        if (Math.abs(particle.vy) < 0.01) particle.vy = 0;

        // Limit velocity
        const maxVelocity = 1.5;
        const velocity = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (velocity > maxVelocity) {
          particle.vx = (particle.vx / velocity) * maxVelocity;
          particle.vy = (particle.vy / velocity) * maxVelocity;
        }

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.5;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -0.5;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Get current color based on intensity
        const currentColor = blendToGrayscale(particle.baseColor, particle.colorIntensity);

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.font = `${particle.size}px Arial`;
        ctx.fillStyle = currentColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Minimal rotation based on velocity (less jittery)
        const rotation = particle.vx !== 0 || particle.vy !== 0
          ? Math.atan2(particle.vy, particle.vx) * 0.1
          : 0;
        ctx.translate(particle.x, particle.y);
        ctx.rotate(rotation);
        ctx.fillText(particle.symbol, 0, 0);
        ctx.restore();

        // Draw connections between nearby particles (more subtle)
        particlesRef.current.forEach((otherParticle) => {
          if (particle === otherParticle) return;

          const dx = otherParticle.x - particle.x;
          const dy = otherParticle.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const avgIntensity = (particle.colorIntensity + otherParticle.colorIntensity) / 2;
            const lineColor = blendToGrayscale(particle.baseColor, avgIntensity);

            ctx.save();
            ctx.globalAlpha = (1 - distance / 120) * 0.08; // Reduced from 0.15
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.5; // Thinner lines
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
      style={{ opacity: 0.7 }}
    />
  );
}
