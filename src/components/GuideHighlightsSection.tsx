import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { Star, MapPin, Award } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Guides } from '@/entities';

interface GuideCardProps {
  guide: Guides;
  index: number;
}

const GuideCard: React.FC<GuideCardProps> = ({ guide, index }) => {
  return (
    <motion.a
      href={`/guide/${guide._id}`}
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-lavenderaccent/10 to-primary/10">
        {guide.profilePicture ? (
          <Image
            src={guide.profilePicture}
            alt={guide.fullName || 'Guide'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            width={400}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-lavenderaccent/20 to-primary/20">
            <div className="text-center">
              <div className="text-5xl mb-2">👤</div>
              <p className="text-primary/60 font-paragraph text-sm">No photo</p>
            </div>
          </div>
        )}

        {/* Verification Badge */}
        {guide.isVerified && (
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
            viewport={{ once: true }}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg"
          >
            <Award className="w-5 h-5 text-secondary fill-secondary" />
          </motion.div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Name */}
        <h3 className="font-heading text-xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors duration-300">
          {guide.fullName || 'Guide'}
        </h3>

        {/* Specialty */}
        {guide.specialty && (
          <p className="font-paragraph text-sm text-secondary mb-4 font-medium">
            {guide.specialty}
          </p>
        )}

        {/* Location */}
        {guide.city && (
          <div className="flex items-center gap-2 text-foreground/70 mb-4">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-paragraph text-sm">{guide.city}</span>
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center justify-between pt-4 border-t border-primary/10">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-secondary fill-secondary" />
            <span className="font-heading font-bold text-primary">
              {guide.averageRating?.toFixed(1) || 'N/A'}
            </span>
          </div>

          {/* Hourly Rate */}
          {guide.hourlyRate && (
            <span className="font-heading font-bold text-secondary">
              ${guide.hourlyRate}/hr
            </span>
          )}
        </div>

        {/* Experience */}
        {guide.yearsOfExperience && (
          <p className="font-paragraph text-xs text-foreground/60 mt-3">
            {guide.yearsOfExperience} years of experience
          </p>
        )}
      </div>
    </motion.a>
  );
};

export function GuideHighlightsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [guides, setGuides] = useState<Guides[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const { items } = await BaseCrudService.getAll<Guides>('guides');
        setGuides(items || []);
      } catch (error) {
        console.error('Error fetching guides:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuides();
  }, []);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [guides]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (isLoading) {
    return (
      <section className="w-full py-24 px-6 bg-white relative overflow-hidden">
        <div className="max-w-[120rem] mx-auto">
          <div className="text-center">
            <p className="font-paragraph text-lg text-foreground/70">Loading guides...</p>
          </div>
        </div>
      </section>
    );
  }

  if (guides.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-24 px-6 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-lavenderaccent/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-[120rem] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="font-heading text-5xl md:text-6xl font-bold text-primary mb-6">
            Guide Highlights
          </h2>
          <p className="font-paragraph text-xl text-foreground/70 max-w-2xl mx-auto">
            Meet our top-rated guides ready to show you the world
          </p>
        </motion.div>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          {/* Scroll Buttons */}
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 -ml-6"
              aria-label="Scroll left"
            >
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
          )}

          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 -mr-6"
              aria-label="Scroll right"
            >
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          )}

          {/* Guides Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4 px-2"
            style={{ scrollBehavior: 'smooth' }}
          >
            {guides.slice(0, 8).map((guide, index) => (
              <GuideCard key={guide._id} guide={guide} index={index} />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="/find-guide"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-paragraph font-semibold text-lg rounded-full hover:bg-primary/90 transition-all duration-300 hover:shadow-lg"
          >
            Explore All Guides
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
