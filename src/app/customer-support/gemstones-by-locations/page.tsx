"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in Next.js
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

export type BigThree = "sapphire" | "emerald" | "ruby";

export interface GemLocation {
  gem: BigThree;
  country: string;
  locality: string;
  color_profile: string;
  season_open: string;
  coords: [number, number];
  mining_info: string;
  quality_notes: string;
}

export const GEM_LOCATIONS: GemLocation[] = [
  // SAPPHIRES (10 locations)
  {
    gem: "sapphire",
    country: "Sri Lanka",
    locality: "Ratnapura",
    color_profile: "Wide palette: royal to pastel blues, pink, yellow, white",
    season_open: "Year-round; monsoon May–September may disrupt operations",
    coords: [6.6828, 80.3992],
    mining_info:
      "Alluvial mining in gem gravels, traditional pit mining methods",
    quality_notes: "Famous for cornflower blue sapphires and rare padparadscha",
  },
  {
    gem: "sapphire",
    country: "Myanmar",
    locality: "Mogok",
    color_profile: "Royal blue, vivid blues, some pink and yellow",
    season_open: "Year-round with peak season October-March",
    coords: [22.918, 96.509],
    mining_info: "Hard rock mining in marble deposits",
    quality_notes: "Produces some of the world's finest blue sapphires",
  },
  {
    gem: "sapphire",
    country: "Madagascar",
    locality: "Ilakaka",
    color_profile: "Blue, pink, yellow, orange, white, color-change",
    season_open: "Year-round, rainy season December-March",
    coords: [-22.7, 45.3],
    mining_info: "Alluvial deposits, artisanal mining predominant",
    quality_notes: "Major source since 1998, wide variety of colors",
  },
  {
    gem: "sapphire",
    country: "Australia",
    locality: "New England",
    color_profile: "Deep blue, some parti-colored and yellow",
    season_open: "Year-round operation",
    coords: [-30.5, 151.5],
    mining_info: "Basalt-hosted deposits, mechanized mining",
    quality_notes: "Known for deep, dark blue sapphires",
  },
  {
    gem: "sapphire",
    country: "Thailand",
    locality: "Kanchanaburi",
    color_profile: "Blue, yellow, some color-change",
    season_open: "Year-round, reduced activity during monsoons",
    coords: [14.0, 99.5],
    mining_info: "Alluvial and hard rock mining",
    quality_notes: "Important cutting and trading center",
  },
  {
    gem: "sapphire",
    country: "Cambodia",
    locality: "Pailin",
    color_profile: "Blue, some pink and yellow varieties",
    season_open: "Dry season October-May preferred",
    coords: [12.85, 102.6],
    mining_info: "Alluvial mining in ancient river deposits",
    quality_notes: "High-quality blue sapphires, limited production",
  },
  {
    gem: "sapphire",
    country: "Tanzania",
    locality: "Songea",
    color_profile: "Blue, pink, yellow, orange, some color-change",
    season_open: "Year-round, peak dry season June-October",
    coords: [-10.68, 35.65],
    mining_info: "Alluvial and eluvial deposits",
    quality_notes: "Source of fine color-change sapphires",
  },
  {
    gem: "sapphire",
    country: "Kashmir",
    locality: "Paddar Valley",
    color_profile: "Legendary cornflower blue with silk",
    season_open: "Limited seasonal access, June-September",
    coords: [33.2, 76.3],
    mining_info: "High-altitude deposits, extremely limited mining",
    quality_notes: "Most prized sapphires in the world, very rare",
  },
  {
    gem: "sapphire",
    country: "United States",
    locality: "Yogo Gulch, Montana",
    color_profile: "Cornflower blue, exceptional clarity",
    season_open: "May-October due to harsh winters",
    coords: [47.0, -110.5],
    mining_info: "Igneous intrusion, limited commercial mining",
    quality_notes: "Naturally untreated, exceptional clarity",
  },
  {
    gem: "sapphire",
    country: "Vietnam",
    locality: "Luc Yen",
    color_profile: "Blue, pink, some color-change varieties",
    season_open: "Year-round with seasonal variations",
    coords: [22.0, 104.5],
    mining_info: "Marble-hosted deposits, artisanal mining",
    quality_notes: "Emerging source of fine-quality sapphires",
  },

  // EMERALDS (5 locations)
  {
    gem: "emerald",
    country: "Colombia",
    locality: "Muzo",
    color_profile: "Deep bluish green, exceptional saturation",
    season_open: "Year-round operation",
    coords: [5.5353, -74.1074],
    mining_info: "Sedimentary rock deposits, underground mining",
    quality_notes: "World's most prized emeralds, distinctive inclusions",
  },
  {
    gem: "emerald",
    country: "Zambia",
    locality: "Kagem Mine",
    color_profile: "Rich bluish-green, slightly darker than Colombian",
    season_open: "Year-round operation",
    coords: [-13.0833, 28.05],
    mining_info: "Open-pit and underground mining in schist deposits",
    quality_notes: "World's largest emerald mine, consistent quality",
  },
  {
    gem: "emerald",
    country: "Brazil",
    locality: "Itabira",
    color_profile: "Light to medium green, some with blue undertones",
    season_open: "Year-round, rainy season December-March",
    coords: [-19.6167, -43.2333],
    mining_info: "Pegmatite deposits, varied mining methods",
    quality_notes: "Source of large, clean emeralds",
  },
  {
    gem: "emerald",
    country: "Afghanistan",
    locality: "Panjshir Valley",
    color_profile: "Medium to dark green, good saturation",
    season_open: "Limited due to security concerns",
    coords: [35.3, 69.5],
    mining_info: "High-altitude deposits, traditional methods",
    quality_notes: "Historic source, production currently limited",
  },
  {
    gem: "emerald",
    country: "Ethiopia",
    locality: "Shakiso",
    color_profile: "Light to medium green, often eye-clean",
    season_open: "Year-round operation",
    coords: [5.75, 38.92],
    mining_info: "Relatively new discovery, modern mining techniques",
    quality_notes: "Emerging source with commercial potential",
  },

  // RUBIES (5 locations)
  {
    gem: "ruby",
    country: "Myanmar",
    locality: "Mogok Valley",
    color_profile: "Pigeon's-blood red, exceptional fluorescence",
    season_open: "Year-round with peak October-March",
    coords: [22.918, 96.509],
    mining_info: "Marble-hosted deposits, traditional and modern methods",
    quality_notes: "World's finest rubies, legendary pigeon's-blood color",
  },
  {
    gem: "ruby",
    country: "Mozambique",
    locality: "Montepuez",
    color_profile: "Vivid reds, some with pink undertones",
    season_open: "Year-round; rains December-March may slow operations",
    coords: [-13.1333, 39.0833],
    mining_info: "Large-scale mechanized mining operation",
    quality_notes: "Major new source since 2009, large production",
  },
  {
    gem: "ruby",
    country: "Thailand",
    locality: "Chanthaburi",
    color_profile: "Dark red to purplish red",
    season_open: "Year-round operation",
    coords: [12.6103, 102.1035],
    mining_info: "Basalt-hosted deposits, alluvial mining",
    quality_notes: "Important for ruby treatment and trading",
  },
  {
    gem: "ruby",
    country: "Madagascar",
    locality: "Andilamena",
    color_profile: "Pink to red, some exceptional red specimens",
    season_open: "Dry season April-November preferred",
    coords: [-17.0, 48.5],
    mining_info: "Alluvial and hard rock deposits",
    quality_notes: "Produces both rubies and pink sapphires",
  },
  {
    gem: "ruby",
    country: "Tanzania",
    locality: "Winza",
    color_profile: "Pinkish red to red, good transparency",
    season_open: "Year-round with seasonal access variations",
    coords: [-6.5, 35.8],
    mining_info: "Small-scale artisanal mining",
    quality_notes: "Relatively new source, limited but fine quality",
  },
];

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
