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
import { Anchor, Breadcrumbs, Image } from "@mantine/core";

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
  const [showContent, setShowContent] = useState(true);
  const breadcrumbItems = [
    { title: "Home", href: "/" },
    {
      title: "Gemstones By Location",
    },
  ].map((item, index) => (
    <Anchor
      size="sm"
      href={item.href}
      key={index}
      className="text-gray-600 hover:text-black"
    >
      {item.title}
    </Anchor>
  ));

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
      <div className="h-screen w-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setShowContent(!showContent)}
        className="md:hidden absolute top-4 left-4 z-30 bg-white rounded-lg shadow-lg p-3 hover:shadow-xl transition-all"
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {showContent ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      <div className="flex flex-col md:flex-row h-full">
        {/* Left side - Content */}
        <div
          className={`
          ${
            showContent ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }
          transform transition-transform duration-300 ease-in-out
          absolute md:relative z-20 md:z-0
          w-full md:w-1/2 lg:w-2/5
          h-full bg-gradient-to-br from-gray-50 to-gray-100 
          overflow-y-auto
        `}
        >
          <Breadcrumbs separator="›" className="mb-6 p-6">
            {breadcrumbItems}
          </Breadcrumbs>
          <div className="p-4 sm:p-6 lg:p-8 xl:p-12">
            {/* Header Section */}
            <div className="mb-8 lg:mb-12">
              <div className="inline-flex items-center px-3 py-2 lg:px-4 lg:py-2 bg-white rounded-full shadow-sm mb-4 lg:mb-6">
                <div className="w-2 h-2 bg-gray-800 rounded-full mr-2 lg:mr-3 animate-pulse"></div>
                <span className="text-xs lg:text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Premium Sourcing
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-light text-gray-800 mb-3 lg:mb-4 leading-tight">
                Global Gemstone Sourcing at{" "}
                <span className="font-semibold">B.V. Gems</span>
              </h1>
              <div className="w-16 lg:w-24 h-px bg-gray-300 mb-4 lg:mb-8"></div>
              <p className="italic text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed font-light">
                At B.V. Gems, we believe that every gemstone carries a story—one
                shaped by the earth, enriched by heritage, and perfected by
                craftsmanship. For over six generations, we have taken the
                responsibility of sourcing gemstones very seriously, working
                only with trusted vendors and ethical partners across the globe.
              </p>
            </div>

            {/* Content Cards */}
            <div className="space-y-4 lg:space-y-8">
              <div className="bg-white rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start mb-3 lg:mb-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 rounded-lg lg:rounded-xl flex items-center justify-center mr-3 lg:mr-4 flex-shrink-0">
                    <Image src={"/assets/emerald.png"} />
                  </div>
                  <div>
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-1 lg:mb-2">
                      Emeralds
                    </h3>
                    <p className="text-xs lg:text-sm font-medium text-gray-500 mb-2 lg:mb-3 uppercase tracking-wider">
                      The Green Treasures of Nature
                    </p>
                  </div>
                </div>
                <p className="italic text-sm lg:text-base text-gray-600 leading-relaxed font-light">
                  Our emeralds are sourced from some of the most renowned mines
                  in the world. Colombia is celebrated for producing emeralds of
                  exceptional clarity and deep, vivid green color. Zambia offers
                  stones with a rich bluish-green hue, prized for their
                  transparency and consistency.
                </p>
              </div>

              <div className="bg-white rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start mb-3 lg:mb-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 rounded-lg lg:rounded-xl flex items-center justify-center mr-3 lg:mr-4 flex-shrink-0">
                    <Image src={"/assets/ruby.png"} />
                  </div>
                  <div>
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-1 lg:mb-2">
                      Rubies
                    </h3>
                    <p className="text-xs lg:text-sm font-medium text-gray-500 mb-2 lg:mb-3 uppercase tracking-wider">
                      The Fiery Heart of Gemstones
                    </p>
                  </div>
                </div>
                <p className="italic text-sm lg:text-base text-gray-600 leading-relaxed font-light">
                  Known as the "king of gemstones," rubies are treasured for
                  their bold red color and unmatched durability. At B.V. Gems,
                  we source rubies from Myanmar (Burma), home to the legendary
                  "pigeon blood" ruby prized for its vibrant saturation and
                  rarity.
                </p>
              </div>

              <div className="bg-white rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start mb-3 lg:mb-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 rounded-lg lg:rounded-xl flex items-center justify-center mr-3 lg:mr-4 flex-shrink-0">
                    <Image src={"/assets/sapphire.png"} />
                  </div>
                  <div>
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-1 lg:mb-2">
                      Sapphires
                    </h3>
                    <p className="text-xs lg:text-sm font-medium text-gray-500 mb-2 lg:mb-3 uppercase tracking-wider">
                      A Spectrum of Blue and Beyond
                    </p>
                  </div>
                </div>
                <p className="italic text-sm lg:text-base text-gray-600 leading-relaxed font-light">
                  Sapphires remain one of our most sought-after gemstones,
                  cherished for their versatility and elegance. We source
                  sapphires from Sri Lanka (Ceylon), known for their vibrant
                  cornflower blue tones; Madagascar, which offers a wide range
                  of colors and sizes.
                </p>
              </div>

              {/* Excellence Section */}
              <div className="italic bg-gray-900 rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 text-white">
                <div className="flex items-center mb-4 lg:mb-6">
                  <h3 className="text-lg lg:text-xl font-semibold">
                    A Global Standard of Excellence
                  </h3>
                </div>
                <p className="text-sm lg:text-base text-gray-300 leading-relaxed font-light mb-4 lg:mb-6">
                  By sourcing emeralds, rubies, sapphires, and semi-precious
                  stones directly from trusted vendors worldwide, B.V. Gems
                  ensures a collection that reflects both quality and heritage.
                </p>
                <div className="border-t border-gray-700 pt-4 lg:pt-6">
                  <p className="text-sm lg:text-base text-white font-light italic">
                    "At B.V. Gems, sourcing is more than just business—it is a
                    promise to uphold the legacy of fine gemstones for
                    generations to come."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Map */}
        <div className="w-full md:w-1/2 lg:w-3/5 h-full relative">
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
            <div className="absolute top-4 right-4 w-72 sm:w-80 bg-white rounded-lg shadow-lg p-4 sm:p-6 max-h-[calc(100%-2rem)] overflow-y-auto z-10">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg sm:text-xl font-bold pr-2">
                  {selected.locality}, {selected.country}
                </h2>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-500 hover:text-gray-700 text-xl flex-shrink-0"
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
                  <h4 className="font-semibold text-gray-700">
                    Color Profile:
                  </h4>
                  <p className="text-sm">{selected.color_profile}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700">
                    Mining Season:
                  </h4>
                  <p className="text-sm">{selected.season_open}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700">
                    Mining Information:
                  </h4>
                  <p className="text-sm">{selected.mining_info}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700">
                    Quality Notes:
                  </h4>
                  <p className="text-sm">{selected.quality_notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
