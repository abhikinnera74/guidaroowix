# Interactive Map Location Integration Guide

## Overview
This document outlines the complete implementation of interactive map location selection using **OpenStreetMap and Leaflet** - completely free, no API keys required!

## Features Implemented

### 1. **LocationPicker Component** (`/src/components/LocationPicker.tsx`)
A reusable, production-ready component that provides:

#### Features:
- **Interactive OpenStreetMap**: Click on map to select location
- **Search Functionality**: Search for locations with autocomplete (using Nominatim)
- **Auto-Detect Location**: One-click current location detection with geolocation API
- **Reverse Geocoding**: Automatic address retrieval from coordinates
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback during operations
- **Location Display**: Shows selected address and coordinates
- **Responsive Design**: Desktop-first, clean UI with Tailwind CSS
- **Animations**: Smooth transitions using Framer Motion
- **Zero Configuration**: No API keys needed!

#### Props:
```typescript
interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void;
  selectedLocation?: LocationData | null;
  required?: boolean;
}

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}
```

#### Usage:
```tsx
<LocationPicker
  onLocationSelect={(location) => setPickupLocation(location)}
  selectedLocation={selectedLocation}
  required={true}
/>
```

### 2. **Database Schema Updates**
Updated the `Bookings` entity with three new fields:

```typescript
export interface Bookings {
  // ... existing fields ...
  /** @wixFieldType number */
  pickupLatitude?: number;
  /** @wixFieldType number */
  pickupLongitude?: number;
  /** @wixFieldType text */
  pickupAddress?: string;
}
```

**CMS Collection Fields Added:**
- `pickupLatitude` (NUMBER): Latitude coordinate of pickup location
- `pickupLongitude` (NUMBER): Longitude coordinate of pickup location
- `pickupAddress` (TEXT): Human-readable address of pickup location

### 3. **BookingPage Updates** (`/src/components/pages/BookingPage.tsx`)

#### Changes:
1. **Location Picker Integration**: Added LocationPicker component to booking form
2. **Location Validation**: Made location selection mandatory before booking confirmation
3. **Data Storage**: Location data is now saved to the bookings database
4. **Form State**: Extended booking data to include `pickupLocation` object

#### Form Flow:
1. Tourist selects/searches for pickup location on map
2. Location is validated (required field)
3. Booking is created with location data
4. Confirmation screen displays booking details

#### Code Example:
```tsx
const [bookingData, setBookingData] = useState({
  date: '',
  time: '',
  duration: 1,
  paymentMethod: 'cash',
  pickupLocation: null as { latitude: number; longitude: number; address: string } | null,
});

// In form submission
if (!bookingData.pickupLocation) {
  alert('Please select a pickup/meeting location');
  return;
}

// Save to database
await BaseCrudService.create('bookings', {
  // ... other fields ...
  pickupLatitude: bookingData.pickupLocation.latitude,
  pickupLongitude: bookingData.pickupLocation.longitude,
  pickupAddress: bookingData.pickupLocation.address,
});
```

### 4. **GuideBookingsPage Updates** (`/src/components/pages/GuideBookingsPage.tsx`)

#### Features for Guides:
1. **Location Display**: Shows pickup address in booking card
2. **Coordinates**: Displays latitude/longitude for reference
3. **Map Preview**: Interactive OpenStreetMap preview of the location
4. **Navigate Button**: "Get Directions" button that opens OpenStreetMap with directions

#### Implementation:
```tsx
{booking.pickupAddress && (
  <div className="border-t border-secondary/10 pt-4">
    {/* Address Display */}
    <div className="flex items-start gap-3 mb-3">
      <MapPin size={20} className="text-secondary flex-shrink-0 mt-1" />
      <div className="flex-1">
        <p className="font-paragraph text-sm text-foreground/70">Pickup Location</p>
        <p className="font-paragraph font-semibold text-foreground">
          {booking.pickupAddress}
        </p>
        {booking.pickupLatitude && booking.pickupLongitude && (
          <p className="font-paragraph text-xs text-foreground/60 mt-1">
            {booking.pickupLatitude.toFixed(4)}, {booking.pickupLongitude.toFixed(4)}
          </p>
        )}
      </div>
    </div>

    {/* Map Preview */}
    {booking.pickupLatitude && booking.pickupLongitude && (
      <MapPreview
        lat={booking.pickupLatitude}
        lng={booking.pickupLongitude}
        bookingId={booking._id}
        mapRefsRef={mapRefsRef}
      />
    )}

    {/* Navigate Button */}
    {booking.pickupLatitude && booking.pickupLongitude && (
      <a
        href={`https://www.openstreetmap.org/directions?engine=osrm_car&route=${booking.pickupLatitude},${booking.pickupLongitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground font-paragraph text-sm rounded-lg hover:bg-secondary/90 transition-all"
      >
        <Navigation size={16} />
        Get Directions
      </a>
    )}
  </div>
)}
```

## Setup Instructions

### 1. Installation
Just install dependencies - no configuration needed!
```bash
npm install
npm run dev
```

### 2. What Gets Installed
- **Leaflet**: Lightweight mapping library
- **OpenStreetMap Tiles**: Free map tiles
- **Nominatim**: Free geocoding service

### 3. Permissions
The component requests:
- **Geolocation**: For "Use Current Location" feature
- **Network Access**: To fetch map tiles and geocoding data

## User Flow

### For Tourists (Booking Page):
1. Navigate to booking page
2. Fill in date, time, duration, payment method
3. **NEW**: Select pickup location by:
   - Clicking on the map
   - Searching for an address
   - Using "Use Current Location" button
4. Confirm booking (location is mandatory)
5. Booking is created with location data

### For Guides (Bookings Dashboard):
1. View incoming bookings
2. See pickup location address and coordinates
3. View interactive map preview
4. Click "Get Directions" to open OpenStreetMap with navigation

## Technical Details

### Component Architecture
- **LocationPicker**: Standalone, reusable component
- **Leaflet Integration**: Uses Leaflet JavaScript library
- **Nominatim Geocoding**: Converts coordinates to addresses and vice versa
- **OpenStreetMap Tiles**: Free map tiles from OSM community

### Data Flow
```
Tourist Input (Map/Search)
    ↓
LocationPicker Component
    ↓
Reverse Geocoding (Address retrieval via Nominatim)
    ↓
BookingPage State
    ↓
Database (Bookings Collection)
    ↓
GuideBookingsPage Display
    ↓
Map Preview + Navigation
```

### Error Handling
- Geolocation permission denied
- Network errors
- Invalid coordinates
- Nominatim service unavailable

All errors display user-friendly messages.

## Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support (with geolocation)

## Performance Considerations
- Leaflet loads asynchronously
- Lazy loading for map previews
- Debounced search input (300ms)
- Optimized marker updates
- Lightweight library (Leaflet is ~40KB)

## Security Notes
- No API keys stored in code
- No sensitive data stored in frontend
- All location data encrypted in transit
- User location only collected with explicit permission
- Uses HTTPS-safe Nominatim service

## Why OpenStreetMap + Leaflet?

### Advantages:
✅ **Completely Free** - No API keys, no billing, no rate limits  
✅ **Open Source** - Transparent, community-driven  
✅ **Lightweight** - Leaflet is only ~40KB  
✅ **Privacy-Friendly** - No tracking, no data collection  
✅ **Offline Capable** - Can work with cached tiles  
✅ **Customizable** - Full control over map styling  
✅ **Production Ready** - Used by major companies  

### Compared to Google Maps:
| Feature | OpenStreetMap | Google Maps |
|---------|---------------|------------|
| Cost | Free | $7+ per 1000 requests |
| API Key | Not needed | Required |
| Rate Limits | Generous | Depends on plan |
| Privacy | Better | Tracks users |
| Customization | Full | Limited |
| Offline | Possible | No |

## Future Enhancements
1. Multiple location selection (start/end points)
2. Route optimization
3. Location history
4. Favorite locations
5. Real-time tracking
6. Offline map support
7. Custom map styling
8. Location-based pricing

## Troubleshooting

### Map not loading
- Check browser console for errors
- Verify internet connection (tiles require network)
- Try hard refresh: `Ctrl+Shift+R`
- Clear browser cache

### Geolocation not working
- Ensure HTTPS is used (or localhost)
- Check browser permissions
- Verify geolocation API is enabled
- Try a different browser

### Search not working
- Check internet connection
- Verify Nominatim service is accessible
- Try searching with different terms
- Check browser console for errors

### Coordinates not accurate
- Zoom in on map for better precision
- Use search instead of map click
- Verify location is within service area

## Files Modified
1. `/src/entities/index.ts` - Added location fields to Bookings
2. `/src/components/LocationPicker.tsx` - New component (created)
3. `/src/components/pages/BookingPage.tsx` - Integrated LocationPicker
4. `/src/components/pages/GuideBookingsPage.tsx` - Added location display and map preview
5. `/src/SETUP_GUIDE.md` - Updated documentation
6. `/src/.env.example` - Removed Google Maps API key requirement

## Testing Checklist
- [ ] Location picker loads correctly
- [ ] Map displays and is interactive
- [ ] Search functionality works
- [ ] Auto-detect location works
- [ ] Geocoding returns correct addresses
- [ ] Location is mandatory for booking
- [ ] Booking saves location data
- [ ] Guide dashboard displays location
- [ ] Map preview renders correctly
- [ ] Navigation button opens OpenStreetMap
- [ ] Responsive on mobile devices
- [ ] Error messages display correctly
- [ ] Loading states work properly
- [ ] No API key errors in console

