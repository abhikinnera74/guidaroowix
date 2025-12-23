import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, DollarSign, User, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { Bookings } from '@/entities';
import { BookingMapPreview } from '@/components/BookingMapPreview';

interface BookingNotificationModalProps {
  isOpen: boolean;
  booking: Bookings | null;
  touristName?: string;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
  isLoading?: boolean;
}

export function BookingNotificationModal({
  isOpen,
  booking,
  touristName,
  onClose,
  onAccept,
  onDecline,
  isLoading = false,
}: BookingNotificationModalProps) {
  if (!booking) return null;

  const handleNavigate = () => {
    if (booking.pickupLatitude && booking.pickupLongitude) {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${booking.pickupLatitude},${booking.pickupLongitude}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-secondary to-secondary/80 text-white p-6 flex items-center justify-between rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl font-bold">New Booking Request</h2>
                    <p className="font-paragraph text-sm text-white/80">Review and confirm this booking</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-all"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* Tourist Info */}
                <div className="bg-background rounded-2xl p-6 border border-secondary/10">
                  <h3 className="font-heading text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                    <User size={20} />
                    Tourist Information
                  </h3>
                  <p className="font-paragraph text-foreground">
                    <span className="font-semibold">Name:</span> {touristName || 'Unknown'}
                  </p>
                </div>

                {/* Booking Details */}
                <div className="bg-background rounded-2xl p-6 border border-secondary/10">
                  <h3 className="font-heading text-lg font-bold text-secondary mb-4">Booking Details</h3>
                  <div className="space-y-4">
                    {/* Date & Time */}
                    <div className="flex items-start gap-4">
                      <Clock size={20} className="text-secondary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-paragraph text-sm text-foreground/70">Date & Time</p>
                        <p className="font-paragraph font-semibold text-foreground">
                          {booking.bookingDate
                            ? new Date(booking.bookingDate).toLocaleDateString('en-IN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                            : 'TBD'}
                        </p>
                        {booking.bookingTime && (
                          <p className="font-paragraph text-sm text-foreground/70 mt-1">
                            Time: {booking.bookingTime}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-start gap-4">
                      <Clock size={20} className="text-secondary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-paragraph text-sm text-foreground/70">Duration</p>
                        <p className="font-paragraph font-semibold text-foreground">
                          {booking.durationHours} hour{booking.durationHours !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-start gap-4">
                      <DollarSign size={20} className="text-secondary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-paragraph text-sm text-foreground/70">Total Price</p>
                        <p className="font-heading text-2xl font-bold text-secondary">
                          ₹{booking.totalPrice?.toLocaleString('en-IN') || '0'}
                        </p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    {booking.paymentMethod && (
                      <div className="flex items-start gap-4">
                        <DollarSign size={20} className="text-secondary flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-paragraph text-sm text-foreground/70">Payment Method</p>
                          <p className="font-paragraph font-semibold text-foreground">
                            {booking.paymentMethod === 'cash'
                              ? 'Cash on Delivery'
                              : booking.paymentMethod === 'card'
                              ? 'Card Payment'
                              : 'UPI Payment'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location */}
                {booking.pickupAddress && (
                  <div className="bg-background rounded-2xl p-6 border border-secondary/10">
                    <h3 className="font-heading text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                      <MapPin size={20} />
                      Pickup Location
                    </h3>
                    <p className="font-paragraph text-foreground mb-4">{booking.pickupAddress}</p>

                    {booking.pickupLatitude && booking.pickupLongitude && (
                      <>
                        <BookingMapPreview
                          latitude={booking.pickupLatitude}
                          longitude={booking.pickupLongitude}
                          address={booking.pickupAddress}
                          height="h-64"
                        />
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleNavigate}
                          className="w-full mt-4 px-6 py-3 bg-secondary text-white font-paragraph font-semibold rounded-xl hover:bg-secondary/90 transition-all flex items-center justify-center gap-2"
                        >
                          <MapPin size={18} />
                          Open in Google Maps
                        </motion.button>
                      </>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-secondary/10">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onDecline}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 border-2 border-red-600 text-red-600 font-paragraph font-semibold rounded-xl hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Decline Booking
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onAccept}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-green-600 text-white font-paragraph font-semibold rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    {isLoading ? 'Processing...' : 'Accept Booking'}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
