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

  // Create a static map image URL using OpenStreetMap's static map service
  const mapImageUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${longitude},${latitude}&zoom=15&marker=lonlat:${longitude},${latitude};color:%237A4B2B`;

  // Alternative: Use a simple iframe-based map
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <div
      className={`${height} w-full rounded-lg border border-secondary/10 overflow-hidden bg-gray-100`}
      style={{ minHeight: '200px' }}
    >
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={mapEmbedUrl}
        style={{
          border: 'none',
          width: '100%',
          height: '100%',
        }}
        title={`Map showing ${address}`}
      />
    </div>
  );
}
