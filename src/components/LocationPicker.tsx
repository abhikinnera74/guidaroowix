import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader, AlertCircle, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void;
  selectedLocation?: LocationData | null;
  required?: boolean;
}

export default function LocationPicker({
  onLocationSelect,
  selectedLocation,
  required = true,
}: LocationPickerProps) {
  const [searchInput, setSearchInput] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const suggestionsTimeoutRef = useRef<NodeJS.Timeout>();

  // Reverse geocode using Nominatim (OpenStreetMap's geocoding service)
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.address?.road || data.address?.village || data.address?.city || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const handleLocationSelect = async (lat: number, lng: number) => {
    setIsLoadingLocation(true);
    setError(null);

    try {
      const address = await reverseGeocode(lat, lng);
      setSearchInput(address);
      onLocationSelect({ latitude: lat, longitude: lng, address });
    } catch (err) {
      setError('Error retrieving location details');
      console.error('Location selection error:', err);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Search locations using Nominatim
  const handleSearchChange = async (value: string) => {
    setSearchInput(value);
    setSuggestions([]);

    if (!value || value.length < 3) return;

    // Clear previous timeout
    if (suggestionsTimeoutRef.current) {
      clearTimeout(suggestionsTimeoutRef.current);
    }

    // Debounce search
    suggestionsTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=in&limit=5`
        );
        const data = await response.json();
        setSuggestions(data || []);
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 300);
  };

  const handleSuggestionClick = async (suggestion: any) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    const address = suggestion.display_name;

    setSearchInput(address);
    setSuggestions([]);

    onLocationSelect({ latitude: lat, longitude: lng, address });
  };

  const handleAutoDetect = () => {
    setIsLoadingLocation(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        handleLocationSelect(lat, lng);
      },
      (err) => {
        setError('Unable to access your location. Please enable location permissions.');
        console.error('Geolocation error:', err);
        setIsLoadingLocation(false);
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div>
        <label className="font-paragraph text-sm font-semibold text-foreground mb-3 block">
          <MapPin size={18} className="inline mr-2" />
          Pickup/Meeting Location {required && <span className="text-destructive">*</span>}
        </label>
        <p className="font-paragraph text-sm text-foreground/70 mb-4">
          Click on the map or search for your pickup location
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-foreground/50" />
          <input
            type="text"
            placeholder="Search location..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-primary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {isLoadingLocation && (
            <Loader size={18} className="absolute right-3 top-3 text-primary animate-spin" />
          )}
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-primary/20 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
          >
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-primary/10 border-b border-primary/10 last:border-b-0 transition-colors"
              >
                <p className="font-paragraph text-sm text-foreground font-medium">
                  {suggestion.name || suggestion.display_name.split(',')[0]}
                </p>
                <p className="font-paragraph text-xs text-foreground/60">
                  {suggestion.display_name.split(',').slice(1, 3).join(',')}
                </p>
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Auto-detect Button */}
      <button
        type="button"
        onClick={handleAutoDetect}
        disabled={isLoadingLocation}
        className="w-full px-4 py-2 border border-primary text-primary font-paragraph text-sm rounded-lg hover:bg-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoadingLocation ? (
          <>
            <Loader size={16} className="animate-spin" />
            Detecting Location...
          </>
        ) : (
          <>
            <MapPin size={16} />
            Use Current Location
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg"
        >
          <AlertCircle size={18} className="text-destructive flex-shrink-0 mt-0.5" />
          <p className="font-paragraph text-sm text-destructive">{error}</p>
        </motion.div>
      )}

      {/* Static Map Preview using OpenStreetMap */}
      {selectedLocation && (
        <div className="relative rounded-xl overflow-hidden border border-primary/20 h-96 bg-gray-100">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedLocation.longitude - 0.01},${selectedLocation.latitude - 0.01},${selectedLocation.longitude + 0.01},${selectedLocation.latitude + 0.01}&layer=mapnik&marker=${selectedLocation.latitude},${selectedLocation.longitude}`}
            style={{ border: 0 }}
          />
        </div>
      )}

      {/* Selected Location Display */}
      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-primary/10 border border-primary/30 rounded-lg"
        >
          <p className="font-paragraph text-sm text-foreground/70 mb-1">Selected Location:</p>
          <p className="font-paragraph font-semibold text-foreground mb-2">
            {selectedLocation.address}
          </p>
          <p className="font-paragraph text-xs text-foreground/60">
            Coordinates: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
