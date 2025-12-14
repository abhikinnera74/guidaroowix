import { useMember } from '@/integrations';
import { GuidePremiumHeader } from '@/components/PremiumHeader';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Bookings, Notifications, Tourists, Guides } from '@/entities';
import { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, User, DollarSign, Clock, Bell, CheckCircle, AlertCircle, TrendingUp, Navigation, Phone, AlertTriangle, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { BookingMapPreview } from '@/components/BookingMapPreview';
import { GuideAvailabilityCalendar } from '@/components/GuideAvailabilityCalendar';
import { GuideEarningsSection } from '@/components/GuideEarningsSection';
import { GuideReviewsSection } from '@/components/GuideReviewsSection';
import { GuideNotificationsCenter } from '@/components/GuideNotificationsCenter';
import { MessagingPanel } from '@/components/MessagingPanel';

export default function GuideNewDashboardPage() {
  const { member } = useMember();
  const [bookings, setBookings] = useState<Bookings[]>([]);
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const [tourists, setTourists] = useState<{ [key: string]: Tourists }>({});
  const [guideData, setGuideData] = useState<Guides | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'availability' | 'earnings' | 'reviews'>('overview');
  const [messagingOpen, setMessagingOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<{ email: string; name: string; bookingId?: string } | null>(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollRef = useRef(0);

  // Handle scroll for header hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const scrollDelta = currentScroll - lastScrollRef.current;

      // Hide header when scrolling down more than 50px
      if (scrollDelta > 50 && headerVisible) {
        setHeaderVisible(false);
      }
      // Show header when scrolling up more than 50px
      else if (scrollDelta < -50 && !headerVisible) {
        setHeaderVisible(true);
      }

      lastScrollRef.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerVisible]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch guide data
        const { items: guides } = await BaseCrudService.getAll<Guides>('guides');
        const guide = guides.find(g => g.email === member?.loginEmail || g.memberEmail === member?.loginEmail);
        setGuideData(guide || null);
        setShowVerificationAlert(guide && !guide.isVerified);

        // Fetch bookings for this guide using member email
        const { items: bookingItems } = await BaseCrudService.getAll<Bookings>('bookings');
        const guideBookings = bookingItems.filter(b => 
          b.guideMemberEmail === member?.loginEmail || b.guideReference === member?.loginEmail
        );
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
          if (tourist.memberEmail) {
            touristMap[tourist.memberEmail] = tourist;
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

  const handleOpenMessaging = (touristEmail: string, touristName: string, bookingId?: string) => {
    setSelectedConversation({ email: touristEmail, name: touristName, bookingId });
    setMessagingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 1. TOP NAVIGATION BAR - Sticky with Hide/Show Animation */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: headerVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="sticky top-0 z-40 bg-background"
      >
        <GuidePremiumHeader />
      </motion.div>

      {/* 2. MAIN CONTENT - Vertical Flow Container */}
      <main className="flex-1 w-full">
        {/* 3. STATUS/VERIFICATION BANNER */}
        {showVerificationAlert && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full bg-yellow-50 border-b border-yellow-200"
          >
            <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-6">
              <div className="flex items-start gap-3">
                <AlertTriangle size={24} className="text-yellow-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="font-heading font-bold text-yellow-900 mb-1">Profile Verification Pending</p>
                  <p className="font-paragraph text-sm text-yellow-800 mb-3">
                    Your profile is under review. You'll receive an email once it's verified and approved.
                  </p>
                  <a
                    href="/guide-profile"
                    className="inline-block px-4 py-2 bg-yellow-600 text-white font-paragraph text-sm rounded-lg hover:bg-yellow-700 transition-all"
                  >
                    View Profile
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 4. PAGE TITLE & DESCRIPTION */}
        <div className="w-full">
          <div className="max-w-[120rem] mx-auto px-6 lg:px-12 pt-8 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex-1">
                <h1 className="font-heading text-4xl sm:text-5xl font-bold text-secondary mb-3">
                  Guide Dashboard
                </h1>
                <p className="font-paragraph text-base sm:text-lg text-foreground/70">
                  Manage your bookings, earnings, and tourist inquiries
                </p>
              </div>
              {member?.loginEmail && (
                <div className="flex-shrink-0">
                  <GuideNotificationsCenter guideEmail={member.loginEmail} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5. TAB NAVIGATION */}
        <div className="w-full border-b border-secondary/10">
          <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
            <div className="flex gap-2 overflow-x-auto">
              {(['overview', 'availability', 'earnings', 'reviews'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-paragraph font-semibold text-sm whitespace-nowrap border-b-2 transition-all ${
                    activeTab === tab
                      ? 'border-secondary text-secondary'
                      : 'border-transparent text-foreground/70 hover:text-foreground'
                  }`}
                >
                  {tab === 'overview' ? 'Overview' : tab === 'availability' ? 'Availability' : tab === 'earnings' ? 'Earnings' : 'Reviews'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 6. DASHBOARD SUMMARY CARDS */}
        <div className="w-full">
          <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {/* Pending Bookings */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-secondary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-paragraph text-sm text-foreground/70 mb-2">Pending Requests</p>
                    <p className="font-heading text-4xl font-bold text-secondary">{bookings.filter(b => b.bookingStatus === 'Pending').length}</p>
                  </div>
                  <AlertCircle size={32} className="text-secondary/20" />
                </div>
              </div>

              {/* Confirmed Bookings */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-secondary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-paragraph text-sm text-foreground/70 mb-2">Active Bookings</p>
                    <p className="font-heading text-4xl font-bold text-green-600">{bookings.filter(b => b.bookingStatus === 'Confirmed').length}</p>
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
                      ₹{bookings.filter(b => b.bookingStatus === 'Confirmed').reduce((sum, b) => sum + (b.totalPrice || 0), 0).toLocaleString('en-IN')}
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
          </div>
        </div>

        {/* 7. TAB CONTENT SECTIONS */}
        <div className="w-full">
          <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-8">
            {/* Overview Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Notifications Section */}
                {notifications.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                  >
                    <h2 className="font-heading text-2xl font-bold text-secondary flex items-center gap-2">
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
                {bookings.filter(b => b.bookingStatus === 'Pending').length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="font-heading text-2xl font-bold text-secondary flex items-center gap-2">
                      <AlertCircle size={28} />
                      Pending Booking Requests
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {bookings.filter(b => b.bookingStatus === 'Pending').map((booking, index) => (
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
                                  {tourists[booking.touristReference!]?.firstName || tourists[booking.touristMemberEmail!]?.firstName || booking.touristReference || 'Unknown'}
                                </p>
                                {(tourists[booking.touristReference!]?.phoneNumber || tourists[booking.touristMemberEmail!]?.phoneNumber) && (
                                  <p className="font-paragraph text-xs text-foreground/60 mt-1 flex items-center gap-1">
                                    <Phone size={12} />
                                    {tourists[booking.touristReference!]?.phoneNumber || tourists[booking.touristMemberEmail!]?.phoneNumber}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Calendar size={20} className="text-secondary flex-shrink-0 mt-1" />
                              <div>
                                <p className="font-paragraph text-sm text-foreground/70">Date & Time</p>
                                <p className="font-paragraph font-semibold text-foreground">
                                  {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-IN') : 'TBD'}
                                </p>
                                {booking.bookingTime && (
                                  <p className="font-paragraph text-xs text-foreground/60 mt-1">
                                    {booking.bookingTime}
                                  </p>
                                )}
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

                            {/* Location Section with Map */}
                            {booking.pickupAddress && (
                              <div className="border-t border-secondary/10 pt-4">
                                <div className="flex items-start gap-3 mb-4">
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
                                  <div className="mb-4">
                                    <BookingMapPreview
                                      latitude={booking.pickupLatitude}
                                      longitude={booking.pickupLongitude}
                                      address={booking.pickupAddress}
                                      height="h-48"
                                    />
                                  </div>
                                )}

                                {/* Navigate to Tourist Button */}
                                {booking.pickupLatitude && booking.pickupLongitude && (
                                  <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${booking.pickupLatitude},${booking.pickupLongitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground font-paragraph text-sm rounded-lg hover:bg-secondary/90 transition-all"
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
                              onClick={() => handleOpenMessaging(
                                booking.touristMemberEmail || booking.touristReference || '',
                                tourists[booking.touristReference!]?.firstName || tourists[booking.touristMemberEmail!]?.firstName || 'Tourist',
                                booking._id
                              )}
                              className="flex-1 px-4 py-2 bg-secondary text-white font-paragraph rounded-full hover:bg-secondary/90 transition-all flex items-center justify-center gap-2"
                            >
                              <MessageCircle size={16} />
                              Message
                            </button>
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
                {bookings.filter(b => b.bookingStatus === 'Confirmed').length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6"
                  >
                    <h2 className="font-heading text-2xl font-bold text-secondary flex items-center gap-2">
                      <CheckCircle size={28} />
                      Active Bookings
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {bookings.filter(b => b.bookingStatus === 'Confirmed').map((booking, index) => (
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
                                  {tourists[booking.touristReference!]?.firstName || tourists[booking.touristMemberEmail!]?.firstName || booking.touristReference || 'Unknown'}
                                </p>
                                {(tourists[booking.touristReference!]?.phoneNumber || tourists[booking.touristMemberEmail!]?.phoneNumber) && (
                                  <p className="font-paragraph text-xs text-foreground/60 mt-1 flex items-center gap-1">
                                    <Phone size={12} />
                                    {tourists[booking.touristReference!]?.phoneNumber || tourists[booking.touristMemberEmail!]?.phoneNumber}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Calendar size={20} className="text-secondary flex-shrink-0 mt-1" />
                              <div>
                                <p className="font-paragraph text-sm text-foreground/70">Date & Time</p>
                                <p className="font-paragraph font-semibold text-foreground">
                                  {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-IN') : 'TBD'}
                                </p>
                                {booking.bookingTime && (
                                  <p className="font-paragraph text-xs text-foreground/60 mt-1">
                                    {booking.bookingTime}
                                  </p>
                                )}
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

                            {/* Location Section with Map */}
                            {booking.pickupAddress && (
                              <div className="border-t border-secondary/10 pt-4">
                                <div className="flex items-start gap-3 mb-4">
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
                                  <div className="mb-4">
                                    <BookingMapPreview
                                      latitude={booking.pickupLatitude}
                                      longitude={booking.pickupLongitude}
                                      address={booking.pickupAddress}
                                      height="h-48"
                                    />
                                  </div>
                                )}

                                {/* Navigate to Tourist Button */}
                                {booking.pickupLatitude && booking.pickupLongitude && (
                                  <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${booking.pickupLatitude},${booking.pickupLongitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground font-paragraph text-sm rounded-lg hover:bg-secondary/90 transition-all"
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
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === 'availability' && guideData && (
              <GuideAvailabilityCalendar guideId={guideData._id} />
            )}

            {/* Earnings Tab */}
            {activeTab === 'earnings' && member?.loginEmail && (
              <GuideEarningsSection guideEmail={member.loginEmail} />
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && guideData && (
              <GuideReviewsSection guideName={guideData.fullName || ''} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Messaging Panel */}
      {selectedConversation && (
        <MessagingPanel
          isOpen={messagingOpen}
          onClose={() => {
            setMessagingOpen(false);
            setSelectedConversation(null);
          }}
          guideEmail={member?.loginEmail || ''}
          bookingId={selectedConversation.bookingId}
          touristEmail={selectedConversation.email}
          touristName={selectedConversation.name}
        />
      )}
    </div>
  );
}
