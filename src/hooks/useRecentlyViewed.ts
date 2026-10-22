"use client";

import { useAuth } from "./useAuth";
import {
  getRecentlyViewedStore,
  normalizeToRecentlyViewed,
  sanitizeRecentlyViewedList,
} from "@/store/useRecentlyViewedStore";
import { useCallback, useMemo } from "react";
import { RecentlyViewedItem } from "@/types/recentlyViewed";

export const useRecentlyViewed = () => {
  const { user } = useAuth();
  const userKey = user?.id?.toString() || "guest";

  const store = useMemo(() => getRecentlyViewedStore(userKey), [userKey]);
  const rawItems = store((state: any) => state.items) as RecentlyViewedItem[];
  const items = useMemo(() => sanitizeRecentlyViewedList(rawItems), [rawItems]);
  const addItem = store((state: any) => state.addItem);
  const removeItem = store((state: any) => state.removeItem);
  const clearAll = store((state: any) => state.clearAll);

  const trackProduct = useCallback(
    (product: any, type: "calibrated" | "free-size" | "layout" | "jewelry") => {
      if (!product) return;
      const normalized = normalizeToRecentlyViewed(product, type);
      if (normalized) {
        addItem(normalized);
      }
    },
    [addItem]
  );

  return {
    items,
    trackProduct,
    removeItem,
    clearAll,
  };
};
