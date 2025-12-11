import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { Guides, GuideReviews } from '@/entities';
import { TouristHeader } from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import { ArrowRight, MapPin, Users, Star, Globe, Compass, Shield } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { SplineHeroSection } from '@/components/SplineHeroSection';
import { DepthStack, StaggeredDepth } from '@/components/MultiLayerParallax';
import { AnimatedGuideIcons, ParticleField, AnimatedMapPin } from '@/components/AnimatedGuideIcons';

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

      <TouristHeader />

      <main className="w-full">
        {/* --- SPLINE 3D HERO SECTION --- */}
        <SplineHeroSection onLoadComplete={() => setSplineLoaded(true)} />

        {/* --- FEATURES WITH DEPTH STACKING --- */}
        <section className="w-full py-24 px-6 bg-background relative overflow-hidden">
          <div className="max-w-[120rem] mx-auto">
            <AnimatedElement className="mb-20 text-center">
              <h2 className="font-heading text-5xl md:text-7xl font-bold text-primary mb-6">
                Why Guidaroo?
              </h2>
              <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
            </AnimatedElement>

            {/* 3-Layer Depth Stacking */}
            <StaggeredDepth startDepth={0}>
              {/* Feature 1 */}
              <div className="group relative bg-white rounded-[2.5rem] p-8 md:p-12 border border-primary/5 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 mb-8">
                <div className="w-20 h-20 bg-lavenderaccent/30 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <MapPin className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-heading text-3xl font-bold text-primary mb-4">Local Expertise</h3>
                <p className="text-lg text-foreground/70 leading-relaxed mb-8">
                  Discover hidden gems and secret spots with guides who know every corner of their city intimately.
                </p>
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src="https://static.wixstatic.com/media/70fb72_4a1f8aa9b9bc4189a6ea139c23186422~mv2.png?originWidth=576&originHeight=448"
                    alt="Local guide showing a map"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    width={600}
                  />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative bg-primary text-primary-foreground rounded-[2.5rem] p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 mb-8 lg:mt-12">
                <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-heading text-3xl font-bold text-white mb-4">Verified Guides</h3>
                <p className="text-lg text-white/80 leading-relaxed mb-8">
                  Safety and quality are paramount. All our guides are carefully vetted professionals with proven track records.
                </p>
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src="https://static.wixstatic.com/media/70fb72_9bb2830dff714f429044cecd33159e5e~mv2.png?originWidth=576&originHeight=448"
                    alt="Verified guide badge"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-90"
                    width={600}
                  />
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative bg-white rounded-[2.5rem] p-8 md:p-12 border border-primary/5 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 lg:mt-24">
                <div className="w-20 h-20 bg-secondary/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <Star className="w-10 h-10 text-secondary" />
                </div>
                <h3 className="font-heading text-3xl font-bold text-primary mb-4">Unique Experiences</h3>
                <p className="text-lg text-foreground/70 leading-relaxed mb-8">
                  From culinary walks to historical deep-dives, find the perfect experience tailored to your interests.
                </p>
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src="https://static.wixstatic.com/media/70fb72_e9f6f5c902f749a9ac39dba6e66a9bed~mv2.png?originWidth=576&originHeight=448"
                    alt="Unique cultural experience"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    width={600}
                  />
                </div>
              </div>
            </StaggeredDepth>
          </div>
        </section>

        {/* --- ANIMATED GUIDE ICONS SECTION --- */}
        <section className="w-full py-20 px-6 bg-lavenderaccent/5 relative overflow-hidden">
          <ParticleField count={25} className="opacity-20" />
          <div className="max-w-[120rem] mx-auto relative z-10">
            <AnimatedElement className="mb-16 text-center">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
                What Makes Us Different
              </h2>
            </AnimatedElement>
            <AnimatedGuideIcons className="mb-12" />
          </div>
        </section>

        {/* --- HOW IT WORKS WITH PARALLAX DEPTH --- */}
        <section className="w-full py-32 px-6 bg-background relative">
          <div className="max-w-[100rem] mx-auto">
            <AnimatedElement className="mb-24">
              <h2 className="font-heading text-5xl md:text-8xl font-black text-primary opacity-10 mb-4">
                PROCESS
              </h2>
              <h3 className="font-heading text-4xl md:text-6xl font-bold text-primary -mt-12 ml-4 md:ml-12">
                How It Works
              </h3>
            </AnimatedElement>

            <div className="space-y-32">
              {/* Step 1 */}
              <div className="flex flex-col lg:flex-row items-center gap-16">
                <DepthStack depth={2} className="w-full lg:w-1/2">
                  <AnimatedElement>
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
                      <Image
                        src="https://static.wixstatic.com/media/70fb72_2321d810c7e34ee393cd0729488d7b3a~mv2.png?originWidth=768&originHeight=576"
                        alt="Browsing tours on tablet"
                        className="w-full h-full object-cover"
                        width={800}
                      />
                      <div className="absolute top-6 left-6 w-16 h-16 bg-white rounded-full flex items-center justify-center font-heading font-bold text-2xl text-primary shadow-lg">
                        01
                      </div>
                    </div>
                  </AnimatedElement>
                </DepthStack>
                <DepthStack depth={0} className="w-full lg:w-1/2 lg:pl-12">
                  <AnimatedElement threshold={0.5}>
                    <h4 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">
                      Browse Curated Tours
                    </h4>
                    <p className="text-xl text-foreground/80 leading-relaxed mb-8">
                      Explore our extensive collection of tours across various destinations. Filter by interest, duration, or activity level to find your perfect match.
                    </p>
                    <div className="flex items-center gap-4 text-secondary font-semibold">
                      <Globe className="w-6 h-6" />
                      <span>Global Destinations</span>
                    </div>
                  </AnimatedElement>
                </DepthStack>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
                <DepthStack depth={0} className="w-full lg:w-1/2 lg:pr-12 lg:text-right">
                  <AnimatedElement threshold={0.5}>
                    <h4 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">
                      Choose Your Guide
                    </h4>
                    <p className="text-xl text-foreground/80 leading-relaxed mb-8">
                      Read reviews, check credentials, and select a guide that resonates with you. Connect directly to customize your itinerary.
                    </p>
                    <div className="flex items-center gap-4 text-secondary font-semibold justify-end">
                      <span>Direct Communication</span>
                      <Users className="w-6 h-6" />
                    </div>
                  </AnimatedElement>
                </DepthStack>
                <DepthStack depth={2} className="w-full lg:w-1/2">
                  <AnimatedElement>
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl -rotate-2 hover:rotate-0 transition-transform duration-700">
                      <Image
                        src="https://static.wixstatic.com/media/70fb72_29a8b7f08d4a417e9055be9fd11c855d~mv2.png?originWidth=768&originHeight=576"
                        alt="Guide profile"
                        className="w-full h-full object-cover"
                        width={800}
                      />
                      <div className="absolute top-6 right-6 w-16 h-16 bg-white rounded-full flex items-center justify-center font-heading font-bold text-2xl text-primary shadow-lg">
                        02
                      </div>
                    </div>
                  </AnimatedElement>
                </DepthStack>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col lg:flex-row items-center gap-16">
                <DepthStack depth={2} className="w-full lg:w-1/2">
                  <AnimatedElement>
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
                      <Image
                        src="https://static.wixstatic.com/media/70fb72_b2bb50a24e9d43ba9ca52f308ca033a2~mv2.png?originWidth=768&originHeight=576"
                        alt="Happy tourists"
                        className="w-full h-full object-cover"
                        width={800}
                      />
                      <div className="absolute top-6 left-6 w-16 h-16 bg-white rounded-full flex items-center justify-center font-heading font-bold text-2xl text-primary shadow-lg">
                        03
                      </div>
                    </div>
                  </AnimatedElement>
                </DepthStack>
                <DepthStack depth={0} className="w-full lg:w-1/2 lg:pl-12">
                  <AnimatedElement threshold={0.5}>
                    <h4 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">
                      Book & Explore
                    </h4>
                    <p className="text-xl text-foreground/80 leading-relaxed mb-8">
                      Secure your spot with our easy booking system. Pack your bags and get ready for an unforgettable journey led by a local expert.
                    </p>
                    <div className="flex items-center gap-4 text-secondary font-semibold">
                      <Compass className="w-6 h-6" />
                      <span>Seamless Experience</span>
                    </div>
                  </AnimatedElement>
                </DepthStack>
              </div>
            </div>
          </div>
        </section>

        {/* --- WORLD MAP WITH ANIMATED PINS --- */}
        <section className="w-full py-32 px-6 bg-lavenderaccent/5 relative overflow-hidden">
          <div className="max-w-[120rem] mx-auto">
            <AnimatedElement className="mb-16 text-center">
              <h2 className="font-heading text-5xl md:text-7xl font-bold text-primary mb-4">
                Guides Around the World
              </h2>
              <p className="font-paragraph text-xl text-foreground max-w-2xl mx-auto">
                Connect with local experts in destinations across the globe
              </p>
            </AnimatedElement>

            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
              <Image
                src="https://static.wixstatic.com/media/70fb72_ff5a8607e1dd416abad53c0788a5ab07~mv2.png?originWidth=1280&originHeight=704"
                alt="World map with guide locations"
                className="w-full h-full object-cover"
                width={1920}
              />

              {/* Animated Map Pins */}
              <AnimatedMapPin x="15%" y="25%" label="Paris" delay={0} />
              <AnimatedMapPin x="45%" y="30%" label="Tokyo" delay={0.2} />
              <AnimatedMapPin x="25%" y="60%" label="Rio" delay={0.4} />
              <AnimatedMapPin x="70%" y="50%" label="Sydney" delay={0.6} />
              <AnimatedMapPin x="35%" y="45%" label="Bangkok" delay={0.8} />
            </div>
          </div>
        </section>

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
            <AnimatedElement>
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
            </AnimatedElement>
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
