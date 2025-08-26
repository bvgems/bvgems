"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in Next.js
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { GEM_LOCATIONS, GemLocation } from "@/utils/constants";

export type BigThree = "sapphire" | "emerald" | "ruby";



// Dynamic imports for Leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// Custom markers for different gem types
const createCustomIcon = (gem: BigThree) => {
  const colors = {
    sapphire: "#0066CC",
    emerald: "#00CC66",
    ruby: "#CC0000",
  };

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="21" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.9 12.5 41 12.5 41S25 19.9 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="${colors[gem]}"/>
        <circle cx="12.5" cy="12.5" r="8" fill="white"/>
        <circle cx="12.5" cy="12.5" r="5" fill="${colors[gem]}"/>
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

export default function LocationMap() {
  const [selected, setSelected] = useState<GemLocation | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Fix for default markers
    delete (Icon.Default.prototype as any)._getIconUrl;
    Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x.src,
      iconUrl: markerIcon.src,
      shadowUrl: markerShadow.src,
    });
  }, []);

  if (!isClient) {
    return (
      <div className="h-[80vh] w-full bg-gray-100 flex items-center justify-center">
        Loading map...
      </div>
    );
  }

  return (
    <div className="relative h-[80vh] w-full">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {GEM_LOCATIONS.map((location, index) => (
          <Marker
            key={`${location.gem}-${location.locality}-${index}`}
            position={location.coords}
            icon={createCustomIcon(location.gem)}
            eventHandlers={{
              click: () => setSelected(location),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-lg">
                  {location.locality}, {location.country}
                </h3>
                <div
                  className={`inline-block px-2 py-1 rounded text-white text-sm mb-2 ${
                    location.gem === "sapphire"
                      ? "bg-blue-600"
                      : location.gem === "emerald"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {location.gem.toUpperCase()}
                </div>
                <p className="text-sm">{location.color_profile}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Side panel for detailed information */}
      {selected && (
        <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-lg p-6 max-h-[calc(100%-2rem)] overflow-y-auto z-10">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">
              {selected.locality}, {selected.country}
            </h2>
            <button
              onClick={() => setSelected(null)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>

          <div
            className={`inline-block px-3 py-1 rounded text-white text-sm mb-4 ${
              selected.gem === "sapphire"
                ? "bg-blue-600"
                : selected.gem === "emerald"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            {selected.gem.toUpperCase()}
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-700">Color Profile:</h4>
              <p className="text-sm">{selected.color_profile}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700">Mining Season:</h4>
              <p className="text-sm">{selected.season_open}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700">
                Mining Information:
              </h4>
              <p className="text-sm">{selected.mining_info}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700">Quality Notes:</h4>
              <p className="text-sm">{selected.quality_notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
