'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

interface Center {
  id: string;
  name: string;
  center_type: string;
  address: string;
  latitude: number;
  longitude: number;
}

export default function MapClient({ centers }: { centers: Center[] }) {
  // Center map on the first center or a default location (e.g., Manila/Laguna)
  const defaultCenter: [number, number] = centers.length > 0 
    ? [centers[0].latitude, centers[0].longitude] 
    : [14.269, 121.048]; // Laguna approximate

  return (
    <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-sm border border-stone-200">
      <MapContainer 
        center={defaultCenter} 
        zoom={11} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {centers.map(center => (
          <Marker 
            key={center.id} 
            position={[center.latitude, center.longitude]} 
            icon={icon}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-red-700 text-sm">{center.name}</h3>
                <p className="text-xs font-semibold text-stone-500 mb-1">{center.center_type}</p>
                {center.address && <p className="text-xs text-stone-700">{center.address}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
