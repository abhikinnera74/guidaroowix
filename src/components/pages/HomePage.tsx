import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { Guides, GuideReviews } from '@/entities';
import { TouristPremiumHeader } from '@/components/PremiumHeader';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import { ArrowRight, MapPin, Users, Star, Globe, Compass, Shield } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { PremiumHeroSection } from '@/components/PremiumHeroSection';
import { DepthStack, StaggeredDepth } from '@/components/MultiLayerParallax';
import { AnimatedGuideIcons, ParticleField, AnimatedMapPin } from '@/components/AnimatedGuideIcons';
import { CuratedAdventuresSection } from '@/components/CuratedAdventuresSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { GuideHighlightsSection } from '@/components/GuideHighlightsSection';
import { LocationBasedDiscoverySection } from '@/components/LocationBasedDiscoverySection';

// --- UTILITIES & HELPERS ---

type AnimatedElementProps = {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
};

const AnimatedElement: React.FC<AnimatedElementProps> = ({ children, className, threshold = 0.1 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.classList.add('is-visible');
        observer.unobserve(element);
      }
    }, { threshold });

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-8 transition-all duration-1000 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0 ${className || ''}`}
    >
      {children}
    </div>
  );
};

// --- FEATURED GUIDES SECTION ---

type FeaturedGuidesProps = {
  guides: any[];
};

const FeaturedGuides: React.FC<FeaturedGuidesProps> = ({ guides }) => {
  if (guides.length === 0) return null;

  return (
    <section className="w-full bg-white py-20 relative overflow-hidden">
      <ParticleField count={15} className="opacity-30" />
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-heading text-5xl font-bold text-primary mb-4">Featured Guides</h2>
          <p className="font-paragraph text-xl text-foreground max-w-2xl mx-auto">
            Meet our top-rated guides ready to show you the world
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.slice(0, 3).map((guide, index) => (
            <DepthStack key={guide._id} depth={index} className="h-full">
              <a href={`/guide/${guide._id}`} className="group block h-full">
                <div className="bg-background rounded-2xl overflow-hidden shadow-sm border border-primary/10 hover:shadow-lg transition-all h-full flex flex-col">
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
            </DepthStack>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/find-guide"
            className="px-8 py-4 bg-primary text-primary-foreground font-paragraph text-lg rounded-full hover:bg-primary/90 transition-all inline-flex items-center gap-2"
          >
            Explore All Guides <ArrowRight size={20} />
          </a>
        </div>
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
      <div className="text-center mb-12">
        <h2 className="font-heading text-5xl font-bold text-primary mb-4">What Travelers Say</h2>
        <p className="font-paragraph text-xl text-foreground max-w-2xl mx-auto">
          Real experiences from real travelers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.slice(0, 3).map((review, index) => (
          <DepthStack key={review._id} depth={index} className="h-full">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-primary/10 h-full flex flex-col">
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
          </DepthStack>
        ))}
      </div>
    </section>
  );
};

// --- MAIN COMPONENT ---

export default function HomePage() {
  const { isAuthenticated } = useMember();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [guides, setGuides] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [splineLoaded, setSplineLoaded] = useState(false);

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
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
        style={{ scaleX }}
      />

      <TouristPremiumHeader />

      <main className="w-full">
        {/* --- PREMIUM 3D HERO SECTION --- */}
        <PremiumHeroSection onLoadComplete={() => setSplineLoaded(true)} />

        {/* --- CURATED GLOBAL ADVENTURES --- */}
        <CuratedAdventuresSection />

        {/* --- HOW IT WORKS --- */}
        <HowItWorksSection />

        {/* --- GUIDE HIGHLIGHTS (Horizontal Scroll) --- */}
        <GuideHighlightsSection />

        {/* --- LOCATION-BASED DISCOVERY --- */}
        <LocationBasedDiscoverySection />

        {/* --- GUIDE CTA SECTION --- */}
        <section className="w-full relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-primary">
            <Image
              src="https://static.wixstatic.com/media/70fb72_2805fa4979dc4fe19f9918f8202b17fb~mv2.png?originWidth=1280&originHeight=704"
              alt="Guide leading a tour"
              className="w-full h-full object-cover opacity-20 mix-blend-overlay"
              width={1920}
            />
          </div>

          <div className="relative z-10 max-w-[120rem] mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-5xl md:text-8xl font-black text-white mb-8">
                SHARE YOUR WORLD
              </h2>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 font-light">
                Join our community of expert guides. Turn your passion for your city into a thriving business and meet travelers from around the globe.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  to="/guide-login"
                  className="px-10 py-5 bg-white text-primary font-heading font-bold text-xl rounded-full hover:bg-lavenderaccent transition-colors shadow-lg hover:shadow-white/20"
                >
                  Become a Guide
                </Link>
                <Link
                  to="/tours"
                  className="px-10 py-5 bg-transparent border-2 border-white text-white font-heading font-bold text-xl rounded-full hover:bg-white/10 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Featured Guides Section */}
      {!loadingData && <FeaturedGuides guides={guides} />}

      {/* Testimonials Section */}
      {!loadingData && <Testimonials reviews={reviews} />}

      <Footer />
    </div>
  );
}
