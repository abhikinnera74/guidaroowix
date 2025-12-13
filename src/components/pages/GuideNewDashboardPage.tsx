import { useMember } from '@/integrations';
import { GuidePremiumHeader } from '@/components/PremiumHeader';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Bookings, Notifications, Tourists } from '@/entities';
import { useState, useEffect } from 'react';
import { Calendar, MapPin, User, DollarSign, Clock, Bell, CheckCircle, AlertCircle, TrendingUp, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GuideNewDashboardPage() {
  const { member } = useMember();
  const [bookings, setBookings] = useState<Bookings[]>([]);
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const [tourists, setTourists] = useState<{ [key: string]: Tourists }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch bookings for this guide
        const { items: bookingItems } = await BaseCrudService.getAll<Bookings>('bookings');
        const guideBookings = bookingItems.filter(b => b.guideReference === member?.loginEmail);
        setBookings(guideBookings);

        // Fetch notifications
        const { items: notificationItems } = await BaseCrudService.getAll<Notifications>('notifications');
        setNotifications(notificationItems);

        // Fetch tourists
        const { items: touristItems } = await BaseCrudService.getAll<Tourists>('tourists');
        const touristMap: { [key: string]: Tourists } = {};
        touristItems.forEach(tourist => {
          if (tourist.email) {
            touristMap[tourist.email] = tourist;
          }
        });
        setTourists(touristMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (member?.loginEmail) {
      fetchData();
    }
  }, [member?.loginEmail]);

  const pendingBookings = bookings.filter(b => b.bookingStatus === 'Pending');
  const confirmedBookings = bookings.filter(b => b.bookingStatus === 'Confirmed');
  const totalEarnings = confirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      await BaseCrudService.update('bookings', {
        _id: bookingId,
        bookingStatus: 'Confirmed',
      });
      setBookings(bookings.map(b => 
        b._id === bookingId ? { ...b, bookingStatus: 'Confirmed' } : b
      ));
    } catch (error) {
      console.error('Error accepting booking:', error);
    }
  };

  const handleDeclineBooking = async (bookingId: string) => {
    try {
      await BaseCrudService.update('bookings', {
        _id: bookingId,
        bookingStatus: 'Declined',
      });
      setBookings(bookings.map(b => 
        b._id === bookingId ? { ...b, bookingStatus: 'Declined' } : b
      ));
    } catch (error) {
      console.error('Error declining booking:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <GuidePremiumHeader />

      <main className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-heading text-5xl font-bold text-secondary mb-4">
              Guide Dashboard
            </h1>
            <p className="font-paragraph text-lg text-foreground/70">
              Manage your bookings, earnings, and tourist inquiries
            </p>
          </div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {/* Pending Bookings */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-secondary/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-sm text-foreground/70 mb-2">Pending Requests</p>
                  <p className="font-heading text-4xl font-bold text-secondary">{pendingBookings.length}</p>
                </div>
                <AlertCircle size={32} className="text-secondary/20" />
              </div>
            </div>

            {/* Confirmed Bookings */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-secondary/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-sm text-foreground/70 mb-2">Active Bookings</p>
                  <p className="font-heading text-4xl font-bold text-green-600">{confirmedBookings.length}</p>
                </div>
                <CheckCircle size={32} className="text-green-600/20" />
              </div>
            </div>

            {/* Total Earnings */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-secondary/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-sm text-foreground/70 mb-2">Total Earnings</p>
                  <p className="font-heading text-3xl font-bold text-secondary">
                    ₹{totalEarnings.toLocaleString('en-IN')}
                  </p>
                </div>
                <TrendingUp size={32} className="text-secondary/20" />
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-secondary/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-sm text-foreground/70 mb-2">Notifications</p>
                  <p className="font-heading text-4xl font-bold text-secondary">{notifications.length}</p>
                </div>
                <Bell size={32} className="text-secondary/20" />
              </div>
            </div>
          </motion.div>

          {/* Notifications Section */}
          {notifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="font-heading text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
                <Bell size={28} />
                Recent Notifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {notifications.slice(0, 4).map((notif, index) => (
                  <motion.div
                    key={notif._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-secondary/10 flex items-start gap-3"
                  >
                    <div className="flex-shrink-0">
                      {notif.notificationType === 'Booking Accepted' ? (
                        <CheckCircle size={24} className="text-green-600" />
                      ) : (
                        <Bell size={24} className="text-secondary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-heading text-sm font-bold text-secondary">{notif.notificationType}</p>
                      <p className="font-paragraph text-sm text-foreground">{notif.message}</p>
                      {notif.createdAt && (
                        <p className="font-paragraph text-xs text-foreground/50 mt-1">
                          {new Date(notif.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Pending Booking Requests */}
          {pendingBookings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="font-heading text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
                <AlertCircle size={28} />
                Pending Booking Requests
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {pendingBookings.map((booking, index) => (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-secondary/10 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <User size={20} className="text-secondary flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-paragraph text-sm text-foreground/70">Tourist</p>
                          <p className="font-paragraph font-semibold text-foreground">
                            {tourists[booking.touristReference!]?.firstName || booking.touristReference || 'Unknown'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar size={20} className="text-secondary flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-paragraph text-sm text-foreground/70">Date</p>
                          <p className="font-paragraph font-semibold text-foreground">
                            {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-IN') : 'TBD'}
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
                            ₹{booking.totalPrice?.toLocaleString('en-IN') || '0'}
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

                          {/* Navigate to Tourist Button */}
                          {booking.pickupLatitude && booking.pickupLongitude && (
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${booking.pickupLatitude},${booking.pickupLongitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground font-paragraph text-sm rounded-lg hover:bg-secondary/90 transition-all"
                            >
                              <Navigation size={16} />
                              Navigate to Tourist
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => handleAcceptBooking(booking._id)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white font-paragraph rounded-full hover:bg-green-700 transition-all"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDeclineBooking(booking._id)}
                        className="flex-1 px-4 py-2 border border-secondary text-secondary font-paragraph rounded-full hover:bg-secondary/10 transition-all"
                      >
                        Decline
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Active Bookings */}
          {confirmedBookings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="font-heading text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
                <CheckCircle size={28} />
                Active Bookings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {confirmedBookings.map((booking, index) => (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-secondary/10 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                        Confirmed
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <User size={20} className="text-secondary flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-paragraph text-sm text-foreground/70">Tourist</p>
                          <p className="font-paragraph font-semibold text-foreground">
                            {tourists[booking.touristReference!]?.firstName || booking.touristReference || 'Unknown'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar size={20} className="text-secondary flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-paragraph text-sm text-foreground/70">Date</p>
                          <p className="font-paragraph font-semibold text-foreground">
                            {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-IN') : 'TBD'}
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
                            ₹{booking.totalPrice?.toLocaleString('en-IN') || '0'}
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

                          {/* Navigate to Tourist Button */}
                          {booking.pickupLatitude && booking.pickupLongitude && (
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${booking.pickupLatitude},${booking.pickupLongitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground font-paragraph text-sm rounded-lg hover:bg-secondary/90 transition-all"
                            >
                              <Navigation size={16} />
                              Navigate to Tourist
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {loading ? (
            <div className="text-center py-12">
              <p className="font-paragraph text-foreground">Loading your dashboard...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-secondary/10">
              <p className="font-paragraph text-lg text-foreground/70 mb-6">
                No bookings yet. Share your tours to start receiving booking requests!
              </p>
              <a
                href="/guide-my-tours"
                className="inline-block px-8 py-4 bg-secondary text-secondary-foreground font-paragraph text-lg rounded-full hover:bg-secondary/90 transition-all"
              >
                Manage My Tours
              </a>
            </div>
          ) : null}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
