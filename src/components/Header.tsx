import { Link, useLocation } from 'react-router-dom';
import { useMember } from '@/integrations';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

// Tourist Header
export function TouristHeader() {
  const { member, isAuthenticated, isLoading, actions } = useMember();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-background border-b border-primary/10 sticky top-0 z-50">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold text-primary">Guidaroo</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/tours" 
              className={`font-paragraph text-base transition-colors ${
                isActive('/tours') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
              }`}
            >
              Explore Tours
            </Link>
            <Link 
              to="/find-guide" 
              className={`font-paragraph text-base transition-colors ${
                isActive('/find-guide') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
              }`}
            >
              Find a Guide
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/tourist-profile" 
                  className={`font-paragraph text-base transition-colors ${
                    isActive('/tourist-profile') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
                  }`}
                >
                  Profile
                </Link>
                <Link 
                  to="/tourist-dashboard" 
                  className={`font-paragraph text-base transition-colors ${
                    isActive('/tourist-dashboard') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
                  }`}
                >
                  My Bookings
                </Link>
                
                <button
                  onClick={actions.logout}
                  className="px-6 py-2 border border-secondary text-secondary font-paragraph text-base rounded-full hover:bg-secondary hover:text-secondary-foreground transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                {!isLoading && (
                  <>
                    <Link 
                      to="/login" 
                      className={`font-paragraph text-base transition-colors ${
                        isActive('/login') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
                      }`}
                    >
                      Tourist Login
                    </Link>
                    <Link 
                      to="/guide-login" 
                      className={`font-paragraph text-base transition-colors ${
                        isActive('/guide-login') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
                      }`}
                    >
                      Guide Login
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-primary"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ height: mobileMenuOpen ? 'auto' : 0, opacity: mobileMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          {mobileMenuOpen && (
            <nav className="py-6 border-t border-primary/10">
              <div className="flex flex-col gap-4">
                <Link 
                  to="/tours" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-paragraph text-base transition-colors ${
                    isActive('/tours') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
                  }`}
                >
                  Explore Tours
                </Link>
                <Link 
                  to="/find-guide" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-paragraph text-base transition-colors ${
                    isActive('/find-guide') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
                  }`}
                >
                  Find a Guide
                </Link>
                
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/tourist-profile" 
                      onClick={() => setMobileMenuOpen(false)}
                      className={`font-paragraph text-base transition-colors ${
                        isActive('/tourist-profile') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
                      }`}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/tourist-dashboard" 
                      onClick={() => setMobileMenuOpen(false)}
                      className={`font-paragraph text-base transition-colors ${
                        isActive('/tourist-dashboard') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
                      }`}
                    >
                      My Bookings
                    </Link>
                    
                    <button
                      onClick={() => {
                        actions.logout();
                        setMobileMenuOpen(false);
                      }}
                      className="px-6 py-2 border border-secondary text-secondary font-paragraph text-base rounded-full hover:bg-secondary hover:text-secondary-foreground transition-all text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    {!isLoading && (
                      <>
                        <Link 
                          to="/login" 
                          onClick={() => setMobileMenuOpen(false)}
                          className={`font-paragraph text-base transition-colors ${
                            isActive('/login') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
                          }`}
                        >
                          Tourist Login
                        </Link>
                        <Link 
                          to="/guide-login" 
                          onClick={() => setMobileMenuOpen(false)}
                          className={`font-paragraph text-base transition-colors ${
                            isActive('/guide-login') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'
                          }`}
                        >
                          Guide Login
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </nav>
          )}
        </motion.div>
      </div>
    </header>
  );
}

// Guide Header
export function GuideHeader() {
  const { member, isAuthenticated, isLoading, actions } = useMember();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-background border-b border-secondary/10 sticky top-0 z-50">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold text-secondary">Guidaroo</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/guide-dashboard" 
              className={`font-paragraph text-base transition-colors ${
                isActive('/guide-dashboard') ? 'text-secondary font-semibold' : 'text-foreground hover:text-secondary'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/guide-my-tours" 
              className={`font-paragraph text-base transition-colors ${
                isActive('/guide-my-tours') ? 'text-secondary font-semibold' : 'text-foreground hover:text-secondary'
              }`}
            >
              My Tours
            </Link>
            <Link 
              to="/guide-bookings" 
              className={`font-paragraph text-base transition-colors ${
                isActive('/guide-bookings') ? 'text-secondary font-semibold' : 'text-foreground hover:text-secondary'
              }`}
            >
              Bookings
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/guide-profile" 
                  className={`font-paragraph text-base transition-colors ${
                    isActive('/guide-profile') ? 'text-secondary font-semibold' : 'text-foreground hover:text-secondary'
                  }`}
                >
                  Profile
                </Link>
                
                <button
                  onClick={actions.logout}
                  className="px-6 py-2 border border-secondary text-secondary font-paragraph text-base rounded-full hover:bg-secondary hover:text-secondary-foreground transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                {!isLoading && (
                  <Link 
                    to="/guide-login" 
                    className={`font-paragraph text-base transition-colors ${
                      isActive('/guide-login') ? 'text-secondary font-semibold' : 'text-foreground hover:text-secondary'
                    }`}
                  >
                    Guide Login
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-secondary"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ height: mobileMenuOpen ? 'auto' : 0, opacity: mobileMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          {mobileMenuOpen && (
            <nav className="py-6 border-t border-secondary/10">
              <div className="flex flex-col gap-4">
                <Link 
                  to="/guide-dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-paragraph text-base transition-colors ${
                    isActive('/guide-dashboard') ? 'text-secondary font-semibold' : 'text-foreground hover:text-secondary'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/guide-my-tours" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-paragraph text-base transition-colors ${
                    isActive('/guide-my-tours') ? 'text-secondary font-semibold' : 'text-foreground hover:text-secondary'
                  }`}
                >
                  My Tours
                </Link>
                <Link 
                  to="/guide-bookings" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-paragraph text-base transition-colors ${
                    isActive('/guide-bookings') ? 'text-secondary font-semibold' : 'text-foreground hover:text-secondary'
                  }`}
                >
                  Bookings
                </Link>
                
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/guide-profile" 
                      onClick={() => setMobileMenuOpen(false)}
                      className={`font-paragraph text-base transition-colors ${
                        isActive('/guide-profile') ? 'text-secondary font-semibold' : 'text-foreground hover:text-secondary'
                      }`}
                    >
                      Profile
                    </Link>
                    
                    <button
                      onClick={() => {
                        actions.logout();
                        setMobileMenuOpen(false);
                      }}
                      className="px-6 py-2 border border-secondary text-secondary font-paragraph text-base rounded-full hover:bg-secondary hover:text-secondary-foreground transition-all text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    {!isLoading && (
                      <Link 
                        to="/guide-login" 
                        onClick={() => setMobileMenuOpen(false)}
                        className={`font-paragraph text-base transition-colors ${
                          isActive('/guide-login') ? 'text-secondary font-semibold' : 'text-foreground hover:text-secondary'
                        }`}
                      >
                        Guide Login
                      </Link>
                    )}
                  </>
                )}
              </div>
            </nav>
          )}
        </motion.div>
      </div>
    </header>
  );
}

// Default export for backward compatibility
export default function Header() {
  const location = useLocation();
  const isGuideRoute = location.pathname.startsWith('/guide-');
  
  return isGuideRoute ? <GuideHeader /> : <TouristHeader />;
}
