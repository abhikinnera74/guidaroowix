import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface ScrollReactiveHeaderProps {
  children: React.ReactNode;
  hideThreshold?: number;
  showThreshold?: number;
}

export function ScrollReactiveHeader({
  children,
  hideThreshold = 50,
  showThreshold = -50,
}: ScrollReactiveHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const scrollDelta = currentScroll - lastScrollRef.current;

      // Add shadow when scrolled
      setIsScrolled(currentScroll > 10);

      // Hide header when scrolling down
      if (scrollDelta > hideThreshold && isVisible) {
        setIsVisible(false);
      }
      // Show header when scrolling up
      else if (scrollDelta < showThreshold && !isVisible) {
        setIsVisible(true);
      }

      lastScrollRef.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible, hideThreshold, showThreshold]);

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-md' : ''
      }`}
    >
      {children}
    </motion.div>
  );
}
