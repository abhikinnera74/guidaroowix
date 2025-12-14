import { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';

interface AvailabilitySlot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface GuideAvailabilityCalendarProps {
  guideId: string;
}

export function GuideAvailabilityCalendar({ guideId }: GuideAvailabilityCalendarProps) {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [loading, setLoading] = useState(false);

  const currentMonth = new Date(selectedDate);
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handleAddAvailability = async () => {
    if (!selectedDate || !startTime || !endTime) return;
    if (startTime >= endTime) {
      alert('End time must be after start time');
      return;
    }

    setLoading(true);
    try {
      const newSlot: AvailabilitySlot = {
        _id: crypto.randomUUID(),
        date: selectedDate,
        startTime,
        endTime,
        isAvailable: true,
      };

      setAvailability([...availability, newSlot]);
      setStartTime('09:00');
      setEndTime('17:00');
    } catch (error) {
      console.error('Error adding availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAvailability = (id: string) => {
    setAvailability(availability.filter(slot => slot._id !== id));
  };

  const getDayAvailability = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return availability.filter(slot => slot.date === dateStr);
  };

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-secondary/10"
    >
      <h3 className="font-heading text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
        <Calendar size={28} />
        Availability Calendar
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-heading font-bold text-secondary">
              {currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </h4>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-paragraph text-xs font-semibold text-foreground/70 py-2">
                {day}
              </div>
            ))}

            {calendarDays.map((day, index) => {
              const dayAvailability = day ? getDayAvailability(day) : [];
              const dateStr = day
                ? `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                : '';
              const isSelected = dateStr === selectedDate;

              return (
                <button
                  key={index}
                  onClick={() => day && setSelectedDate(dateStr)}
                  className={`aspect-square rounded-lg font-paragraph text-sm font-semibold transition-all relative ${
                    !day
                      ? 'bg-transparent'
                      : isSelected
                      ? 'bg-secondary text-white shadow-lg'
                      : dayAvailability.length > 0
                      ? 'bg-green-100 text-green-900 hover:bg-green-200'
                      : 'bg-background hover:bg-secondary/10'
                  }`}
                >
                  {day}
                  {dayAvailability.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add Availability Form */}
        <div className="space-y-4">
          <h4 className="font-heading font-bold text-secondary">
            {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h4>

          <div className="space-y-4 p-4 bg-background rounded-xl">
            <div>
              <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2 border border-secondary/20 rounded-lg font-paragraph focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div>
              <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-2 border border-secondary/20 rounded-lg font-paragraph focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <button
              onClick={handleAddAvailability}
              disabled={loading}
              className="w-full px-4 py-2 bg-secondary text-secondary-foreground font-paragraph rounded-lg hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Plus size={18} />
              Add Time Slot
            </button>
          </div>

          {/* Availability Slots */}
          <div className="space-y-2">
            <h5 className="font-paragraph text-sm font-semibold text-foreground/70">Available Slots</h5>
            {getDayAvailability(parseInt(selectedDate.split('-')[2])).length === 0 ? (
              <p className="font-paragraph text-sm text-foreground/50 py-4 text-center">
                No availability added for this date
              </p>
            ) : (
              getDayAvailability(parseInt(selectedDate.split('-')[2])).map(slot => (
                <motion.div
                  key={slot._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <span className="font-paragraph text-sm text-green-900">
                    {slot.startTime} - {slot.endTime}
                  </span>
                  <button
                    onClick={() => handleRemoveAvailability(slot._id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
