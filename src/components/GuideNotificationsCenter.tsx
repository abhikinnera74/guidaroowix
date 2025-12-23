import { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, AlertCircle, CheckCircle2, MapPin, Phone, Clock, DollarSign, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { Notifications, Bookings } from '@/entities';

interface GuideNotificationsCenterProps {
  guideEmail: string;
  onBookingAction?: (bookingId: string, action: 'accept' | 'decline') => void;
}

export function GuideNotificationsCenter({ guideEmail, onBookingAction }: GuideNotificationsCenterProps) {
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<{ [key: string]: Bookings }>({});
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchNotifications = async () => {
    try {
      const { items } = await BaseCrudService.getAll<Notifications>('notifications');
      const guideNotifications = items
        .filter(n => n.notificationType === 'New Booking') // Only show new booking notifications
        .sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
      setNotifications(guideNotifications);
      setUnreadCount(guideNotifications.filter(n => !n.isRead).length);

      // Fetch booking details for each notification
      const { items: bookings } = await BaseCrudService.getAll<Bookings>('bookings');
      const bookingMap: { [key: string]: Bookings } = {};
      bookings.forEach(booking => {
        bookingMap[booking._id] = booking;
      });
      setBookingDetails(bookingMap);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (guideEmail) {
      fetchNotifications();
      // Poll for new notifications every 3 seconds
      pollIntervalRef.current = setInterval(fetchNotifications, 3000);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [guideEmail]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await BaseCrudService.update('notifications', {
        _id: notificationId,
        isRead: true,
      });

      setNotifications(notifications.map(n =>
        n._id === notificationId ? { ...n, isRead: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleAcceptBooking = async (notificationId: string, bookingId: string) => {
    try {
      // Update booking status
      await BaseCrudService.update('bookings', {
        _id: bookingId,
        bookingStatus: 'Confirmed',
      });

      // Mark notification as read
      await handleMarkAsRead(notificationId);

      // Call parent callback if provided
      if (onBookingAction) {
        onBookingAction(bookingId, 'accept');
      }

      // Refresh notifications
      await fetchNotifications();
    } catch (error) {
      console.error('Error accepting booking:', error);
      alert('Failed to accept booking. Please try again.');
    }
  };

  const handleDeclineBooking = async (notificationId: string, bookingId: string) => {
    try {
      // Update booking status
      await BaseCrudService.update('bookings', {
        _id: bookingId,
        bookingStatus: 'Declined',
      });

      // Mark notification as read
      await handleMarkAsRead(notificationId);

      // Call parent callback if provided
      if (onBookingAction) {
        onBookingAction(bookingId, 'decline');
      }

      // Refresh notifications
      await fetchNotifications();
    } catch (error) {
      console.error('Error declining booking:', error);
      alert('Failed to decline booking. Please try again.');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      await Promise.all(
        unreadNotifications.map(n =>
          BaseCrudService.update('notifications', {
            _id: n._id,
            isRead: true,
          })
        )
      );

      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await BaseCrudService.delete('notifications', notificationId);
      setNotifications(notifications.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'Booking Accepted':
        return <CheckCircle2 size={20} className="text-green-600" />;
      case 'Booking Declined':
        return <AlertCircle size={20} className="text-red-600" />;
      default:
        return <Bell size={20} className="text-secondary" />;
    }
  };

  const navigateToLocation = (latitude: number, longitude: number) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-secondary hover:bg-secondary/10 rounded-full transition-all"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-secondary/10 z-50 max-h-96 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-secondary/10 p-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h3 className="font-heading font-bold text-secondary">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="font-paragraph text-xs text-foreground/70">
                    {unreadCount} unread
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleMarkAllAsRead}
                    className="p-1 text-secondary hover:bg-secondary/10 rounded transition-all"
                    title="Mark all as read"
                  >
                    <Check size={18} />
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-foreground/70 hover:bg-foreground/10 rounded transition-all"
                >
                  <X size={18} />
                </motion.button>
              </div>
            </div>

            {/* Notifications List */}
            {loading ? (
              <div className="p-8 text-center">
                <p className="font-paragraph text-foreground/70">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={32} className="text-secondary/20 mx-auto mb-2" />
                <p className="font-paragraph text-foreground/70">No new bookings</p>
              </div>
            ) : (
              <div className="divide-y divide-secondary/10">
                {notifications.map((notification, index) => {
                  // Find the booking ID from the notification message or use a default
                  const bookingId = Object.keys(bookingDetails).find(
                    id => bookingDetails[id]?.bookingDate === notification.bookingDate
                  );
                  const booking = bookingId ? bookingDetails[bookingId] : null;

                  return (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 hover:bg-background transition-all group ${
                        !notification.isRead ? 'bg-secondary/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.notificationType)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-paragraph font-semibold text-foreground text-sm">
                            {notification.notificationType}
                          </p>
                          <p className="font-paragraph text-sm text-foreground/70 mt-1">
                            {notification.message}
                          </p>

                          {/* Booking Details */}
                          <div className="mt-3 space-y-2 bg-background rounded-lg p-3">
                            {notification.touristName && (
                              <div className="flex items-center gap-2">
                                <User size={16} className="text-secondary flex-shrink-0" />
                                <span className="font-paragraph text-xs text-foreground">
                                  {notification.touristName}
                                </span>
                              </div>
                            )}

                            {notification.bookingDate && (
                              <div className="flex items-center gap-2">
                                <Clock size={16} className="text-secondary flex-shrink-0" />
                                <span className="font-paragraph text-xs text-foreground">
                                  {new Date(notification.bookingDate).toLocaleDateString('en-IN')}
                                </span>
                              </div>
                            )}

                            {notification.bookingDuration && (
                              <div className="flex items-center gap-2">
                                <Clock size={16} className="text-secondary flex-shrink-0" />
                                <span className="font-paragraph text-xs text-foreground">
                                  {notification.bookingDuration} hour{notification.bookingDuration !== 1 ? 's' : ''}
                                </span>
                              </div>
                            )}

                            {notification.bookingPrice && (
                              <div className="flex items-center gap-2">
                                <DollarSign size={16} className="text-secondary flex-shrink-0" />
                                <span className="font-paragraph text-xs font-semibold text-secondary">
                                  ₹{notification.bookingPrice.toLocaleString('en-IN')}
                                </span>
                              </div>
                            )}

                            {booking?.pickupAddress && (
                              <div className="flex items-start gap-2">
                                <MapPin size={16} className="text-secondary flex-shrink-0 mt-0.5" />
                                <span className="font-paragraph text-xs text-foreground">
                                  {booking.pickupAddress}
                                </span>
                              </div>
                            )}
                          </div>

                          <p className="font-paragraph text-xs text-foreground/50 mt-2">
                            {new Date(notification.createdAt || 0).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>

                        {!notification.isRead && (
                          <div className="flex-shrink-0 w-2 h-2 bg-secondary rounded-full mt-2" />
                        )}

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification._id);
                          }}
                          className="flex-shrink-0 p-1 text-foreground/50 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X size={16} />
                        </motion.button>
                      </div>

                      {/* Action Buttons */}
                      {booking && booking.bookingStatus === 'Pending' && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-secondary/10">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAcceptBooking(notification._id, booking._id)}
                            className="flex-1 px-3 py-2 bg-green-600 text-white font-paragraph text-xs rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 size={14} />
                            Accept
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleDeclineBooking(notification._id, booking._id)}
                            className="flex-1 px-3 py-2 border border-red-600 text-red-600 font-paragraph text-xs rounded-lg hover:bg-red-50 transition-all"
                          >
                            Decline
                          </motion.button>

                          {booking.pickupLatitude && booking.pickupLongitude && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => navigateToLocation(booking.pickupLatitude!, booking.pickupLongitude!)}
                              className="flex-1 px-3 py-2 bg-secondary text-white font-paragraph text-xs rounded-lg hover:bg-secondary/90 transition-all flex items-center justify-center gap-1"
                              title="Navigate to tourist location"
                            >
                              <MapPin size={14} />
                              Navigate
                            </motion.button>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
