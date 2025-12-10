import { useMember } from '@/integrations';
import { GuideHeader } from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Tours } from '@/entities';
import { Image } from '@/components/ui/image';
import { useState, useEffect } from 'react';
import { Calendar, MapPin, DollarSign, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GuideMyToursPage() {
  const { member } = useMember();
  const [tours, setTours] = useState<Tours[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const { items } = await BaseCrudService.getAll<Tours>('tours');
        setTours(items);
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <GuideHeader />

      <main className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-heading text-5xl font-bold text-secondary mb-4">
            My Tours
          </h1>
          <p className="font-paragraph text-lg text-foreground/70 mb-12">
            Manage your tour offerings and availability
          </p>

          {loading ? (
            <div className="text-center py-12">
              <p className="font-paragraph text-foreground">Loading tours...</p>
            </div>
          ) : tours.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-secondary/10">
              <p className="font-paragraph text-lg text-foreground/70 mb-6">
                You haven't created any tours yet.
              </p>
              <button className="inline-block px-8 py-4 bg-secondary text-secondary-foreground font-paragraph text-lg rounded-full hover:bg-secondary/90 transition-all">
                Create Your First Tour
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.map((tour) => (
                <motion.div
                  key={tour._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-secondary/10 hover:shadow-lg transition-all group"
                >
                  {tour.mainImage && (
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={tour.mainImage}
                        alt={tour.tourName || 'Tour'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        width={400}
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="font-heading text-xl font-bold text-secondary mb-2">
                      {tour.tourName}
                    </h3>

                    {tour.tourDescription && (
                      <p className="font-paragraph text-sm text-foreground/70 mb-4 line-clamp-2">
                        {tour.tourDescription}
                      </p>
                    )}

                    <div className="space-y-3 mb-6">
                      {tour.location && (
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-secondary flex-shrink-0" />
                          <span className="font-paragraph text-sm text-foreground">
                            {tour.location}
                          </span>
                        </div>
                      )}

                      {tour.durationHours && (
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-secondary flex-shrink-0" />
                          <span className="font-paragraph text-sm text-foreground">
                            {tour.durationHours} hours
                          </span>
                        </div>
                      )}

                      {tour.pricePerPerson && (
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-secondary flex-shrink-0" />
                          <span className="font-heading font-bold text-secondary">
                            ${tour.pricePerPerson}/person
                          </span>
                        </div>
                      )}

                      {tour.nextAvailableDate && (
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-secondary flex-shrink-0" />
                          <span className="font-paragraph text-sm text-foreground">
                            Next: {new Date(tour.nextAvailableDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground font-paragraph rounded-full hover:bg-secondary/90 transition-all">
                      Edit Tour
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
