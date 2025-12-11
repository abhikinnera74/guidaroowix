import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxDepthProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export function ParallaxDepth({ children, offset = 50, className = '' }: ParallaxDepthProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

interface DepthLayerProps {
  children: React.ReactNode;
  depth: number; // 0 = closest, higher = further away
  className?: string;
}

export function DepthLayer({ children, depth, className = '' }: DepthLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // More depth = less movement
  const offset = 100 - depth * 15;
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

interface StaggeredParallaxProps {
  children: React.ReactNode[];
  className?: string;
}

export function StaggeredParallax({ children, className = '' }: StaggeredParallaxProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <DepthLayer key={index} depth={index} className="w-full">
          {child}
        </DepthLayer>
      ))}
    </div>
  );
}
