import { useEffect, useState } from 'react';
import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { Bookings, Guides } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatBox from '@/components/ChatBox';
import { Image } from '@/components/ui/image';
import { Calendar, Clock, MapPin, Trash2, CheckCircle, Clock3, AlertCircle, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TouristDashboardPage() {
  const { member } = useMember();
  const [bookings, setBookings] = useState<(Bookings & { guide?: Guides })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<(Bookings & { guide?: Guides }) | null>(null);

  useEffect(() => {
    loadBookings();
  }, [member]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const { items } = await BaseCrudService.getAll<Bookings>('bookings');
      
      // Filter bookings for current user
      const userBookings = items.filter(
        booking => booking.touristReference === member?.loginEmail
      );

      // Load guide details for each booking
      const bookingsWithGuides = await Promise.all(
        userBookings.map(async (booking) => {
          if (booking.guideReference) {
            const guide = await BaseCrudService.getById<Guides>('guides', booking.guideReference);
            return { ...booking, guide };
          }
          return booking;
        })
      );

      setBookings(bookingsWithGuides);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await BaseCrudService.update<Bookings>('bookings', {
        _id: bookingId,
        bookingStatus: 'Cancelled',
      });
      loadBookings();
      alert('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    }
  };

  const getFilteredBookings = () => {
    if (filter === 'all') return bookings;
    return bookings.filter(b => {
      if (filter === 'confirmed') return b.bookingStatus === 'Confirmed';
      if (filter === 'pending') return b.bookingStatus === 'Pending';
      if (filter === 'cancelled') return b.bookingStatus === 'Cancelled';
      return true;
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle size={18} />;
      case 'Pending':
        return <Clock3 size={18} />;
      case 'Cancelled':
        return <AlertCircle size={18} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-paragraph text-base text-foreground">Loading your bookings...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredBookings = getFilteredBookings();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-heading text-5xl font-bold text-primary mb-2">My Bookings</h1>
          <p className="font-paragraph text-lg text-foreground/70">
            Manage your tour bookings and reservations
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-4 mb-8 flex-wrap"
        >
          {(['all', 'confirmed', 'pending', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-3 rounded-full font-paragraph text-base font-semibold transition-all ${
                filter === tab
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white border border-primary/20 text-foreground hover:border-primary'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab !== 'all' && ` (${bookings.filter(b => {
                if (tab === 'confirmed') return b.bookingStatus === 'Confirmed';
                if (tab === 'pending') return b.bookingStatus === 'Pending';
                if (tab === 'cancelled') return b.bookingStatus === 'Cancelled';
                return false;
              }).length})`}
            </button>
          ))}
        </motion.div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl border border-primary/10"
          >
            <Calendar size={48} className="text-primary/30 mx-auto mb-4" />
            <p className="font-paragraph text-lg text-foreground">
              {bookings.length === 0
                ? 'No bookings yet. Start exploring guides!'
                : 'No bookings match this filter.'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-primary/10 hover:shadow-lg transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {/* Guide Info */}
                  <div className="md:col-span-1">
                    {booking.guide?.profilePicture ? (
                      <div className="rounded-xl overflow-hidden mb-4">
                        <Image
                          src={booking.guide.profilePicture}
                          alt={booking.guide.fullName || 'Guide'}
                          className="w-full aspect-square object-cover"
                          width={200}
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-square bg-lavenderaccent rounded-xl flex items-center justify-center mb-4">
                        <span className="font-heading text-4xl text-primary/30">
                          {booking.guide?.fullName?.charAt(0) || 'G'}
                        </span>
                      </div>
                    )}
                    <h3 className="font-heading text-lg font-bold text-primary">
                      {booking.guide?.fullName || 'Unknown Guide'}
                    </h3>
                    {booking.guide?.specialty && (
                      <p className="font-paragraph text-sm text-secondary">
                        {booking.guide.specialty}
                      </p>
                    )}
                  </div>

                  {/* Booking Details */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar size={20} className="text-secondary" />
                      <div>
                        <p className="font-paragraph text-sm text-foreground/70">Date</p>
                        <p className="font-heading text-base font-semibold text-foreground">
                          {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock size={20} className="text-secondary" />
                      <div>
                        <p className="font-paragraph text-sm text-foreground/70">Time</p>
                        <p className="font-heading text-base font-semibold text-foreground">
                          {booking.bookingTime || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {booking.guide?.city && (
                      <div className="flex items-center gap-3">
                        <MapPin size={20} className="text-secondary" />
                        <div>
                          <p className="font-paragraph text-sm text-foreground/70">Location</p>
                          <p className="font-heading text-base font-semibold text-foreground">
                            {booking.guide.city}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status and Price */}
                  <div className="md:col-span-1 flex flex-col justify-between">
                    <div>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.bookingStatus)}`}>
                        {getStatusIcon(booking.bookingStatus)}
                        {booking.bookingStatus || 'Unknown'}
                      </div>
                    </div>

                    <div>
                      <p className="font-paragraph text-sm text-foreground/70 mb-1">Total Price</p>
                      <p className="font-heading text-3xl font-bold text-secondary">
                        ₹{booking.totalPrice?.toLocaleString('en-IN') || '0'}
                      </p>
                      <p className="font-paragraph text-xs text-foreground/70 mt-1">
                        {booking.durationHours} hour{booking.durationHours !== 1 ? 's' : ''}
                      </p>
                      {booking.paymentMethod && (
                        <p className="font-paragraph text-xs text-foreground/70 mt-2">
                          <span className="font-semibold">Payment:</span> {booking.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Card Payment'}
                        </p>
                      )}
                    </div>

                    {booking.bookingStatus !== 'Cancelled' && (
                      <div className="flex flex-col gap-2 mt-4">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setChatOpen(true);
                          }}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 justify-center font-paragraph text-sm font-semibold"
                        >
                          <MessageCircle size={16} />
                          Message Guide
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2 justify-center font-paragraph text-sm font-semibold"
                        >
                          <Trash2 size={16} />
                          Cancel Booking
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Chat Box */}
      {selectedBooking && (
        <ChatBox
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          bookingId={selectedBooking._id}
          otherUserEmail={selectedBooking.guide?.email || ''}
          otherUserName={selectedBooking.guide?.fullName || 'Guide'}
          userType="tourist"
        />
      )}

      <Footer />
    </div>
  );
}
