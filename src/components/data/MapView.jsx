import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { cn } from "@/lib/utils";

const SAMPLE_MARKERS = [
  { id:1, lat:38.7169,  lng:-9.1395,  title:"Lisboa",   description:"Capital de Portugal" },
  { id:2, lat:41.1496,  lng:-8.6109,  title:"Porto",    description:"Cidade do Douro" },
  { id:3, lat:37.0194,  lng:-7.9322,  title:"Faro",     description:"Capital do Algarve" },
  { id:4, lat:38.6663,  lng:-9.3632,  title:"Sintra",   description:"Património UNESCO" },
];

export default function MapView({ markers = SAMPLE_MARKERS, center = [38.7169, -9.1395], zoom = 7, height = 360, className }) {
  return (
    <div className={cn("rounded-lg overflow-hidden border border-border", className)} style={{ height }}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]}>
            <Popup>
              <strong>{m.title}</strong>
              {m.description && <p>{m.description}</p>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}