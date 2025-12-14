import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, CreditCard, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { Bookings } from '@/entities';

interface GuideEarningsSectionProps {
  guideEmail: string;
}

export function GuideEarningsSection({ guideEmail }: GuideEarningsSectionProps) {
  const [bookings, setBookings] = useState<Bookings[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { items } = await BaseCrudService.getAll<Bookings>('bookings');
        const guideBookings = items.filter(
          b => (b.guideMemberEmail === guideEmail || b.guideReference === guideEmail) && b.bookingStatus === 'Confirmed'
        );
        setBookings(guideBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (guideEmail) {
      fetchBookings();
    }
  }, [guideEmail]);

  const calculateEarnings = () => {
    const now = new Date();
    let startDate = new Date();

    if (selectedPeriod === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (selectedPeriod === 'quarter') {
      startDate.setMonth(now.getMonth() - 3);
    } else {
      startDate.setFullYear(now.getFullYear() - 1);
    }

    return bookings
      .filter(b => {
        const bookingDate = new Date(b.bookingDate || 0);
        return bookingDate >= startDate && bookingDate <= now;
      })
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  };

  const totalEarnings = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const periodEarnings = calculateEarnings();
  const completedBookings = bookings.length;
  const averagePerBooking = completedBookings > 0 ? totalEarnings / completedBookings : 0;

  const recentBookings = bookings.slice(-5).reverse();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Earnings Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Earnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-secondary/10"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="font-paragraph text-sm text-foreground/70">Total Earnings</p>
            <DollarSign size={24} className="text-secondary/20" />
          </div>
          <p className="font-heading text-3xl font-bold text-secondary">
            ₹{totalEarnings.toLocaleString('en-IN')}
          </p>
          <p className="font-paragraph text-xs text-foreground/50 mt-2">All time</p>
        </motion.div>

        {/* Period Earnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-secondary/10"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="font-paragraph text-sm text-foreground/70">
              {selectedPeriod === 'month' ? 'This Month' : selectedPeriod === 'quarter' ? 'This Quarter' : 'This Year'}
            </p>
            <TrendingUp size={24} className="text-green-600/20" />
          </div>
          <p className="font-heading text-3xl font-bold text-green-600">
            ₹{periodEarnings.toLocaleString('en-IN')}
          </p>
          <p className="font-paragraph text-xs text-foreground/50 mt-2">
            {selectedPeriod === 'month' ? 'Last 30 days' : selectedPeriod === 'quarter' ? 'Last 90 days' : 'Last 365 days'}
          </p>
        </motion.div>

        {/* Completed Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-secondary/10"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="font-paragraph text-sm text-foreground/70">Completed Bookings</p>
            <Calendar size={24} className="text-secondary/20" />
          </div>
          <p className="font-heading text-3xl font-bold text-secondary">{completedBookings}</p>
          <p className="font-paragraph text-xs text-foreground/50 mt-2">Total completed</p>
        </motion.div>

        {/* Average Per Booking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-secondary/10"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="font-paragraph text-sm text-foreground/70">Average Per Booking</p>
            <CreditCard size={24} className="text-secondary/20" />
          </div>
          <p className="font-heading text-3xl font-bold text-secondary">
            ₹{Math.round(averagePerBooking).toLocaleString('en-IN')}
          </p>
          <p className="font-paragraph text-xs text-foreground/50 mt-2">Per completed booking</p>
        </motion.div>
      </div>

      {/* Period Filter & Payout Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-secondary/10"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
          <div>
            <h3 className="font-heading text-xl font-bold text-secondary mb-2">Earnings Period</h3>
            <p className="font-paragraph text-sm text-foreground/70">Select a period to view earnings</p>
          </div>

          <div className="flex gap-2">
            {(['month', 'quarter', 'year'] as const).map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-full font-paragraph text-sm font-semibold transition-all ${
                  selectedPeriod === period
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-background text-foreground hover:bg-secondary/10'
                }`}
              >
                {period === 'month' ? 'Month' : period === 'quarter' ? 'Quarter' : 'Year'}
              </button>
            ))}
          </div>
        </div>

        {/* Payout Section */}
        <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-6 border border-secondary/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-heading font-bold text-secondary mb-1">Ready to Withdraw</h4>
              <p className="font-paragraph text-sm text-foreground/70">
                Your earnings are available for withdrawal
              </p>
            </div>
            <div className="text-right">
              <p className="font-heading text-3xl font-bold text-secondary">
                ₹{periodEarnings.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <button className="w-full px-6 py-3 bg-secondary text-secondary-foreground font-paragraph font-semibold rounded-lg hover:bg-secondary/90 transition-all flex items-center justify-center gap-2">
            <Download size={18} />
            Request Payout
          </button>

          <p className="font-paragraph text-xs text-foreground/60 mt-4 text-center">
            Payouts are processed within 3-5 business days to your registered bank account
          </p>
        </div>
      </motion.div>

      {/* Recent Earnings */}
      {recentBookings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-secondary/10"
        >
          <h3 className="font-heading text-xl font-bold text-secondary mb-6">Recent Earnings</h3>

          <div className="space-y-3">
            {recentBookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-background rounded-lg hover:bg-secondary/5 transition-all"
              >
                <div>
                  <p className="font-paragraph font-semibold text-foreground">
                    {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-IN') : 'TBD'}
                  </p>
                  <p className="font-paragraph text-sm text-foreground/70">
                    {booking.durationHours} hours • {booking.bookingStatus}
                  </p>
                </div>
                <p className="font-heading font-bold text-secondary text-lg">
                  ₹{booking.totalPrice?.toLocaleString('en-IN') || '0'}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
