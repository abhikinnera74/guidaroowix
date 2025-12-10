import { useEffect, useState } from 'react';
import { useMember } from '@/integrations';
import { useNavigate } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Bookings, Guides, Notifications, Tourists } from '@/entities';
import { GuideHeader } from '@/components/Header';
import Footer from '@/components/Footer';
import ChatBox from '@/components/ChatBox';
import { Image } from '@/components/ui/image';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Clock3, Bell, Trash2, AlertCircle, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GuideDashboardPage() {
  const { member } = useMember();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<Guides | null>(null);
  const [bookings, setBookings] = useState<(Bookings & { tourist?: Tourists })[]>([]);
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<(Bookings & { tourist?: Tourists }) | null>(null);

  useEffect(() => {
    loadGuideData();
  }, [member]);

  const loadGuideData = async () => {
    setLoading(true);
    try {
      // Get guide profile
      const { items: guides } = await BaseCrudService.getAll<Guides>('guides');
      const userGuide = guides.find(g => g.email === member?.loginEmail);
      setGuide(userGuide || null);

      // If guide doesn't exist, redirect to onboarding
      if (!userGuide) {
        navigate('/guide-onboarding');
        return;
      }

      // Get bookings for this guide with tourist details
      const { items: allBookings } = await BaseCrudService.getAll<Bookings>('bookings');
      const guideBookings = allBookings.filter(b => b.guideReference === userGuide._id);
      
      // Load tourist details for each booking
      const bookingsWithTourists = await Promise.all(
        guideBookings.map(async (booking) => {
          if (booking.touristReference) {
            const { items: tourists } = await BaseCrudService.getAll<Tourists>('tourists');
            const tourist = tourists.find(t => t.email === booking.touristReference);
            return { ...booking, tourist };
          }
          return booking;
        })
      );
      
      setBookings(bookingsWithTourists);

      // Get notifications for this guide
      const { items: allNotifications } = await BaseCrudService.getAll<Notifications>('notifications');
      setNotifications(allNotifications);
    } catch (error) {
      console.error('Error loading guide data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingStatus = async (bookingId: string, status: 'Confirmed' | 'Cancelled') => {
    try {
      await BaseCrudService.update<Bookings>('bookings', {
        _id: bookingId,
        bookingStatus: status,
      });
      loadGuideData();
      alert(`Booking ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking');
    }
  };

  const handleMarkNotificationRead = async (notificationId: string) => {
    try {
      await BaseCrudService.update<Notifications>('notifications', {
        _id: notificationId,
        isRead: true,
      });
      loadGuideData();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await BaseCrudService.delete('notifications', notificationId);
      loadGuideData();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getFilteredBookings = () => {
    if (filter === 'all') return bookings;
    return bookings.filter(b => {
      if (filter === 'pending') return b.bookingStatus === 'Pending';
      if (filter === 'confirmed') return b.bookingStatus === 'Confirmed';
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
        return <XCircle size={18} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <GuideHeader />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-paragraph text-base text-foreground">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const filteredBookings = getFilteredBookings();

  return (
    <div className="min-h-screen bg-background">
      <GuideHeader />

      <main className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-heading text-5xl font-bold text-primary mb-2">Guide Dashboard</h1>
          <p className="font-paragraph text-lg text-foreground/70">
            Manage your bookings and tour requests
          </p>
          {guide && !guide.isVerified && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-heading text-sm font-bold text-yellow-900">Pending Verification</p>
                <p className="font-paragraph text-sm text-yellow-800">
                  Your profile is under review. You'll be notified once it's verified and approved.
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10">
            <p className="font-paragraph text-sm text-foreground/70 mb-2">Total Bookings</p>
            <p className="font-heading text-4xl font-bold text-primary">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10">
            <p className="font-paragraph text-sm text-foreground/70 mb-2">Confirmed</p>
            <p className="font-heading text-4xl font-bold text-green-600">
              {bookings.filter(b => b.bookingStatus === 'Confirmed').length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10">
            <p className="font-paragraph text-sm text-foreground/70 mb-2">Pending</p>
            <p className="font-heading text-4xl font-bold text-yellow-600">
              {bookings.filter(b => b.bookingStatus === 'Pending').length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10">
            <p className="font-paragraph text-sm text-foreground/70 mb-2">Notifications</p>
            <p className="font-heading text-4xl font-bold text-secondary">
              {unreadNotifications.length}
            </p>
          </div>
        </motion.div>

        {/* Notifications Section */}
        {unreadNotifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="font-heading text-2xl font-bold text-primary mb-6 flex items-center gap-2">
              <Bell size={24} />
              Recent Notifications
            </h2>
            <div className="space-y-4">
              {unreadNotifications.map((notification, index) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-lavenderaccent/20 border border-primary/20 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-heading text-lg font-bold text-primary mb-2">
                        {notification.notificationType}
                      </h3>
                      <p className="font-paragraph text-base text-foreground mb-2">
                        {notification.message}
                      </p>
                      {notification.touristName && (
                        <p className="font-paragraph text-sm text-foreground/70">
                          From: <span className="font-semibold">{notification.touristName}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMarkNotificationRead(notification._id)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-paragraph text-sm font-semibold"
                      >
                        Mark Read
                      </button>
                      <button
                        onClick={() => handleDeleteNotification(notification._id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 mb-8 flex-wrap"
        >
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((tab) => (
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
                if (tab === 'pending') return b.bookingStatus === 'Pending';
                if (tab === 'confirmed') return b.bookingStatus === 'Confirmed';
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
                ? 'No bookings yet. Promote your profile to get started!'
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Booking Details */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <p className="font-heading text-2xl font-bold text-primary mb-2">
                        {booking.touristReference || 'Unknown Tourist'}
                      </p>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.bookingStatus)}`}>
                        {getStatusIcon(booking.bookingStatus)}
                        {booking.bookingStatus || 'Unknown'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
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
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin size={20} className="text-secondary" />
                      <div>
                        <p className="font-paragraph text-sm text-foreground/70">Duration</p>
                        <p className="font-heading text-base font-semibold text-foreground">
                          {booking.durationHours} hour{booking.durationHours !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="md:col-span-1 flex flex-col justify-between">
                    <div>
                      <p className="font-paragraph text-sm text-foreground/70 mb-1">Total Price</p>
                      <p className="font-heading text-3xl font-bold text-secondary">
                        ₹{booking.totalPrice?.toLocaleString('en-IN') || '0'}
                      </p>
                    </div>

                    {booking.bookingStatus === 'Pending' && (
                      <div className="flex flex-col gap-3 mt-6">
                        <button
                          onClick={() => handleBookingStatus(booking._id, 'Confirmed')}
                          className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 justify-center font-paragraph text-sm font-semibold"
                        >
                          <CheckCircle size={18} />
                          Accept Booking
                        </button>
                        <button
                          onClick={() => handleBookingStatus(booking._id, 'Cancelled')}
                          className="px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2 justify-center font-paragraph text-sm font-semibold"
                        >
                          <XCircle size={18} />
                          Decline Booking
                        </button>
                      </div>
                    )}
                    {booking.bookingStatus !== 'Cancelled' && (
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setChatOpen(true);
                        }}
                        className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 justify-center font-paragraph text-sm font-semibold mt-3"
                      >
                        <MessageCircle size={18} />
                        Message Tourist
                      </button>
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
          otherUserEmail={selectedBooking.touristReference || ''}
          otherUserName={selectedBooking.tourist?.firstName || 'Tourist'}
          userType="guide"
        />
      )}

      <Footer />
    </div>
  );
}
