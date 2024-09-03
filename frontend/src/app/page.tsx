"use client";

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('~/app/components/Map/Map'), { ssr: false });

const HomePage = () => (
  <div className="relative min-h-screen">
    <Map />
  </div>
);

export default HomePage;

