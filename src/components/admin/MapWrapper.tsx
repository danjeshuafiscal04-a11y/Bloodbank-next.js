'use client';

import dynamic from 'next/dynamic';

const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div className="card h-[600px] w-full rounded-xl border border-stone-200 bg-stone-100 flex items-center justify-center text-stone-500">
      <p className="font-bold animate-pulse">Loading map data...</p>
    </div>
  )
});

interface Center {
  id: string;
  name: string;
  center_type: string;
  address: string;
  latitude: number;
  longitude: number;
}

export default function MapWrapper({ centers }: { centers: Center[] }) {
  return <MapClient centers={centers} />;
}
