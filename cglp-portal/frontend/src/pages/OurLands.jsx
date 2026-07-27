import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import client from '../api/client';

// Fix default marker icons breaking under bundlers like Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

export default function OurLands() {
  const [lands, setLands] = useState([]);

  useEffect(() => {
    client.get('/lands').then((res) => setLands(res.data));
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-5 py-16">
      <span className="text-xs font-mono uppercase tracking-widest text-soil bg-gold/15 px-3 py-1 rounded-full">
        Where we grow
      </span>
      <h1 className="font-display text-4xl text-forest-dark dark:text-parchment mt-5 mb-3">Our Lands</h1>
      <p className="text-forest-dark/70 dark:text-parchment/70 max-w-2xl mb-8">
        A look at where CGLP's cultivation and sourcing sites are located across Sri Lanka.
      </p>

      <div className="rounded-2xl overflow-hidden border border-forest/10 dark:border-parchment/10" style={{ height: 480 }}>
        <MapContainer center={[7.5, 80.5]} zoom={7.2} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {lands.map((land) => (
            <Marker key={land.id} position={[Number(land.latitude), Number(land.longitude)]}>
              <Popup>
                <strong>{land.name}</strong>
                <br />
                {land.region} · {land.crop}
                <br />
                {land.acreage} acres
                <br />
                <span className="text-xs">{land.description}</span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        {lands.map((land) => (
          <div key={land.id} className="bg-white/70 dark:bg-white/5 border border-forest/10 dark:border-parchment/10 rounded-xl p-4">
            <h3 className="font-display text-lg text-forest-dark dark:text-parchment">{land.name}</h3>
            <p className="text-xs text-forest-dark/50 dark:text-parchment/50 mb-2">{land.region} · {land.crop}</p>
            <p className="text-sm text-forest-dark/70 dark:text-parchment/70">{land.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
