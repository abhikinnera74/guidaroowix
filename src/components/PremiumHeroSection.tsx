import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface PremiumHeroProps {
  onLoadComplete?: () => void;
}

/**
 * Premium 3D Hero Section with WebGL animation
 * Features: Smooth parallax layers, floating particles, gradient glow text, motion blur
 */
export function PremiumHeroSection({ onLoadComplete }: PremiumHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const particlesRef = useRef<Particle[]>([]);

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    life: number;
  }

  // Initialize WebGL canvas with animated background
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
      particlesRef.current = [];
      for (let i = 0; i < 80; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.2,
          life: Math.random() * 1 + 0.5,
        });
      }
    };
    initParticles();

    // Animation loop
    let animationId: number;
    const animate = () => {
      // Clear with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0B3D0B');
      gradient.addColorStop(0.5, '#1a5a1a');
      gradient.addColorStop(1, '#0f4a0f');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add subtle noise/motion blur effect
      ctx.fillStyle = 'rgba(198, 185, 255, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Move towards mouse
        const dx = mouseRef.current.x * canvas.width - particle.x;
        const dy = mouseRef.current.y * canvas.height - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          particle.vx += (dx / distance) * 0.1;
          particle.vy += (dy / distance) * 0.1;
        }

        // Apply velocity
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Damping
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Keep in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Draw particle
        ctx.fillStyle = `rgba(198, 185, 255, ${particle.opacity * 0.6})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw connecting lines
        particlesRef.current.forEach((other, otherIndex) => {
          if (otherIndex <= index) return;
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.strokeStyle = `rgba(198, 185, 255, ${(1 - distance / 150) * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();
    setIsLoaded(true);
    onLoadComplete?.();

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = (e.clientY - rect.top) / rect.height;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [onLoadComplete]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-gradient-to-b from-primary via-primary to-primary/80 overflow-hidden"
    >
      {/* WebGL Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />

      {/* Parallax Depth Layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Layer 1 - Furthest back */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-gradient-to-br from-lavenderaccent/10 via-transparent to-transparent"
        />

        {/* Layer 2 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 2.5, delay: 0.2 }}
          className="absolute inset-0 bg-gradient-to-tl from-transparent via-lavenderaccent/5 to-transparent"
        />

        {/* Layer 3 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 3, delay: 0.4 }}
          className="absolute inset-0 bg-radial-gradient from-lavenderaccent/5 to-transparent"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(198, 185, 255, 0.1) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Content Overlay - Floating Text with Depth */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto">
        {/* Top floating text - Badge */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute top-20 md:top-32 text-center z-10"
        >
          <span className="inline-block py-2 px-6 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white font-paragraph font-medium tracking-widest text-xs md:text-sm uppercase">
            ✨ Curated Global Adventures
          </span>
        </motion.div>

        {/* Main heading - Layered depth text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="relative z-20 text-center max-w-5xl px-4 md:px-6"
        >
          {/* Glow effect background */}
          <div className="absolute inset-0 blur-3xl opacity-30 -z-10">
            <div className="w-full h-full bg-gradient-to-b from-lavenderaccent via-lavenderaccent/50 to-transparent rounded-full" />
          </div>

          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.95] font-black text-white tracking-tighter mb-4 md:mb-8">
            DISCOVER
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-lavenderaccent via-lavenderaccent to-white drop-shadow-2xl">
              THE WORLD
            </span>
          </h1>
        </motion.div>

        {/* Subtitle - Closer to viewer */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-40 md:bottom-48 text-center max-w-2xl px-4 md:px-6 z-30"
        >
          <p className="text-base md:text-lg lg:text-xl text-white/95 font-paragraph font-light leading-relaxed drop-shadow-lg">
            Connect with expert local guides and experience authentic adventures that go beyond the guidebook.
          </p>
        </motion.div>

        {/* CTA Buttons - Foreground */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-12 md:bottom-16 flex flex-col sm:flex-row items-center justify-center gap-4 z-40 w-full px-4"
        >
          <Link
            to="/tours"
            className="group relative px-8 py-4 bg-white text-primary rounded-full overflow-hidden transition-all hover:shadow-2xl hover:shadow-white/30 font-paragraph font-semibold text-base md:text-lg flex items-center gap-2 whitespace-nowrap"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Tours
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-lavenderaccent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out" />
          </Link>

          <Link
            to="/login"
            className="px-8 py-4 bg-transparent border-2 border-white text-white font-paragraph font-semibold text-base md:text-lg rounded-full hover:bg-white/10 transition-colors whitespace-nowrap"
          >
            Sign In
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40"
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 bg-white/60 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
