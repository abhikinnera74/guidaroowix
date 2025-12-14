import { Link, useLocation } from 'react-router-dom';
import { useMember } from '@/integrations';
import { Menu, X, Compass, MapPin, LogIn, Users } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GuideNotificationsCenter } from '@/components/GuideNotificationsCenter';

interface NavItemProps {
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}

const NavChip: React.FC<NavItemProps> = ({ label, href, icon, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={href}
        onClick={onClick}
        className={`relative group px-4 py-2 rounded-full font-paragraph text-sm font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
          isActive
            ? 'text-white bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/40'
            : 'text-foreground hover:text-primary'
        }`}
      >
        {/* 3D Depth shadow */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-300 ${
            isActive
              ? 'bg-gradient-to-br from-primary/20 to-transparent blur-lg'
              : 'bg-transparent group-hover:bg-primary/10 group-hover:blur-lg'
          }`}
        />

        {/* 3D Border glow */}
        <div
          className={`absolute inset-0 rounded-full border transition-all duration-300 ${
            isActive
              ? 'border-primary/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
              : 'border-transparent group-hover:border-primary/30'
          }`}
        />

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          <motion.span
            animate={isHovered ? { rotate: 12, scale: 1.1 } : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center"
          >
            {icon}
          </motion.span>
          <span className="hidden sm:inline">{label}</span>
        </span>

        {/* Light sweep effect on hover */}
        {isHovered && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '100%', opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        )}

        {/* Active indicator line */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent rounded-full"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    </motion.div>
  );
};

export function TouristPremiumHeader() {
  const { member, isAuthenticated, isLoading, actions } = useMember();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [mouseNearTop, setMouseNearTop] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const isActive = (path: string) => location.pathname === path;

  // Track mouse position for particle field and top hover detection
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!headerRef.current) return;
      const rect = headerRef.current.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });

      // Check if mouse is near the top 20px
      if (e.clientY < 20) {
        setMouseNearTop(true);
        setIsHeaderVisible(true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Track scroll for parallax effect and auto-hide behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsAtTop(currentScrollY < 50);

      // Debounced scroll direction detection
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const scrollDelta = currentScrollY - lastScrollYRef.current;
        
        // Scrolling down - hide header
        if (scrollDelta > 0 && currentScrollY > 100) {
          setIsHeaderVisible(false);
        }
        // Scrolling up - show header
        else if (scrollDelta < 0) {
          setIsHeaderVisible(true);
        }
        // At top - always show
        else if (currentScrollY < 50) {
          setIsHeaderVisible(true);
        }

        lastScrollYRef.current = currentScrollY;
      }, 150); // 150ms debounce
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const navItems = [
    { label: 'Explore Tours', href: '/tours', icon: <Compass size={16} /> },
    { label: 'Find a Guide', href: '/find-guide', icon: <MapPin size={16} /> },
    ...(isAuthenticated
      ? [
          { label: 'Profile', href: '/tourist-profile', icon: <Users size={16} /> },
          { label: 'My Bookings', href: '/tourist-dashboard', icon: <MapPin size={16} /> },
        ]
      : [
          { label: 'Tourist Login', href: '/login', icon: <LogIn size={16} /> },
          { label: 'Guide Login', href: '/guide-login', icon: <LogIn size={16} /> },
        ]),
  ];

  return (
    <motion.header
      ref={headerRef}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        y: scrollY * 0.05, // Subtle parallax float effect
      }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Background particle field */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="w-full h-full opacity-30"
          style={{
            transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Subtle wireframe mesh */}
          {[...Array(4)].map((_, i) => (
            <circle
              key={`particle-${i}`}
              cx={`${25 + i * 25}%`}
              cy="50%"
              r="2"
              fill="rgba(11, 61, 11, 0.4)"
              filter="url(#glow)"
            />
          ))}

          {/* Connecting lines */}
          {[...Array(3)].map((_, i) => (
            <line
              key={`line-${i}`}
              x1={`${25 + i * 25}%`}
              y1="50%"
              x2={`${50 + i * 25}%`}
              y2="50%"
              stroke="rgba(11, 61, 11, 0.2)"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      {/* Glass-morphism container with auto-hide animation */}
      <motion.div
        className="relative mx-4 md:mx-6 lg:mx-12 my-4"
        animate={{
          y: isHeaderVisible ? 0 : -120,
          opacity: isHeaderVisible ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
      >
        <div
          className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl"
          style={{
            boxShadow: `
              0 8px 32px rgba(11, 61, 11, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.2),
              0 0 20px rgba(198, 185, 255, 0.1)
            `,
          }}
        />

        {/* Content */}
        <div className="relative px-6 lg:px-12 py-4 flex items-center justify-between h-20">
          {/* Logo - 3D Embossed */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            <Link to="/" className="relative group">
              <div className="relative">
                {/* 3D Depth layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent blur-lg rounded-lg transform translate-y-1 translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent blur-md rounded-lg" />

                {/* Main text with emboss effect */}
                <span className="relative block font-heading text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary to-primary/80">
                  Guidaroo
                </span>

                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-lavenderaccent/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

                {/* Shine animation on hover */}
                <motion.div
                  initial={{ opacity: 0, x: '-100%' }}
                  whileHover={{ opacity: 1, x: '100%' }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-lg"
                />
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-3 ml-auto">
            {navItems.map((item) => (
              <NavChip
                key={item.href}
                label={item.label}
                href={item.href}
                icon={item.icon}
                isActive={isActive(item.href)}
              />
            ))}

            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={actions.logout}
                className="ml-2 px-4 py-2 rounded-full font-paragraph text-sm font-medium text-white bg-gradient-to-br from-secondary to-secondary/80 hover:shadow-lg hover:shadow-secondary/40 transition-all duration-300 relative group"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary/20 to-transparent blur-lg group-hover:blur-xl transition-all duration-300" />
                <span className="relative z-10">Sign Out</span>
              </motion.button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-primary relative group"
            aria-label="Toggle menu"
          >
            {/* 3D button background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent blur-lg rounded-lg group-hover:blur-xl transition-all duration-300" />

            <motion.div
              animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{
            height: mobileMenuOpen ? 'auto' : 0,
            opacity: mobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          {mobileMenuOpen && (
            <nav className="px-6 py-6 border-t border-white/10 flex flex-col gap-3">
              {navItems.map((item) => (
                <NavChip
                  key={item.href}
                  label={item.label}
                  href={item.href}
                  icon={item.icon}
                  isActive={isActive(item.href)}
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}

              {isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    actions.logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 rounded-full font-paragraph text-sm font-medium text-white bg-gradient-to-br from-secondary to-secondary/80 hover:shadow-lg hover:shadow-secondary/40 transition-all duration-300 relative group"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary/20 to-transparent blur-lg group-hover:blur-xl transition-all duration-300" />
                  <span className="relative z-10">Sign Out</span>
                </motion.button>
              )}
            </nav>
          )}
        </motion.div>
      </motion.div>
    </motion.header>
  );
}

// Guide Header variant
export function GuidePremiumHeader() {
  const { member, isAuthenticated, isLoading, actions } = useMember();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [mouseNearTop, setMouseNearTop] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!headerRef.current) return;
      const rect = headerRef.current.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });

      // Check if mouse is near the top 20px
      if (e.clientY < 20) {
        setMouseNearTop(true);
        setIsHeaderVisible(true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsAtTop(currentScrollY < 50);

      // Debounced scroll direction detection
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const scrollDelta = currentScrollY - lastScrollYRef.current;
        
        // Scrolling down - hide header
        if (scrollDelta > 0 && currentScrollY > 100) {
          setIsHeaderVisible(false);
        }
        // Scrolling up - show header
        else if (scrollDelta < 0) {
          setIsHeaderVisible(true);
        }
        // At top - always show
        else if (currentScrollY < 50) {
          setIsHeaderVisible(true);
        }

        lastScrollYRef.current = currentScrollY;
      }, 150); // 150ms debounce
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const navItems = [
    { label: 'Dashboard', href: '/guide-dashboard', icon: <Compass size={16} /> },
    { label: 'My Tours', href: '/guide-my-tours', icon: <MapPin size={16} /> },
    { label: 'Bookings', href: '/guide-bookings', icon: <Users size={16} /> },
    ...(isAuthenticated
      ? [{ label: 'Profile', href: '/guide-profile', icon: <Users size={16} /> }]
      : [{ label: 'Guide Login', href: '/guide-login', icon: <LogIn size={16} /> }]),
  ];

  return (
    <motion.header
      ref={headerRef}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        y: scrollY * 0.05,
      }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Background particle field */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="w-full h-full opacity-30"
          style={{
            transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <defs>
            <filter id="glow-guide">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {[...Array(4)].map((_, i) => (
            <circle
              key={`particle-${i}`}
              cx={`${25 + i * 25}%`}
              cy="50%"
              r="2"
              fill="rgba(122, 75, 43, 0.4)"
              filter="url(#glow-guide)"
            />
          ))}

          {[...Array(3)].map((_, i) => (
            <line
              key={`line-${i}`}
              x1={`${25 + i * 25}%`}
              y1="50%"
              x2={`${50 + i * 25}%`}
              y2="50%"
              stroke="rgba(122, 75, 43, 0.2)"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      {/* Glass-morphism container with auto-hide animation */}
      <motion.div
        className="relative mx-4 md:mx-6 lg:mx-12 my-4"
        animate={{
          y: isHeaderVisible ? 0 : -120,
          opacity: isHeaderVisible ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
      >
        <div
          className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl"
          style={{
            boxShadow: `
              0 8px 32px rgba(122, 75, 43, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.2),
              0 0 20px rgba(198, 185, 255, 0.1)
            `,
          }}
        />

        {/* Content */}
        <div className="relative px-6 lg:px-12 py-4 flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            <Link to="/" className="relative group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-transparent blur-lg rounded-lg transform translate-y-1 translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent blur-md rounded-lg" />

                <span className="relative block font-heading text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-secondary via-secondary to-secondary/80">
                  Guidaroo
                </span>

                <div className="absolute inset-0 bg-gradient-to-r from-lavenderaccent/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

                <motion.div
                  initial={{ opacity: 0, x: '-100%' }}
                  whileHover={{ opacity: 1, x: '100%' }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-lg"
                />
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-3 ml-auto">
            {navItems.map((item) => (
              <NavChip
                key={item.href}
                label={item.label}
                href={item.href}
                icon={item.icon}
                isActive={isActive(item.href)}
              />
            ))}

            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={actions.logout}
                className="ml-2 px-4 py-2 rounded-full font-paragraph text-sm font-medium text-white bg-gradient-to-br from-secondary to-secondary/80 hover:shadow-lg hover:shadow-secondary/40 transition-all duration-300 relative group"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary/20 to-transparent blur-lg group-hover:blur-xl transition-all duration-300" />
                <span className="relative z-10">Sign Out</span>
              </motion.button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-secondary relative group"
            aria-label="Toggle menu"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent blur-lg rounded-lg group-hover:blur-xl transition-all duration-300" />

            <motion.div
              animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{
            height: mobileMenuOpen ? 'auto' : 0,
            opacity: mobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          {mobileMenuOpen && (
            <nav className="px-6 py-6 border-t border-white/10 flex flex-col gap-3">
              {navItems.map((item) => (
                <NavChip
                  key={item.href}
                  label={item.label}
                  href={item.href}
                  icon={item.icon}
                  isActive={isActive(item.href)}
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}

              {isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    actions.logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 rounded-full font-paragraph text-sm font-medium text-white bg-gradient-to-br from-secondary to-secondary/80 hover:shadow-lg hover:shadow-secondary/40 transition-all duration-300 relative group"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary/20 to-transparent blur-lg group-hover:blur-xl transition-all duration-300" />
                  <span className="relative z-10">Sign Out</span>
                </motion.button>
              )}
            </nav>
          )}
        </motion.div>
      </motion.div>
    </motion.header>
  );
}

// Default export for backward compatibility
export default function PremiumHeader() {
  const location = useLocation();
  const isGuideRoute = location.pathname.startsWith('/guide-');

  return isGuideRoute ? <GuidePremiumHeader /> : <TouristPremiumHeader />;
}
