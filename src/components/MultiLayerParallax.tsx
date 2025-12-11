import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface MultiLayerParallaxProps {
  children: React.ReactNode[];
  className?: string;
}

/**
 * Creates a 5-10 layer parallax depth effect
 * Each child element moves at a different speed based on scroll position
 */
export function MultiLayerParallax({ children, className = '' }: MultiLayerParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Create 5-10 different parallax speeds
  const parallaxLayers = children.map((_, index) => {
    const layerDepth = index / children.length;
    const offset = 100 - layerDepth * 80; // Range from 100 to 20
    return useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  });

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          style={{ y: parallaxLayers[index] }}
          className="w-full"
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

interface DepthStackProps {
  children: React.ReactNode;
  depth: number; // 0 = closest, 10 = furthest
  className?: string;
}

/**
 * Individual depth layer component
 * Use this to wrap content that should have parallax depth
 */
export function DepthStack({ children, depth, className = '' }: DepthStackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Normalize depth to 0-1 range
  const normalizedDepth = Math.min(depth / 10, 1);
  const offset = 100 - normalizedDepth * 80;

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div ref={ref} style={{ y }} className={`w-full ${className}`}>
      {children}
    </motion.div>
  );
}

interface StaggeredDepthProps {
  children: React.ReactNode[];
  startDepth?: number;
  className?: string;
}

/**
 * Automatically stagger children across depth layers
 */
export function StaggeredDepth({ children, startDepth = 0, className = '' }: StaggeredDepthProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <DepthStack
          key={index}
          depth={startDepth + index}
          className="w-full"
        >
          {child}
        </DepthStack>
      ))}
    </div>
  );
}

interface FloatingTextProps {
  text: string;
  depth: number;
  className?: string;
  delay?: number;
}

/**
 * Floating text with depth and animation
 */
export function FloatingText({ text, depth, className = '', delay = 0 }: FloatingTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const normalizedDepth = Math.min(depth / 10, 1);
  const offset = 100 - normalizedDepth * 80;
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {text}
    </motion.div>
  );
}
