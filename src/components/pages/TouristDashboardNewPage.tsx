import { useMember } from '@/integrations';
import { TouristHeader } from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Bookings } from '@/entities';
import { useState, useEffect } from 'react';
import { Calendar, MapPin, User, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TouristDashboardNewPage() {
  const { member } = useMember();
  const [bookings, setBookings] = useState<Bookings[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { items } = await BaseCrudService.getAll<Bookings>('bookings');
        // Filter bookings for current user
        const userBookings = items.filter(b => b.touristReference === member?.loginEmail);
        setBookings(userBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (member?.loginEmail) {
      fetchBookings();
    }
  }, [member?.loginEmail]);

  return (
    <div className="min-h-screen bg-background">
      <TouristHeader />

      <main className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-heading text-5xl font-bold text-primary mb-4">
            My Bookings
          </h1>
          <p className="font-paragraph text-lg text-foreground/70 mb-12">
            Manage your tour bookings and upcoming adventures
          </p>

          {loading ? (
            <div className="text-center py-12">
              <p className="font-paragraph text-foreground">Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-primary/10">
              <p className="font-paragraph text-lg text-foreground/70 mb-6">
                You haven't booked any tours yet.
              </p>
              <a
                href="/tours"
                className="inline-block px-8 py-4 bg-primary text-primary-foreground font-paragraph text-lg rounded-full hover:bg-primary/90 transition-all"
              >
                Explore Tours
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bookings.map((booking) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      booking.bookingStatus === 'confirmed' 
                        ? 'bg-green-100 text-green-700'
                        : booking.bookingStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {booking.bookingStatus || 'Pending'}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar size={20} className="text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-paragraph text-sm text-foreground/70">Date</p>
                        <p className="font-paragraph font-semibold text-foreground">
                          {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'TBD'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <User size={20} className="text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-paragraph text-sm text-foreground/70">Guide</p>
                        <p className="font-paragraph font-semibold text-foreground">
                          {booking.guideReference || 'TBD'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <DollarSign size={20} className="text-secondary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-paragraph text-sm text-foreground/70">Total Price</p>
                        <p className="font-heading font-bold text-secondary text-lg">
                          ${booking.totalPrice || '0'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-6 px-4 py-2 bg-primary text-primary-foreground font-paragraph rounded-full hover:bg-primary/90 transition-all">
                    View Details
                  </button>
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
