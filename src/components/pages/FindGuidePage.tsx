import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Guides } from '@/entities';
import { TouristHeader } from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import { Star, MapPin, Globe, Zap, Search, Filter, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useMember } from '@/integrations';

const INDIAN_CITIES = [
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Jaipur',
  'Goa',
  'Kolkata',
  'Chennai',
  'Hyderabad',
  'Pune',
  'Agra',
  'Varanasi',
  'Udaipur',
  'Kochi',
  'Ahmedabad',
];

const SPECIALTIES = [
  'Heritage',
  'Adventure',
  'Food',
  'Culture',
  'Nature',
  'Photography',
  'Spiritual',
  'Shopping',
];

export default function FindGuidePage() {
  const { isAuthenticated, actions } = useMember();
  const navigate = useNavigate();
  const [guides, setGuides] = useState<Guides[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<Guides[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    language: '',
    specialty: '',
    minRating: 0,
    maxPrice: 10000,
  });

  useEffect(() => {
    loadGuides();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [guides, filters]);

  const loadGuides = async () => {
    setLoading(true);
    const { items } = await BaseCrudService.getAll<Guides>('guides');
    // Show all guides (no verification requirement)
    setGuides(items);
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = guides;

    if (filters.city) {
      filtered = filtered.filter(guide =>
        guide.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.language) {
      filtered = filtered.filter(guide =>
        guide.languagesSpoken?.toLowerCase().includes(filters.language.toLowerCase())
      );
    }

    if (filters.specialty) {
      filtered = filtered.filter(guide =>
        guide.specialty?.toLowerCase().includes(filters.specialty.toLowerCase())
      );
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter(guide =>
        (guide.averageRating || 0) >= filters.minRating
      );
    }

    if (filters.maxPrice > 0) {
      filtered = filtered.filter(guide =>
        (guide.hourlyRate || 0) <= filters.maxPrice
      );
    }

    setFilteredGuides(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TouristHeader />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-paragraph text-base text-foreground">Loading guides...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TouristHeader />

      <main className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        {/* Page Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-6xl font-bold text-primary mb-6"
          >
            Find Your Guide
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-paragraph text-xl text-foreground max-w-3xl mx-auto"
          >
            Discover expert local guides and book your perfect experience
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-primary/10 mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Filter size={24} className="text-primary" />
            <h2 className="font-heading text-2xl font-bold text-primary">Filter Guides</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div>
              <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                City
              </label>
              <select
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full px-4 py-2 border border-primary/20 rounded-lg font-paragraph text-base focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Cities</option>
                {INDIAN_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                Language
              </label>
              <Input
                placeholder="e.g., Hindi, English, Tamil"
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                className="font-paragraph"
              />
            </div>

            <div>
              <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                Specialty
              </label>
              <select
                value={filters.specialty}
                onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                className="w-full px-4 py-2 border border-primary/20 rounded-lg font-paragraph text-base focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Specialties</option>
                {SPECIALTIES.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                Minimum Rating
              </label>
              <select
                value={filters.minRating}
                onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-primary/20 rounded-lg font-paragraph text-base focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="0">All Ratings</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>

            <div>
              <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                Max Price (₹/hour)
              </label>
              <Input
                type="number"
                placeholder="e.g., 5000"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                className="font-paragraph"
              />
            </div>
          </div>
        </motion.div>

        {/* Guides Grid */}
        {filteredGuides.length === 0 ? (
          <div className="text-center py-16">
            <Search size={48} className="text-primary/30 mx-auto mb-4" />
            <p className="font-paragraph text-lg text-foreground">
              {guides.length === 0 ? 'No guides available yet.' : 'No guides match your filters. Try adjusting your search.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.map((guide, index) => (
              <motion.div
                key={guide._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/guide/${guide._id}`} className="group block">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-primary/10 hover:shadow-lg transition-all h-full flex flex-col">
                    {/* Guide Image */}
                    {guide.profilePicture ? (
                      <div className="aspect-square overflow-hidden">
                        <Image
                          src={guide.profilePicture}
                          alt={guide.fullName || 'Guide'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          width={400}
                        />
                      </div>
                    ) : (
                      <div className="aspect-square bg-lavenderaccent flex items-center justify-center">
                        <span className="font-heading text-6xl text-primary/30">
                          {guide.fullName?.charAt(0) || 'G'}
                        </span>
                      </div>
                    )}

                    {/* Guide Info */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-heading text-2xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                        {guide.fullName}
                      </h3>

                      {guide.specialty && (
                        <p className="font-paragraph text-sm text-secondary mb-3">
                          {guide.specialty}
                        </p>
                      )}

                      {guide.bio && (
                        <p className="font-paragraph text-base text-foreground mb-4 line-clamp-2 flex-1">
                          {guide.bio}
                        </p>
                      )}

                      <div className="space-y-2 mb-4">
                        {guide.city && (
                          <div className="flex items-center gap-2 text-foreground">
                            <MapPin size={16} className="text-secondary" />
                            <span className="font-paragraph text-sm">{guide.city}</span>
                          </div>
                        )}

                        {guide.languagesSpoken && (
                          <div className="flex items-center gap-2 text-foreground">
                            <Globe size={16} className="text-secondary" />
                            <span className="font-paragraph text-sm">{guide.languagesSpoken}</span>
                          </div>
                        )}

                        {guide.yearsOfExperience && (
                          <div className="flex items-center gap-2 text-foreground">
                            <Zap size={16} className="text-secondary" />
                            <span className="font-paragraph text-sm">{guide.yearsOfExperience} years experience</span>
                          </div>
                        )}
                      </div>

                      {/* Rating and Price */}
                      <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                        <div className="flex items-center gap-1">
                          <Star size={18} className="text-secondary fill-secondary" />
                          <span className="font-heading font-bold text-primary">
                            {guide.averageRating?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                        {guide.hourlyRate && (
                          <span className="font-heading text-lg font-bold text-secondary">
                            ₹{guide.hourlyRate}/hr
                          </span>
                        )}
                      </div>

                      {/* Book Now Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (!isAuthenticated) {
                            actions.login();
                          } else {
                            navigate(`/booking/${guide._id}`);
                          }
                        }}
                        className="mt-4 w-full px-4 py-3 bg-secondary text-secondary-foreground font-paragraph text-base rounded-lg hover:bg-secondary/90 transition-all flex items-center justify-center gap-2"
                      >
                        <BookOpen size={18} />
                        Book Now
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
