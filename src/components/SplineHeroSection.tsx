import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface SplineHeroProps {
  onLoadComplete?: () => void;
}

export function SplineHeroSection({ onLoadComplete }: SplineHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Track mouse movement for camera control
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = (e.clientY - rect.top) / rect.height;

      // Send mouse position to Spline iframe
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: 'MOUSE_MOVE',
            x: mouseRef.current.x,
            y: mouseRef.current.y,
          },
          '*'
        );
      }
    };

    containerRef.current.addEventListener('mousemove', handleMouseMove);

    // Handle iframe load
    const handleIframeLoad = () => {
      setIsLoaded(true);
      onLoadComplete?.();
    };

    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', handleIframeLoad);
    }

    return () => {
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('load', handleIframeLoad);
      }
    };
  }, [onLoadComplete]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-gradient-to-b from-background via-background to-lavenderaccent/5 overflow-hidden"
    >
      {/* Spline 3D Scene - Fullscreen */}
      <iframe
        ref={iframeRef}
        src="https://my.spline.design/untitled-f1e5e5e7d2e5e5e7d2e5e5e7d2e5e5e7/scene"
        frameBorder="0"
        className="absolute inset-0 w-full h-full"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />

      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

      {/* Content Overlay - Floating Text with Depth */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {/* Top floating text - furthest back */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute top-20 text-center z-10"
        >
          <span className="inline-block py-2 px-6 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white font-medium tracking-widest text-sm uppercase">
            Curated Global Adventures
          </span>
        </motion.div>

        {/* Main heading - middle depth */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative z-20 text-center max-w-4xl px-6"
        >
          <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl leading-[0.9] font-black text-white tracking-tighter mb-6 drop-shadow-lg">
            DISCOVER
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-lavenderaccent to-white">
              THE WORLD
            </span>
          </h1>
        </motion.div>

        {/* Subtitle - closer to viewer */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-32 text-center max-w-2xl px-6 z-30"
        >
          <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed drop-shadow-md">
            Connect with expert local guides and experience authentic adventures that go beyond the guidebook.
          </p>
        </motion.div>

        {/* CTA Buttons - foreground */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute bottom-12 flex flex-wrap items-center justify-center gap-4 z-40"
        >
          <button className="group relative px-8 py-4 bg-white text-primary rounded-full overflow-hidden transition-all hover:shadow-2xl hover:shadow-white/30">
            <span className="relative z-10 flex items-center gap-2 font-semibold text-lg">
              Explore Tours
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-lavenderaccent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out" />
          </button>
          <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold text-lg rounded-full hover:bg-white/10 transition-colors">
            Sign In
          </button>
        </motion.div>
      </div>

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-white font-medium">Loading 3D Scene...</p>
          </div>
        </div>
      )}
    </div>
  );
}
