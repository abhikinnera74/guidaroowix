import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { Guides, GuideReviews } from '@/entities';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import { ArrowRight, MapPin, Users, Star, Globe, Compass, Shield, Menu, X } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// --- FLOATING NAVBAR ---

const FloatingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, actions } = useMember();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-4xl"
    >
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-heading text-2xl font-bold text-white hover:text-lavenderaccent transition-colors">
          Guidaroo
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#tours" className="text-white/80 hover:text-white transition-colors font-paragraph">Tours</a>
          <a href="#guides" className="text-white/80 hover:text-white transition-colors font-paragraph">Guides</a>
          <a href="#about" className="text-white/80 hover:text-white transition-colors font-paragraph">About</a>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/tourist-dashboard" className="text-white/80 hover:text-white transition-colors font-paragraph">
                Dashboard
              </Link>
              <button
                onClick={actions.logout}
                className="px-6 py-2 text-white border border-white/30 rounded-full hover:bg-white/10 transition-colors font-paragraph"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={actions.login}
                className="px-6 py-2 text-white border border-white/30 rounded-full hover:bg-white/10 transition-colors font-paragraph"
              >
                Sign In
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white hover:text-lavenderaccent transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full mt-4 left-0 right-0 backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-6 md:hidden"
        >
          <div className="flex flex-col gap-4">
            <a href="#tours" className="text-white/80 hover:text-white transition-colors font-paragraph">Tours</a>
            <a href="#guides" className="text-white/80 hover:text-white transition-colors font-paragraph">Guides</a>
            <a href="#about" className="text-white/80 hover:text-white transition-colors font-paragraph">About</a>
            {isAuthenticated ? (
              <>
                <Link to="/tourist-dashboard" className="text-white/80 hover:text-white transition-colors font-paragraph">
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    actions.logout();
                    setIsOpen(false);
                  }}
                  className="px-6 py-2 text-white border border-white/30 rounded-full hover:bg-white/10 transition-colors font-paragraph"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  actions.login();
                  setIsOpen(false);
                }}
                className="px-6 py-2 text-white border border-white/30 rounded-full hover:bg-white/10 transition-colors font-paragraph"
              >
                Sign In
              </button>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

// --- HERO SECTION ---

const HeroSection = () => {
  const { isAuthenticated, actions } = useMember();
  const containerRef = useRef(null);
  const { scrollY } = useScroll({ target: containerRef });
  const y = useTransform(scrollY, [0, 300], [0, 100]);

  return (
    <section ref={containerRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B3D0B] via-[#1a5a1a] to-[#0d2d0d]">
        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            x: [0, 50, -50, 0],
            y: [0, 30, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-[#2d7a2d]/40 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -40, 40, 0],
            y: [0, -40, 40, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-gradient-radial from-[#1a5a1a]/30 to-transparent rounded-full blur-3xl"
        />
        <div className="absolute inset-0 opacity-5 mix-blend-overlay" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[120rem] mx-auto px-6 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)]">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Accent Label */}
              <div className="inline-flex items-center gap-2 w-fit">
                <div className="w-2 h-2 bg-lavenderaccent rounded-full" />
                <span className="text-lavenderaccent font-paragraph text-sm font-semibold tracking-widest uppercase">
                  Explore & Experience
                </span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="font-heading text-7xl md:text-8xl lg:text-9xl font-black text-white leading-none">
                  <span className="block">Discover</span>
                  <span className="block bg-gradient-to-r from-lavenderaccent via-[#E0D4FF] to-lavenderaccent bg-clip-text text-transparent">
                    Authentic
                  </span>
                  <span className="block">Adventures</span>
                </h1>
              </div>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="font-paragraph text-xl md:text-2xl text-white/80 max-w-2xl leading-relaxed"
              >
                Connect with expert local guides and experience the world like never before. Authentic, personalized, unforgettable.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex gap-8 pt-4"
              >
                <div>
                  <div className="text-3xl font-heading font-black text-lavenderaccent">500+</div>
                  <p className="text-white/60 font-paragraph text-sm">Expert Guides</p>
                </div>
                <div>
                  <div className="text-3xl font-heading font-black text-lavenderaccent">50+</div>
                  <p className="text-white/60 font-paragraph text-sm">Destinations</p>
                </div>
                <div>
                  <div className="text-3xl font-heading font-black text-lavenderaccent">10K+</div>
                  <p className="text-white/60 font-paragraph text-sm">Happy Travelers</p>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-start gap-4 pt-8"
              >
                <Link
                  to="/tours"
                  className="px-8 py-4 bg-white text-primary font-heading font-bold text-lg rounded-lg hover:bg-lavenderaccent transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Explore Tours
                </Link>
                <button
                  onClick={isAuthenticated ? () => {} : actions.login}
                  className="px-8 py-4 border-2 border-white text-white font-heading font-bold text-lg rounded-lg hover:bg-white/10 transition-all duration-300 hover:border-lavenderaccent active:scale-95"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ y }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full aspect-square max-w-md">
              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-lavenderaccent/20 to-transparent border border-lavenderaccent/30 rounded-2xl backdrop-blur-sm p-6 flex flex-col justify-end"
              >
                <div className="text-white">
                  <div className="text-sm font-paragraph text-white/70 mb-2">Featured Guide</div>
                  <div className="font-heading font-bold text-lg">Local Expert</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-0 right-0 w-56 h-40 bg-gradient-to-br from-[#2d7a2d]/30 to-transparent border border-[#2d7a2d]/50 rounded-2xl backdrop-blur-sm p-6 flex flex-col justify-end"
              >
                <div className="text-white">
                  <div className="text-sm font-paragraph text-white/70 mb-2">Next Adventure</div>
                  <div className="font-heading font-bold text-lg">Mountain Trek</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 right-1/4 w-40 h-40 bg-gradient-to-br from-white/10 to-transparent border border-white/20 rounded-2xl backdrop-blur-sm"
              />
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="text-white/60 text-sm font-paragraph">Scroll to explore</div>
        </motion.div>
      </div>
    </section>
  );
};

// --- MAIN COMPONENT ---

// --- FEATURED GUIDES SECTION ---

type FeaturedGuidesProps = {
  guides: any[];
};

const FeaturedGuides: React.FC<FeaturedGuidesProps> = ({ guides }) => {
  if (guides.length === 0) return null;

  return (
    <section id="guides" className="w-full bg-white py-20 relative overflow-hidden">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-5xl font-bold text-primary mb-4">Featured Guides</h2>
          <p className="font-paragraph text-xl text-foreground max-w-2xl mx-auto">
            Meet our top-rated guides ready to show you the world
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.slice(0, 3).map((guide, index) => (
            <motion.div
              key={guide._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <a href={`/guide/${guide._id}`} className="group block h-full">
                <div className="bg-background rounded-2xl overflow-hidden shadow-sm border border-primary/10 hover:shadow-lg transition-all h-full flex flex-col hover:border-primary/30">
                  {guide.profilePicture && (
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={guide.profilePicture}
                        alt={guide.fullName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-heading text-2xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                      {guide.fullName}
                    </h3>

                    {guide.specialty && (
                      <p className="font-paragraph text-sm text-secondary mb-3">{guide.specialty}</p>
                    )}

                    <p className="font-paragraph text-base text-foreground mb-4 line-clamp-2 flex-1">
                      {guide.bio}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                      <div className="flex items-center gap-1">
                        <Star size={18} className="text-secondary fill-secondary" />
                        <span className="font-heading font-bold text-primary">
                          {guide.averageRating?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                      {guide.hourlyRate && (
                        <span className="font-heading text-lg font-bold text-secondary">
                          ${guide.hourlyRate}/hr
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="/find-guide"
            className="px-8 py-4 bg-primary text-primary-foreground font-paragraph text-lg rounded-full hover:bg-primary/90 transition-all inline-flex items-center gap-2 hover:gap-3"
          >
            Explore All Guides <ArrowRight size={20} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// --- TESTIMONIALS SECTION ---

type TestimonialsProps = {
  reviews: any[];
};

const Testimonials: React.FC<TestimonialsProps> = ({ reviews }) => {
  if (reviews.length === 0) return null;

  return (
    <section className="w-full max-w-[120rem] mx-auto px-6 lg:px-12 py-20 relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-heading text-5xl font-bold text-primary mb-4">What Travelers Say</h2>
        <p className="font-paragraph text-xl text-foreground max-w-2xl mx-auto">
          Real experiences from real travelers
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.slice(0, 3).map((review, index) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-primary/10 h-full flex flex-col hover:shadow-lg transition-all hover:border-primary/30">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < (review.rating || 0) ? 'text-secondary fill-secondary' : 'text-primary/20'}
                  />
                ))}
              </div>

              <p className="font-paragraph text-lg text-foreground mb-6 flex-1">
                "{review.reviewText}"
              </p>

              <div>
                <p className="font-heading text-base font-bold text-primary">
                  {review.touristName}
                </p>
                <p className="font-paragraph text-sm text-foreground/70">
                  Toured with {review.guideName}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// --- MAIN COMPONENT ---

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [guides, setGuides] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [guidesData, reviewsData] = await Promise.all([
          BaseCrudService.getAll<Guides>('guides'),
          BaseCrudService.getAll<GuideReviews>('guidereviews'),
        ]);

        setGuides(guidesData.items || []);
        setReviews(reviewsData.items || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background font-paragraph overflow-clip selection:bg-lavenderaccent selection:text-primary">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-lavenderaccent origin-left z-50"
        style={{ scaleX }}
      />

      {/* Floating Navbar */}
      <FloatingNavbar />

      <main className="w-full">
        {/* --- HERO SECTION --- */}
        <HeroSection />

        {/* --- FEATURED GUIDES SECTION --- */}
        {!loadingData && <FeaturedGuides guides={guides} />}

        {/* --- TESTIMONIALS SECTION --- */}
        {!loadingData && <Testimonials reviews={reviews} />}

        {/* --- GUIDE CTA SECTION --- */}
        <section id="about" className="w-full relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-[#1a5a1a]">
            <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            }} />
          </div>

          <div className="relative z-10 max-w-[120rem] mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-5xl md:text-8xl font-black text-white mb-8">
                Share Your World
              </h2>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 font-light">
                Join our community of expert guides. Turn your passion for your city into a thriving business and meet travelers from around the globe.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  to="/guide-login"
                  className="px-10 py-4 bg-white text-primary font-heading font-bold text-lg rounded-full hover:bg-lavenderaccent transition-all duration-300 shadow-lg hover:shadow-white/30 hover:scale-105"
                >
                  Become a Guide
                </Link>
                <Link
                  to="/tours"
                  className="px-10 py-4 bg-transparent border-2 border-white text-white font-heading font-bold text-lg rounded-full hover:bg-white/10 transition-all duration-300 hover:border-lavenderaccent"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
