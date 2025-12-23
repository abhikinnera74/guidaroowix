import { useMember } from '@/integrations';
import { TouristPremiumHeader } from '@/components/PremiumHeader';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Bookings, Guides, Notifications } from '@/entities';
import { useState, useEffect } from 'react';
import { Calendar, MapPin, User, DollarSign, BookOpen, TrendingUp, MessageCircle, Bell, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ChatBox from '@/components/ChatBox';

export default function TouristDashboardNewPage() {
  const { member } = useMember();
  const [bookings, setBookings] = useState<Bookings[]>([]);
  const [guides, setGuides] = useState<{ [key: string]: Guides }>({});
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedGuideEmail, setSelectedGuideEmail] = useState<string>('');
  const [selectedGuideName, setSelectedGuideName] = useState<string>('');
  const [floatingChatOpen, setFloatingChatOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch bookings
        const { items: bookingItems } = await BaseCrudService.getAll<Bookings>('bookings');
        const userBookings = bookingItems.filter(b => b.touristReference === member?.loginEmail);
        setBookings(userBookings);

        // Fetch guides
        const { items: guideItems } = await BaseCrudService.getAll<Guides>('guides');
        const guideMap: { [key: string]: Guides } = {};
        guideItems.forEach(guide => {
          guideMap[guide._id] = guide;
        });
        setGuides(guideMap);

        // Fetch notifications for this user
        const { items: notificationItems } = await BaseCrudService.getAll<Notifications>('notifications');
        setNotifications(notificationItems);
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

  const handleOpenChat = (bookingId: string, guideEmail: string, guideName: string) => {
    setSelectedBookingId(bookingId);
    setSelectedGuideEmail(guideEmail);
    setSelectedGuideName(guideName);
    setFloatingChatOpen(true);
  };

  const getBookingNotifications = (bookingId: string) => {
    return notifications.filter(n => {
      // Check if notification is related to this booking
      const bookingNotif = bookingId.includes(n.message) || n.message.includes(bookingId);
      return bookingNotif;
    });
  };

  const hasAcceptedNotification = (bookingId: string) => {
    return notifications.some(n => 
      n.notificationType === 'Booking Accepted' && n.message.includes(bookingId)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <TouristPremiumHeader />

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

          {/* Notifications Section */}
          {notifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-12"
            >
              <h2 className="font-heading text-2xl font-bold text-primary mb-6 flex items-center gap-2">
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
                    className="bg-white rounded-xl p-4 shadow-sm border border-primary/10 flex items-start gap-3"
                  >
                    <div className="flex-shrink-0">
                      {notif.notificationType === 'Booking Accepted' ? (
                        <CheckCircle size={24} className="text-green-600" />
                      ) : (
                        <Bell size={24} className="text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-heading text-sm font-bold text-primary">{notif.notificationType}</p>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-sm text-foreground/70 mb-2">Total Bookings</p>
                  <p className="font-heading text-4xl font-bold text-primary">{bookings.length}</p>
                </div>
                <BookOpen size={32} className="text-primary/20" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-sm text-foreground/70 mb-2">Confirmed</p>
                  <p className="font-heading text-4xl font-bold text-green-600">
                    {bookings.filter(b => b.bookingStatus === 'Confirmed').length}
                  </p>
                </div>
                <TrendingUp size={32} className="text-green-600/20" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-sm text-foreground/70 mb-2">Total Spent</p>
                  <p className="font-heading text-3xl font-bold text-secondary">
                    ₹{bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <DollarSign size={32} className="text-secondary/20" />
              </div>
            </div>
          </motion.div>

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
                href="/find-guide"
                className="inline-block px-8 py-4 bg-primary text-primary-foreground font-paragraph text-lg rounded-full hover:bg-primary/90 transition-all"
              >
                Find a Guide
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      booking.bookingStatus === 'Confirmed' 
                        ? 'bg-green-100 text-green-700'
                        : booking.bookingStatus === 'Pending'
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
                          {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-IN') : 'TBD'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <User size={20} className="text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-paragraph text-sm text-foreground/70">Guide</p>
                        <p className="font-paragraph font-semibold text-foreground">
                          {guides[booking.guideReference]?.fullName || booking.guideReference || 'TBD'}
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

                    {booking.paymentMethod && (
                      <div className="flex items-start gap-3">
                        <MapPin size={20} className="text-secondary flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-paragraph text-sm text-foreground/70">Payment Method</p>
                          <p className="font-paragraph font-semibold text-foreground">
                            {booking.paymentMethod === 'cash' ? 'Cash on Delivery' : booking.paymentMethod === 'card' ? 'Card Payment' : 'UPI Payment'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={() => handleOpenChat(
                        booking._id, 
                        guides[booking.guideReference]?.email || '', 
                        guides[booking.guideReference]?.fullName || 'Guide'
                      )}
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground font-paragraph rounded-full hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={18} />
                      Message
                    </button>
                    <button className="flex-1 px-4 py-2 border border-primary text-primary font-paragraph rounded-full hover:bg-primary/10 transition-all">
                      Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {/* Chat Box - Floating */}
      {selectedBookingId && (
        <ChatBox
          bookingId={selectedBookingId}
          otherUserEmail={selectedGuideEmail}
          otherUserName={selectedGuideName}
          userType="tourist"
          isOpen={floatingChatOpen}
          onClose={() => setFloatingChatOpen(!floatingChatOpen)}
          isFloating={true}
        />
      )}

      <Footer />
    </div>
  );
}
