import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader, AlertCircle } from 'lucide-react';
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

declare global {
  interface Window {
    google: any;
  }
}

export default function LocationPicker({ 
  onLocationSelect, 
  selectedLocation, 
  required = true 
}: LocationPickerProps) {
  const [searchInput, setSearchInput] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const autocompleteServiceRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.onload = initializeMap;
        document.head.appendChild(script);
      }
    };

    loadGoogleMaps();
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const defaultLocation = selectedLocation 
      ? { lat: selectedLocation.latitude, lng: selectedLocation.longitude }
      : { lat: 20.5937, lng: 78.9629 }; // Center of India

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      zoom: 13,
      center: defaultLocation,
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: false,
    });

    geocoderRef.current = new window.google.maps.Geocoder();
    autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();

    // Add marker if location is already selected
    if (selectedLocation) {
      addMarker(selectedLocation.latitude, selectedLocation.longitude);
    }

    // Handle map clicks
    mapInstanceRef.current.addListener('click', (e: any) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      handleLocationSelect(lat, lng);
    });

    setIsLoadingMap(false);
  };

  const addMarker = (lat: number, lng: number) => {
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    markerRef.current = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstanceRef.current,
      title: 'Pickup Location',
      animation: window.google.maps.Animation.DROP,
    });

    mapInstanceRef.current.panTo({ lat, lng });
  };

  const handleLocationSelect = async (lat: number, lng: number) => {
    setIsLoadingLocation(true);
    setError(null);

    try {
      const response = await geocoderRef.current.geocode({ location: { lat, lng } });
      
      if (response.results && response.results.length > 0) {
        const address = response.results[0].formatted_address;
        addMarker(lat, lng);
        setSearchInput(address);
        onLocationSelect({ latitude: lat, longitude: lng, address });
      } else {
        setError('Could not find address for this location');
      }
    } catch (err) {
      setError('Error retrieving location details');
      console.error('Geocoding error:', err);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleSearchChange = async (value: string) => {
    setSearchInput(value);
    setSuggestions([]);

    if (!value || value.length < 3) return;

    try {
      const predictions = await autocompleteServiceRef.current.getPlacePredictions({
        input: value,
        componentRestrictions: { country: 'in' }, // Restrict to India
      });

      setSuggestions(predictions.predictions || []);
    } catch (err) {
      console.error('Autocomplete error:', err);
    }
  };

  const handleSuggestionClick = async (placeId: string, description: string) => {
    setSearchInput(description);
    setSuggestions([]);
    setIsLoadingLocation(true);
    setError(null);

    try {
      const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);
      
      service.getDetails(
        { placeId, fields: ['geometry', 'formatted_address'] },
        (place: any) => {
          if (place && place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const address = place.formatted_address;
            
            addMarker(lat, lng);
            onLocationSelect({ latitude: lat, longitude: lng, address });
          }
          setIsLoadingLocation(false);
        }
      );
    } catch (err) {
      setError('Error selecting location');
      console.error('Place details error:', err);
      setIsLoadingLocation(false);
    }
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
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                onClick={() => handleSuggestionClick(suggestion.place_id, suggestion.description)}
                className="w-full text-left px-4 py-3 hover:bg-primary/10 border-b border-primary/10 last:border-b-0 transition-colors"
              >
                <p className="font-paragraph text-sm text-foreground font-medium">
                  {suggestion.main_text}
                </p>
                <p className="font-paragraph text-xs text-foreground/60">
                  {suggestion.secondary_text}
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

      {/* Map Container */}
      <div className="relative rounded-xl overflow-hidden border border-primary/20 h-96 bg-gray-100">
        {isLoadingMap && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <div className="text-center">
              <Loader size={32} className="text-primary animate-spin mx-auto mb-2" />
              <p className="font-paragraph text-sm text-foreground">Loading map...</p>
            </div>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />
      </div>

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
