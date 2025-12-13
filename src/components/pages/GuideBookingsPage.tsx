import { useMember } from '@/integrations';
import { GuidePremiumHeader } from '@/components/PremiumHeader';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Bookings } from '@/entities';
import { useState, useEffect } from 'react';
import { Calendar, User, DollarSign, Clock, MapPin, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GuideBookingsPage() {
  const { member } = useMember();
  const [bookings, setBookings] = useState<Bookings[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { items } = await BaseCrudService.getAll<Bookings>('bookings');
        // Filter bookings for current guide
        const guideBookings = items.filter(b => b.guideReference === member?.loginEmail);
        setBookings(guideBookings);
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
      <GuidePremiumHeader />

      <main className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-heading text-5xl font-bold text-secondary mb-4">
            Bookings from Tourists
          </h1>
          <p className="font-paragraph text-lg text-foreground/70 mb-12">
            Manage tour bookings and tourist inquiries
          </p>

          {loading ? (
            <div className="text-center py-12">
              <p className="font-paragraph text-foreground">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-secondary/10">
              <p className="font-paragraph text-lg text-foreground/70 mb-6">
                No bookings yet. Share your tours to start receiving bookings!
              </p>
              <a
                href="/guide-my-tours"
                className="inline-block px-8 py-4 bg-secondary text-secondary-foreground font-paragraph text-lg rounded-full hover:bg-secondary/90 transition-all"
              >
                View My Tours
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bookings.map((booking) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-secondary/10 hover:shadow-lg transition-all"
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
                      <User size={20} className="text-secondary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-paragraph text-sm text-foreground/70">Tourist</p>
                        <p className="font-paragraph font-semibold text-foreground">
                          {booking.touristReference || 'Unknown'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar size={20} className="text-secondary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-paragraph text-sm text-foreground/70">Date</p>
                        <p className="font-paragraph font-semibold text-foreground">
                          {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'TBD'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock size={20} className="text-secondary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-paragraph text-sm text-foreground/70">Duration</p>
                        <p className="font-paragraph font-semibold text-foreground">
                          {booking.durationHours || 0} hours
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

                    {/* Location Section */}
                    {booking.pickupAddress && (
                      <div className="border-t border-secondary/10 pt-4">
                        <div className="flex items-start gap-3 mb-3">
                          <MapPin size={20} className="text-secondary flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <p className="font-paragraph text-sm text-foreground/70">Pickup Location</p>
                            <p className="font-paragraph font-semibold text-foreground">
                              {booking.pickupAddress}
                            </p>
                            {booking.pickupLatitude && booking.pickupLongitude && (
                              <p className="font-paragraph text-xs text-foreground/60 mt-1">
                                {booking.pickupLatitude.toFixed(4)}, {booking.pickupLongitude.toFixed(4)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Map Preview */}
                        {booking.pickupLatitude && booking.pickupLongitude && (
                          <div className="mt-3 rounded-lg overflow-hidden border border-secondary/20 h-48">
                            <iframe
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${booking.pickupLatitude},${booking.pickupLongitude}`}
                              allowFullScreen={true}
                              loading="lazy"
                            />
                          </div>
                        )}

                        {/* Navigate Button */}
                        {booking.pickupLatitude && booking.pickupLongitude && (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${booking.pickupLatitude},${booking.pickupLongitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground font-paragraph text-sm rounded-lg hover:bg-secondary/90 transition-all"
                          >
                            <Navigation size={16} />
                            Get Directions
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground font-paragraph rounded-full hover:bg-secondary/90 transition-all">
                      Accept
                    </button>
                    <button className="flex-1 px-4 py-2 border border-secondary text-secondary font-paragraph rounded-full hover:bg-secondary/10 transition-all">
                      Decline
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
