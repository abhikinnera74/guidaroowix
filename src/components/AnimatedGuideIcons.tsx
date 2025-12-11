import { motion } from 'framer-motion';
import { MapPin, Users, Star, Globe, Compass, Shield } from 'lucide-react';

interface AnimatedIconProps {
  icon: React.ReactNode;
  label: string;
  delay?: number;
  className?: string;
}

const AnimatedIcon = ({ icon, label, delay = 0, className = '' }: AnimatedIconProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
      whileHover={{ scale: 1.15, rotate: 5 }}
      className={`flex flex-col items-center gap-2 ${className}`}
    >
      <motion.div
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lavenderaccent/30 to-secondary/20 flex items-center justify-center"
        whileHover={{
          boxShadow: '0 20px 40px rgba(123, 75, 43, 0.3)',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="text-primary"
        >
          {icon}
        </motion.div>
      </motion.div>
      <p className="text-sm font-medium text-foreground text-center">{label}</p>
    </motion.div>
  );
};

interface AnimatedGuideIconsProps {
  className?: string;
}

export function AnimatedGuideIcons({ className = '' }: AnimatedGuideIconsProps) {
  const icons = [
    { icon: <MapPin size={28} />, label: 'Local Expertise' },
    { icon: <Users size={28} />, label: 'Expert Guides' },
    { icon: <Star size={28} />, label: 'Top Rated' },
    { icon: <Globe size={28} />, label: 'Global Network' },
    { icon: <Compass size={28} />, label: 'Adventures' },
    { icon: <Shield size={28} />, label: 'Verified' },
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 ${className}`}>
      {icons.map((item, index) => (
        <AnimatedIcon
          key={index}
          icon={item.icon}
          label={item.label}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}

interface FloatingParticleProps {
  delay?: number;
  duration?: number;
}

const FloatingParticle = ({ delay = 0, duration = 4 }: FloatingParticleProps) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
      }}
      animate={{
        opacity: [0, 1, 0],
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="absolute w-2 h-2 bg-secondary/40 rounded-full"
    />
  );
};

interface ParticleFieldProps {
  count?: number;
  className?: string;
}

export function ParticleField({ count = 20, className = '' }: ParticleFieldProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <FloatingParticle
          key={i}
          delay={i * 0.1}
          duration={3 + Math.random() * 2}
        />
      ))}
    </div>
  );
}

interface AnimatedMapPinProps {
  x: string;
  y: string;
  label: string;
  delay?: number;
}

export function AnimatedMapPin({ x, y, label, delay = 0 }: AnimatedMapPinProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className="absolute"
      style={{ left: x, top: y }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-lg">
          <MapPin size={24} className="text-white" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 w-12 h-12 border-2 border-secondary rounded-full"
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
        className="absolute top-16 left-1/2 transform -translate-x-1/2 text-sm font-medium text-foreground whitespace-nowrap"
      >
        {label}
      </motion.p>
    </motion.div>
  );
}
