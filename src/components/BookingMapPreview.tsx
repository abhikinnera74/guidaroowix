import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface BookingMapPreviewProps {
  latitude: number;
  longitude: number;
  address: string;
  height?: string;
}

export function BookingMapPreview({
  latitude,
  longitude,
  address,
  height = 'h-48',
}: BookingMapPreviewProps) {
  if (!latitude || !longitude) return null;

  const position: LatLngExpression = [latitude, longitude];

  return (
    <div
      className={`${height} w-full rounded-lg border border-secondary/10 overflow-hidden`}
      style={{ minHeight: '200px' }}
    >
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>{address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
