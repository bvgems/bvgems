import { useState, useEffect } from "react";
import { getNames } from "country-list";

export const useCountries = () => {
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get all standard country names and sort them alphabetically
    const list = getNames().sort((a, b) => a.localeCompare(b));
    setCountries(list);
    setLoading(false);
  }, []);

  return { countries, loading };
};
