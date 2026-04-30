"use client";

/// <reference types="@types/google.maps" />

import { TextInput, Paper, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  error?: React.ReactNode;
  onAddressSelect: (components: {
    addressLine1: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }) => void;
}

export const AddressAutocomplete = ({
  value,
  onChange,
  error,
  onAddressSelect,
}: AddressAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already loaded
    if (window.google?.maps?.places) {
      autocompleteService.current =
        new google.maps.places.AutocompleteService();
      const dummyDiv = document.createElement("div");
      placesService.current = new google.maps.places.PlacesService(dummyDiv);
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      autocompleteService.current =
        new google.maps.places.AutocompleteService();
      const dummyDiv = document.createElement("div");
      placesService.current = new google.maps.places.PlacesService(dummyDiv);
      setIsLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    if (!isLoaded || val.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    autocompleteService.current?.getPlacePredictions(
      {
        input: val,
        types: ["address"],
      },
      (predictions: any, status: any) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          setSuggestions(predictions);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }
      },
    );
  };

  const handleSelect = (placeId: string, description: string) => {
    setShowDropdown(false);

    // Set only street text in input
    onChange(description.split(",")[0]);

    placesService.current?.getDetails(
      {
        placeId,
        fields: ["address_components"],
      },
      (
        place: google.maps.places.PlaceResult | null,
        status: google.maps.places.PlacesServiceStatus | string,
      ) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place)
          return;

        const get = (type: string) =>
          place.address_components?.find((c) => c.types.includes(type))
            ?.long_name || "";

        const streetNumber = get("street_number");
        const route = get("route");
        const city =
          get("locality") || get("sublocality") || get("postal_town");
        const state = get("administrative_area_level_1");
        const zipCode = get("postal_code");
        const country = get("country");

        onAddressSelect({
          addressLine1: `${streetNumber} ${route}`.trim(),
          city,
          state,
          zipCode,
          country,
        });
      },
    );
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <TextInput
        label="Street Address"
        placeholder="123 Main St"
        value={value}
        onChange={handleInputChange}
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
        error={error}
        autoComplete="off"
      />

      {showDropdown && suggestions.length > 0 && (
        <Paper
          shadow="md"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
            marginTop: 4,
            overflow: "hidden",
          }}
        >
          {suggestions.map((s) => (
            <div
              key={s.place_id}
              onMouseDown={() => handleSelect(s.place_id, s.description)}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                borderBottom: "1px solid #f1f3f5",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  "#f8f9fa";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "white";
              }}
            >
              <Text size="sm" fw={500}>
                {s.structured_formatting.main_text}
              </Text>
              <Text size="xs" c="dimmed">
                {s.structured_formatting.secondary_text}
              </Text>
            </div>
          ))}
        </Paper>
      )}
    </div>
  );
};
