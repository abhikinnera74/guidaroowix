import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Tours } from '@/entities';
import { TouristHeader } from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import { MapPin, Clock, Calendar, DollarSign, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TourDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tours | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadTour(id);
    }
  }, [id]);

  const loadTour = async (tourId: string) => {
    setLoading(true);
    const tourData = await BaseCrudService.getById<Tours>('tours', tourId);
    setTour(tourData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TouristHeader />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-paragraph text-base text-foreground">Loading tour details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-background">
        <TouristHeader />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <p className="font-paragraph text-lg text-foreground mb-6">Tour not found</p>
            <button
              onClick={() => navigate('/tours')}
              className="px-6 py-3 bg-primary text-primary-foreground font-paragraph text-base rounded-full hover:bg-primary/90 transition-all"
            >
              Back to Tours
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const includedItems = tour.whatsIncluded?.split('\n').filter(item => item.trim()) || [];

  return (
    <div className="min-h-screen bg-background">
      <TouristHeader />

      <main className="max-w-[120rem] mx-auto px-6 lg:px-12 py-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/tours')}
          className="flex items-center gap-2 font-paragraph text-base text-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Tours
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {tour.mainImage && (
              <div className="rounded-3xl overflow-hidden shadow-lg">
                <Image
                  src={tour.mainImage}
                  alt={tour.tourName || 'Tour'}
                  className="w-full aspect-[4/3] object-cover"
                  width={800}
                />
              </div>
            )}
          </motion.div>

          {/* Right Column - Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-heading text-5xl font-bold text-primary mb-6">
              {tour.tourName}
            </h1>

            <div className="space-y-4 mb-8">
              {tour.location && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-lavenderaccent rounded-full flex items-center justify-center">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-paragraph text-sm text-foreground/70">Location</p>
                    <p className="font-paragraph text-lg text-foreground font-semibold">{tour.location}</p>
                  </div>
                </div>
              )}

              {tour.durationHours && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-lavenderaccent rounded-full flex items-center justify-center">
                    <Clock size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-paragraph text-sm text-foreground/70">Duration</p>
                    <p className="font-paragraph text-lg text-foreground font-semibold">{tour.durationHours} hours</p>
                  </div>
                </div>
              )}

              {tour.nextAvailableDate && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-lavenderaccent rounded-full flex items-center justify-center">
                    <Calendar size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-paragraph text-sm text-foreground/70">Next Available</p>
                    <p className="font-paragraph text-lg text-foreground font-semibold">
                      {new Date(tour.nextAvailableDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {tour.pricePerPerson && (
              <div className="bg-secondary/10 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-paragraph text-sm text-foreground/70 mb-1">Price per person</p>
                    <div className="flex items-baseline gap-2">
                      <DollarSign size={28} className="text-secondary" />
                      <span className="font-heading text-4xl font-bold text-secondary">
                        {tour.pricePerPerson}
                      </span>
                    </div>
                  </div>
                  <button className="px-8 py-4 bg-secondary text-secondary-foreground font-paragraph text-lg rounded-full hover:bg-secondary/90 transition-all">
                    Book Now
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Description Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <h2 className="font-heading text-3xl font-bold text-primary mb-6">About This Tour</h2>
          <p className="font-paragraph text-lg text-foreground leading-relaxed max-w-4xl">
            {tour.tourDescription}
          </p>
        </motion.div>

        {/* What's Included Section */}
        {includedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="font-heading text-3xl font-bold text-primary mb-6">What's Included</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
              {includedItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-secondary flex-shrink-0 mt-1" />
                  <p className="font-paragraph text-base text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
