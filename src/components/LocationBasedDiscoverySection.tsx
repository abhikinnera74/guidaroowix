import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { MapPin, Zap } from 'lucide-react';

interface GlowingMarkerProps {
  x: string;
  y: string;
  label: string;
  delay: number;
}

const GlowingMarker: React.FC<GlowingMarkerProps> = ({ x, y, label, delay }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
      style={{ left: x, top: y }}
    >
      {/* Glow effect */}
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay }}
        className="absolute inset-0 bg-secondary rounded-full blur-lg opacity-50"
        style={{ width: '32px', height: '32px', left: '-16px', top: '-16px' }}
      />

      {/* Marker dot */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay }}
        className="relative w-8 h-8 bg-secondary rounded-full shadow-lg flex items-center justify-center border-2 border-white"
      >
        <MapPin className="w-4 h-4 text-white" />
      </motion.div>

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: delay + 0.2 }}
        viewport={{ once: true }}
        className="absolute top-full mt-2 whitespace-nowrap bg-white rounded-lg px-3 py-1 shadow-lg"
      >
        <p className="font-heading font-bold text-primary text-sm">{label}</p>
      </motion.div>
    </motion.div>
  );
};

export function LocationBasedDiscoverySection() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    // Try to get user's location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setLocationError('Unable to access your location');
          console.log('Location access denied or unavailable');
        }
      );
    }
  }, []);

  return (
    <section className="w-full py-24 px-6 bg-gradient-to-b from-white to-lavenderaccent/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-[120rem] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="font-heading text-5xl md:text-6xl font-bold text-primary mb-6">
            Location-Based Discovery
          </h2>
          <p className="font-paragraph text-xl text-foreground/70 max-w-2xl mx-auto">
            Find expert guides in your area or explore destinations around the world
          </p>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/10 to-secondary/10"
        >
          {/* World Map Image */}
          <Image
            src="https://static.wixstatic.com/media/70fb72_ff5a8607e1dd416abad53c0788a5ab07~mv2.png?originWidth=1280&originHeight=704"
            alt="World map with guide locations"
            className="w-full h-full object-cover"
            width={1920}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />

          {/* Animated Map Pins */}
          <GlowingMarker x="15%" y="25%" label="Paris" delay={0} />
          <GlowingMarker x="45%" y="30%" label="Tokyo" delay={0.2} />
          <GlowingMarker x="25%" y="60%" label="Rio" delay={0.4} />
          <GlowingMarker x="70%" y="50%" label="Sydney" delay={0.6} />
          <GlowingMarker x="35%" y="45%" label="Bangkok" delay={0.8} />

          {/* User Location Indicator (if available) */}
          {userLocation && !locationError && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{
                left: `${((userLocation.lng + 180) / 360) * 100}%`,
                top: `${((90 - userLocation.lat) / 180) * 100}%`,
              }}
            >
              {/* User location pulse */}
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-lavenderaccent rounded-full opacity-40"
                style={{ width: '24px', height: '24px', left: '-12px', top: '-12px' }}
              />

              {/* User location dot */}
              <div className="w-6 h-6 bg-lavenderaccent rounded-full shadow-lg border-2 border-white flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </motion.div>
          )}

          {/* Info Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="absolute top-6 left-6 bg-white rounded-xl px-4 py-3 shadow-lg z-30"
          >
            <p className="font-heading font-bold text-primary text-sm">
              🌍 Guides in 50+ Countries
            </p>
          </motion.div>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-primary/10 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-lavenderaccent/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-primary mb-2">
                  Nearby Guides
                </h3>
                <p className="font-paragraph text-base text-foreground/70">
                  Discover expert guides in your area. Whether you're at home or traveling, find local experts ready to show you around.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-primary/10 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-primary mb-2">
                  Instant Connections
                </h3>
                <p className="font-paragraph text-base text-foreground/70">
                  Connect instantly with verified guides. Message them directly, discuss your interests, and book your perfect experience.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
