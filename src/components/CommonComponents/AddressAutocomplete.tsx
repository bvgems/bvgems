"use client";

import { TextInput, Paper, Text, ActionIcon } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState, useCallback } from "react";

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
  onClear?: () => void; // optional callback to clear other fields too
}

const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return;
    if ((window as any).google?.maps?.places?.AutocompleteSuggestion) {
      resolve();
      return;
    }
    if (document.getElementById("google-maps-script")) {
      const interval = setInterval(() => {
        if ((window as any).google?.maps?.places?.AutocompleteSuggestion) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
      return;
    }
    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=beta`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
};

export const AddressAutocomplete = ({
  value,
  onChange,
  error,
  onAddressSelect,
  onClear,
}: AddressAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const sessionToken = useRef<any>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
    loadGoogleMapsScript(apiKey).then(() => {
      sessionToken.current = new (
        window as any
      ).google.maps.places.AutocompleteSessionToken();
      isLoaded.current = true;
    });
  }, []);

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

  const handleClear = () => {
    onChange("");
    setSuggestions([]);
    setShowDropdown(false);
    // Also clear all address fields if callback provided
    onClear?.();
    onAddressSelect({
      addressLine1: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.length < 3 || !isLoaded.current) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const { AutocompleteSuggestion } =
          (window as any).google?.maps?.places || {};

        if (!AutocompleteSuggestion || !sessionToken.current) return;

        const { suggestions: results } =
          await AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: val,
            sessionToken: sessionToken.current,
            includedPrimaryTypes: ["street_address", "premise"],
            includedRegionCodes: ["us"],
          });

        setSuggestions(results || []);
        setShowDropdown((results || []).length > 0);
      } catch (err: any) {
        if (
          err?.message?.includes("blocked") ||
          err?.message?.includes("RpcError")
        ) {
          console.warn("Transient autocomplete error, ignoring:", err.message);
          return;
        }
        console.error("Autocomplete error:", err);
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);
  };

  const handleSelect = useCallback(
    async (suggestion: any) => {
      setShowDropdown(false);
      setSuggestions([]);

      try {
        const placePrediction = suggestion.placePrediction;
        const place = placePrediction.toPlace();

        await place.fetchFields({ fields: ["addressComponents"] });

        sessionToken.current = new (
          window as any
        ).google.maps.places.AutocompleteSessionToken();

        const components = place.addressComponents || [];
        const get = (type: string) =>
          components.find((c: any) => c.types.includes(type))?.longText || "";
        const getShort = (type: string) =>
          components.find((c: any) => c.types.includes(type))?.shortText || "";

        const streetNumber = get("street_number");
        const route = get("route");
        const addressLine1 = `${streetNumber} ${route}`.trim();
        const city =
          get("locality") || get("sublocality") || get("postal_town");
        const state = getShort("administrative_area_level_1");
        const zipCode = get("postal_code");
        const country = getShort("country");

        onChange(addressLine1);
        onAddressSelect({ addressLine1, city, state, zipCode, country });
      } catch (err) {
        console.error("Place details error:", err);
      }
    },
    [onChange, onAddressSelect],
  );

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
        // Show X button only when there's a value
        rightSection={
          value ? (
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              onClick={handleClear}
              aria-label="Clear address"
            >
              <IconX size={14} />
            </ActionIcon>
          ) : null
        }
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
          {suggestions.map((s: any, index: number) => {
            const pred = s.placePrediction;
            return (
              <div
                key={pred?.placeId || index}
                onMouseDown={() => handleSelect(s)}
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
                  (e.currentTarget as HTMLDivElement).style.background =
                    "white";
                }}
              >
                <Text size="sm" fw={500}>
                  {pred?.mainText?.toString() || ""}
                </Text>
                <Text size="xs" c="dimmed">
                  {pred?.secondaryText?.toString() || ""}
                </Text>
              </div>
            );
          })}
        </Paper>
      )}
    </div>
  );
};
