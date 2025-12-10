import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Guides, Bookings, Notifications } from '@/entities';
import { useMember } from '@/integrations';
import { TouristHeader } from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import { ArrowLeft, Calendar, Clock, Users, CreditCard, Banknote } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { member, isAuthenticated } = useMember();
  const [guide, setGuide] = useState<Guides | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: 1,
    paymentMethod: 'cash', // 'card' or 'cash'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (id) {
      loadGuide(id);
    }
  }, [id, isAuthenticated, navigate]);

  const loadGuide = async (guideId: string) => {
    setLoading(true);
    const guideData = await BaseCrudService.getById<Guides>('guides', guideId);
    setGuide(guideData);
    setLoading(false);
  };

  const calculateTotal = () => {
    return (guide?.hourlyRate || 0) * bookingData.duration;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guide || !member) return;

    setIsSubmitting(true);

    try {
      // Create booking
      const bookingId = crypto.randomUUID();
      await BaseCrudService.create('bookings', {
        _id: bookingId,
        bookingDate: bookingData.date,
        bookingTime: bookingData.time,
        durationHours: bookingData.duration,
        totalPrice: calculateTotal(),
        guideReference: guide._id,
        touristReference: member.loginEmail || 'tourist',
        bookingStatus: 'Pending',
        paymentMethod: bookingData.paymentMethod,
      });

      // Create notification for guide
      await BaseCrudService.create('notifications', {
        _id: crypto.randomUUID(),
        notificationType: 'New Booking',
        message: `New booking from ${member.contact?.firstName || 'Tourist'} ${member.contact?.lastName || ''}`,
        isRead: false,
        createdAt: new Date(),
        touristName: `${member.contact?.firstName || ''} ${member.contact?.lastName || ''}`,
        bookingDate: bookingData.date,
        bookingTime: bookingData.time,
        bookingDuration: bookingData.duration,
        bookingPrice: calculateTotal(),
      });

      // Show success message and redirect
      alert(`Booking confirmed! Payment method: ${bookingData.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Card Payment'}. The guide will receive a notification.`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TouristHeader />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-paragraph text-base text-foreground">Loading booking page...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-background">
        <TouristHeader />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <p className="font-paragraph text-lg text-foreground mb-6">Guide not found</p>
            <button
              onClick={() => navigate('/find-guide')}
              className="px-6 py-3 bg-primary text-primary-foreground font-paragraph text-base rounded-full hover:bg-primary/90 transition-all"
            >
              Back to Guides
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TouristHeader />

      <main className="max-w-[120rem] mx-auto px-6 lg:px-12 py-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(`/guide/${guide._id}`)}
          className="flex items-center gap-2 font-paragraph text-base text-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Guide Profile
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Guide Summary */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-primary/10 sticky top-24">
              {/* Guide Info */}
              {guide.profilePicture && (
                <div className="rounded-xl overflow-hidden mb-6">
                  <Image
                    src={guide.profilePicture}
                    alt={guide.fullName || 'Guide'}
                    className="w-full aspect-square object-cover"
                    width={400}
                  />
                </div>
              )}

              <h2 className="font-heading text-2xl font-bold text-primary mb-2">
                {guide.fullName}
              </h2>

              {guide.specialty && (
                <p className="font-paragraph text-base text-secondary mb-4">
                  {guide.specialty}
                </p>
              )}

              <div className="space-y-3 pb-6 border-b border-primary/10 mb-6">
                {guide.city && (
                  <p className="font-paragraph text-sm text-foreground">
                    <span className="font-semibold">Location:</span> {guide.city}
                  </p>
                )}
                {guide.languagesSpoken && (
                  <p className="font-paragraph text-sm text-foreground">
                    <span className="font-semibold">Languages:</span> {guide.languagesSpoken}
                  </p>
                )}
              </div>

              {/* Price Info */}
              <div className="mb-6">
                <p className="font-paragraph text-sm text-foreground/70 mb-2">Hourly Rate</p>
                <p className="font-heading text-3xl font-bold text-secondary">
                  ₹{guide.hourlyRate || 0}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-primary/10 mb-8">
              <h1 className="font-heading text-4xl font-bold text-primary mb-8">
                Book Your Session
              </h1>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Date Selection */}
                <div>
                  <Label htmlFor="date" className="font-paragraph text-sm font-semibold text-foreground mb-3 block">
                    <Calendar size={18} className="inline mr-2" />
                    Select Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    required
                    className="font-paragraph text-base"
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <Label htmlFor="time" className="font-paragraph text-sm font-semibold text-foreground mb-3 block">
                    <Clock size={18} className="inline mr-2" />
                    Select Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={bookingData.time}
                    onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                    required
                    className="font-paragraph text-base"
                  />
                </div>

                {/* Duration Selection */}
                <div>
                  <Label htmlFor="duration" className="font-paragraph text-sm font-semibold text-foreground mb-3 block">
                    <Users size={18} className="inline mr-2" />
                    Duration (Hours)
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      max="12"
                      value={bookingData.duration}
                      onChange={(e) => setBookingData({ ...bookingData, duration: Number(e.target.value) })}
                      required
                      className="font-paragraph text-base flex-1"
                    />
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map(hours => (
                        <button
                          key={hours}
                          type="button"
                          onClick={() => setBookingData({ ...bookingData, duration: hours })}
                          className={`px-4 py-2 rounded-lg font-paragraph text-sm transition-all ${
                            bookingData.duration === hours
                              ? 'bg-primary text-primary-foreground'
                              : 'border border-primary/20 text-foreground hover:border-primary'
                          }`}
                        >
                          {hours}h
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-lavenderaccent/30 rounded-xl p-6">
                  <h3 className="font-heading text-xl font-bold text-primary mb-4">Price Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-paragraph text-base text-foreground">
                        ₹{guide.hourlyRate || 0} × {bookingData.duration} hour{bookingData.duration !== 1 ? 's' : ''}
                      </span>
                      <span className="font-paragraph text-base text-foreground">
                        ₹{(guide.hourlyRate || 0) * bookingData.duration}
                      </span>
                    </div>
                    <div className="border-t border-primary/20 pt-3 flex justify-between items-center">
                      <span className="font-heading text-lg font-bold text-primary">Total</span>
                      <span className="font-heading text-3xl font-bold text-secondary">
                        ₹{calculateTotal()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div>
                  <Label className="font-paragraph text-sm font-semibold text-foreground mb-4 block">
                    Payment Method
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Cash on Delivery */}
                    <motion.button
                      type="button"
                      onClick={() => setBookingData({ ...bookingData, paymentMethod: 'cash' })}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        bookingData.paymentMethod === 'cash'
                          ? 'border-secondary bg-secondary/10'
                          : 'border-primary/20 hover:border-primary/40'
                      }`}
                    >
                      <Banknote size={24} className={`mx-auto mb-2 ${bookingData.paymentMethod === 'cash' ? 'text-secondary' : 'text-foreground'}`} />
                      <p className="font-heading text-sm font-bold text-foreground">Cash on Delivery</p>
                      <p className="font-paragraph text-xs text-foreground/70">Pay when guide arrives</p>
                    </motion.button>

                    {/* Card Payment */}
                    <motion.button
                      type="button"
                      onClick={() => setBookingData({ ...bookingData, paymentMethod: 'card' })}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        bookingData.paymentMethod === 'card'
                          ? 'border-secondary bg-secondary/10'
                          : 'border-primary/20 hover:border-primary/40'
                      }`}
                    >
                      <CreditCard size={24} className={`mx-auto mb-2 ${bookingData.paymentMethod === 'card' ? 'text-secondary' : 'text-foreground'}`} />
                      <p className="font-heading text-sm font-bold text-foreground">Card Payment</p>
                      <p className="font-paragraph text-xs text-foreground/70">Pay now securely</p>
                    </motion.button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !bookingData.date || !bookingData.time}
                  className="w-full px-8 py-4 bg-secondary text-secondary-foreground font-paragraph text-lg rounded-full hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Confirming Booking...' : 'Confirm Booking'}
                </button>

                <p className="font-paragraph text-sm text-foreground/70 text-center">
                  By booking, you agree to our terms and conditions. The guide will receive a notification about your booking.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
