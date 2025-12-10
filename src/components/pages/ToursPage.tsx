import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Tours } from '@/entities';
import { TouristHeader } from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import { MapPin, Clock, Calendar, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ToursPage() {
  const [tours, setTours] = useState<Tours[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    setLoading(true);
    const { items } = await BaseCrudService.getAll<Tours>('tours');
    setTours(items);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TouristHeader />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-paragraph text-base text-foreground">Loading tours...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TouristHeader />

      <main className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        {/* Page Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-6xl font-bold text-primary mb-6"
          >
            Explore Tours
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-paragraph text-xl text-foreground max-w-3xl mx-auto"
          >
            Discover unforgettable experiences with our expert local guides
          </motion.p>
        </div>

        {/* Tours Grid */}
        {tours.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-paragraph text-lg text-foreground">No tours available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour, index) => (
              <motion.div
                key={tour._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/tours/${tour._id}`} className="group block">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-primary/10 hover:shadow-lg transition-all">
                    {/* Tour Image */}
                    {tour.mainImage && (
                      <div className="aspect-[4/3] overflow-hidden">
                        <Image
                          src={tour.mainImage}
                          alt={tour.tourName || 'Tour'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          width={600}
                        />
                      </div>
                    )}

                    {/* Tour Details */}
                    <div className="p-6">
                      <h3 className="font-heading text-2xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
                        {tour.tourName}
                      </h3>
                      
                      <p className="font-paragraph text-base text-foreground mb-4 line-clamp-2">
                        {tour.tourDescription}
                      </p>

                      <div className="space-y-2 mb-4">
                        {tour.location && (
                          <div className="flex items-center gap-2 text-foreground">
                            <MapPin size={16} className="text-secondary" />
                            <span className="font-paragraph text-sm">{tour.location}</span>
                          </div>
                        )}
                        
                        {tour.durationHours && (
                          <div className="flex items-center gap-2 text-foreground">
                            <Clock size={16} className="text-secondary" />
                            <span className="font-paragraph text-sm">{tour.durationHours} hours</span>
                          </div>
                        )}
                        
                        {tour.nextAvailableDate && (
                          <div className="flex items-center gap-2 text-foreground">
                            <Calendar size={16} className="text-secondary" />
                            <span className="font-paragraph text-sm">
                              {new Date(tour.nextAvailableDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {tour.pricePerPerson && (
                        <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                          <div className="flex items-center gap-2">
                            <DollarSign size={20} className="text-primary" />
                            <span className="font-heading text-2xl font-bold text-primary">
                              {tour.pricePerPerson}
                            </span>
                            <span className="font-paragraph text-sm text-foreground">per person</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
