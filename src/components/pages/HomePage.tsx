// HPI 1.6-V
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMember } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import { ArrowRight, MapPin, Users, Star, Globe, Compass, Shield } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// --- 1. UTILITIES & HELPERS ---

// Mandatory AnimatedElement for scroll reveals
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
        observer.unobserve(element); // Stop observing after reveal
      }
    }, { threshold });

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return <div ref={ref} className={`opacity-0 translate-y-8 transition-all duration-1000 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0 ${className || ''}`}>{children}</div>;
};

// Custom Hook for Parallax
const useParallax = (distance: number = 50) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  return { ref, y };
};

// --- 2. MAIN COMPONENT ---

export default function HomePage() {
  // --- DATA FIDELITY PROTOCOL ---
  // 1. Identify: useMember is the source of auth state.
  // 2. Canonize: isAuthenticated is the canonical state.
  const { isAuthenticated } = useMember();
  // 3. Preserve: Logic for buttons is preserved in the render.
  // 4. Utilize: Used in Hero and CTA sections.

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-background font-paragraph overflow-clip selection:bg-lavenderaccent selection:text-primary">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
        style={{ scaleX }}
      />

      <Header />

      <main className="w-full">
        {/* --- HERO SECTION --- */}
        {/* Inspired by the "Countdown" image: Massive typography, clean layout, sticker motif */}
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
          
          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lavenderaccent/30 rounded-full blur-3xl mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }} />
             <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-secondary/10 rounded-full blur-3xl mix-blend-multiply" />
          </div>

          <div className="relative z-10 text-center max-w-[100rem] mx-auto">
            {/* Top Label */}
            <AnimatedElement className="mb-6">
              <span className="inline-block py-2 px-6 rounded-full border border-primary/20 bg-white/50 backdrop-blur-sm text-primary font-medium tracking-widest text-sm uppercase">
                Curated Global Adventures
              </span>
            </AnimatedElement>

            {/* Massive Typography */}
            <div className="relative mb-12">
              <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="font-heading text-[12vw] leading-[0.85] font-black text-primary tracking-tighter"
              >
                DISCOVER
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/80">
                  THE WORLD
                </span>
              </motion.h1>

              {/* "Sticker" Motif from Inspiration Image */}
              <motion.div 
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 12 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 15 }}
                className="absolute -bottom-8 right-[10%] md:right-[20%] w-32 h-32 md:w-48 md:h-48 bg-lavenderaccent rounded-full flex items-center justify-center shadow-xl z-20 hidden md:flex"
              >
                <div className="text-center transform -rotate-12">
                  <span className="block font-heading font-bold text-primary text-lg md:text-2xl leading-none">Start</span>
                  <span className="block font-paragraph text-primary/80 text-sm md:text-base italic">Your Journey</span>
                </div>
              </motion.div>
            </div>

            {/* Subtitle & CTA */}
            <div className="flex flex-col items-center gap-10 max-w-2xl mx-auto">
              <AnimatedElement className="delay-300">
                <p className="text-xl md:text-2xl text-foreground/80 font-light leading-relaxed text-balance">
                  Connect with expert local guides and experience authentic adventures that go beyond the guidebook.
                </p>
              </AnimatedElement>

              <AnimatedElement className="delay-500">
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {isAuthenticated ? (
                    <>
                      <Link to="/tours" className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-full overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/25">
                        <span className="relative z-10 flex items-center gap-2 font-semibold text-lg">
                          Explore Tours <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </span>
                        <div className="absolute inset-0 bg-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out" />
                      </Link>
                      <Link to="/guide-dashboard" className="px-8 py-4 bg-transparent border-2 border-primary text-primary font-semibold text-lg rounded-full hover:bg-primary/5 transition-colors">
                        Guide Dashboard
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/tours" className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-full overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/25">
                        <span className="relative z-10 flex items-center gap-2 font-semibold text-lg">
                          Explore Tours <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </span>
                        <div className="absolute inset-0 bg-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out" />
                      </Link>
                      <Link to="/login" className="px-8 py-4 bg-transparent border-2 border-primary text-primary font-semibold text-lg rounded-full hover:bg-primary/5 transition-colors">
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
              </AnimatedElement>
            </div>
          </div>
        </section>

        {/* --- VISUAL BREATHER / HERO IMAGE --- */}
        <section className="w-full h-[80vh] px-4 md:px-8 pb-20">
          <div className="w-full h-full rounded-[2rem] overflow-hidden relative shadow-2xl">
            <div className="absolute inset-0 bg-black/20 z-10" />
            <Image 
              src="https://static.wixstatic.com/media/70fb72_ff5a8607e1dd416abad53c0788a5ab07~mv2.png?originWidth=1280&originHeight=704"
              alt="Breathtaking landscape view"
              className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[2s] ease-out"
              width={1920}
            />
            <div className="absolute bottom-12 left-12 z-20 text-white max-w-xl">
              <p className="font-heading text-3xl md:text-5xl font-bold leading-tight">
                "The world is a book and those who do not travel read only one page."
              </p>
            </div>
          </div>
        </section>

        {/* --- STICKY FEATURES SECTION --- */}
        {/* A "Living" section where cards stack on top of each other */}
        <section className="w-full py-24 px-6 bg-background relative">
          <div className="max-w-[120rem] mx-auto">
            <AnimatedElement className="mb-20 text-center">
              <h2 className="font-heading text-5xl md:text-7xl font-bold text-primary mb-6">Why Guidaroo?</h2>
              <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
            </AnimatedElement>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group relative bg-white rounded-[2.5rem] p-8 md:p-12 border border-primary/5 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
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
              <div className="group relative bg-primary text-primary-foreground rounded-[2.5rem] p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 lg:mt-12">
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
            </div>
          </div>
        </section>

        {/* --- HOW IT WORKS (ZIG ZAG LAYOUT) --- */}
        <section className="w-full py-32 px-6 bg-lavenderaccent/10">
          <div className="max-w-[100rem] mx-auto">
            <AnimatedElement className="mb-24">
              <h2 className="font-heading text-5xl md:text-8xl font-black text-primary opacity-10 mb-4">PROCESS</h2>
              <h3 className="font-heading text-4xl md:text-6xl font-bold text-primary -mt-12 ml-4 md:ml-12">How It Works</h3>
            </AnimatedElement>

            <div className="space-y-32">
              {/* Step 1 */}
              <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="w-full lg:w-1/2">
                  <AnimatedElement>
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
                      <Image 
                        src="https://static.wixstatic.com/media/70fb72_2321d810c7e34ee393cd0729488d7b3a~mv2.png?originWidth=768&originHeight=576"
                        alt="Browsing tours on tablet"
                        className="w-full h-full object-cover"
                        width={800}
                      />
                      <div className="absolute top-6 left-6 w-16 h-16 bg-white rounded-full flex items-center justify-center font-heading font-bold text-2xl text-primary shadow-lg">01</div>
                    </div>
                  </AnimatedElement>
                </div>
                <div className="w-full lg:w-1/2 lg:pl-12">
                  <AnimatedElement threshold={0.5}>
                    <h4 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">Browse Curated Tours</h4>
                    <p className="text-xl text-foreground/80 leading-relaxed mb-8">
                      Explore our extensive collection of tours across various destinations. Filter by interest, duration, or activity level to find your perfect match.
                    </p>
                    <div className="flex items-center gap-4 text-secondary font-semibold">
                      <Globe className="w-6 h-6" />
                      <span>Global Destinations</span>
                    </div>
                  </AnimatedElement>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
                <div className="w-full lg:w-1/2 lg:pr-12 lg:text-right">
                  <AnimatedElement threshold={0.5}>
                    <h4 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">Choose Your Guide</h4>
                    <p className="text-xl text-foreground/80 leading-relaxed mb-8">
                      Read reviews, check credentials, and select a guide that resonates with you. Connect directly to customize your itinerary.
                    </p>
                    <div className="flex items-center gap-4 text-secondary font-semibold justify-end">
                      <span>Direct Communication</span>
                      <Users className="w-6 h-6" />
                    </div>
                  </AnimatedElement>
                </div>
                <div className="w-full lg:w-1/2">
                  <AnimatedElement>
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl -rotate-2 hover:rotate-0 transition-transform duration-700">
                      <Image 
                        src="https://static.wixstatic.com/media/70fb72_29a8b7f08d4a417e9055be9fd11c855d~mv2.png?originWidth=768&originHeight=576"
                        alt="Guide profile"
                        className="w-full h-full object-cover"
                        width={800}
                      />
                      <div className="absolute top-6 right-6 w-16 h-16 bg-white rounded-full flex items-center justify-center font-heading font-bold text-2xl text-primary shadow-lg">02</div>
                    </div>
                  </AnimatedElement>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="w-full lg:w-1/2">
                  <AnimatedElement>
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
                      <Image 
                        src="https://static.wixstatic.com/media/70fb72_b2bb50a24e9d43ba9ca52f308ca033a2~mv2.png?originWidth=768&originHeight=576"
                        alt="Happy tourists"
                        className="w-full h-full object-cover"
                        width={800}
                      />
                      <div className="absolute top-6 left-6 w-16 h-16 bg-white rounded-full flex items-center justify-center font-heading font-bold text-2xl text-primary shadow-lg">03</div>
                    </div>
                  </AnimatedElement>
                </div>
                <div className="w-full lg:w-1/2 lg:pl-12">
                  <AnimatedElement threshold={0.5}>
                    <h4 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">Book & Explore</h4>
                    <p className="text-xl text-foreground/80 leading-relaxed mb-8">
                      Secure your spot with our easy booking system. Pack your bags and get ready for an unforgettable journey led by a local expert.
                    </p>
                    <div className="flex items-center gap-4 text-secondary font-semibold">
                      <Compass className="w-6 h-6" />
                      <span>Seamless Experience</span>
                    </div>
                  </AnimatedElement>
                </div>
              </div>
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

      <Footer />
    </div>
  );
}