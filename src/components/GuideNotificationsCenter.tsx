import { useState, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { Notifications } from '@/entities';

interface GuideNotificationsCenterProps {
  guideEmail: string;
}

export function GuideNotificationsCenter({ guideEmail }: GuideNotificationsCenterProps) {
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { items } = await BaseCrudService.getAll<Notifications>('notifications');
        const guideNotifications = items.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        setNotifications(guideNotifications);
        setUnreadCount(guideNotifications.filter(n => !n.isRead).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    if (guideEmail) {
      fetchNotifications();
    }
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
                <p className="font-paragraph text-foreground/70">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-secondary/10">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 hover:bg-background transition-all cursor-pointer group ${
                      !notification.isRead ? 'bg-secondary/5' : ''
                    }`}
                    onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.notificationType)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-paragraph font-semibold text-foreground text-sm">
                          {notification.notificationType}
                        </p>
                        <p className="font-paragraph text-sm text-foreground/70 mt-1 line-clamp-2">
                          {notification.message}
                        </p>

                        {notification.touristName && (
                          <p className="font-paragraph text-xs text-foreground/60 mt-2">
                            Tourist: {notification.touristName}
                          </p>
                        )}

                        {notification.bookingDate && (
                          <p className="font-paragraph text-xs text-foreground/60">
                            {new Date(notification.bookingDate).toLocaleDateString('en-IN')}
                          </p>
                        )}

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
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
