import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { RecentlyViewedItem } from "@/types/recentlyViewed";
import { generateCalibratedStoneUrl, generateFreeSizeStoneUrl } from "@/utils/seoUrlHelpers";

const MAX_ITEMS = 30;
const LAB_LABELS = new Set(["Lab Grown", "Lab-Grown"]);

export function normalizeToRecentlyViewed(
  product: any,
  type: "calibrated" | "free-size" | "layout" | "jewelry"
): RecentlyViewedItem | null {
  if (!product) return null;

  try {
    if (type === "calibrated") {
      const rawId = String(product.id ?? product.productId ?? "");
      if (!rawId) return null;

      const stone = product.collection_slug || product.gemstone || "Gemstone";
      const shape = product.shape || "";
      const size = product.size || product.dimension || "";
      const color = product.color || "";
      const quality = product.quality || product.type || "Natural";
      const stoneHandle = (product.collection_slug || "stone").toLowerCase();
      const url = generateCalibratedStoneUrl(product, stoneHandle);

      const titleParts = [
        quality && !LAB_LABELS.has(quality) ? quality : "",
        color,
        stone,
        shape,
      ].filter(Boolean);

      const title = titleParts.join(" ") || `Calibrated ${stone}`;

      return {
        id: `calibrated_${rawId}`,
        productId: rawId,
        productType: "calibrated",
        title,
        gemstone: stone,
        shape,
        size,
        dimension: product.dimension || size,
        color,
        quality,
        carat_weight: product.ct_weight || product.weight || "",
        price: product.price ?? 0,
        price_per_carat:
          product.ct_weight && product.price
            ? Number((product.price / product.ct_weight).toFixed(2))
            : undefined,
        image_url:
          product.image_url ||
          (Array.isArray(product.extra_images) && product.extra_images[0]) ||
          "/assets/logo2.webp",
        url,
        viewedAt: new Date().toISOString(),
      };
    }

    if (type === "free-size") {
      const rawId = String(product.id ?? product.productId ?? "");
      if (!rawId) return null;

      const stone = product.gemstone_type || product.collection_slug || "Gemstone";
      const shape = product.shape || "";
      const size = product.dimension || product.size || "";
      const color = product.color || "";
      const quality = product.quality || product.enhancement || "Natural";
      const stoneHandle = (product.gemstone_type || product.collection_slug || "gemstone").toLowerCase();
      const url = generateFreeSizeStoneUrl(product, stoneHandle);

      const weightDisplay = product.ct_weight ? `${product.ct_weight} ct` : "";
      const title = `${color ? color + " " : ""}${stone} ${shape} ${weightDisplay}`.trim();

      return {
        id: `free_size_${rawId}`,
        productId: rawId,
        productType: "free-size",
        title: title || `Free Size ${stone}`,
        gemstone: stone,
        shape,
        size,
        dimension: product.dimension || size,
        color,
        quality,
        carat_weight: product.ct_weight || "",
        price: product.price ?? 0,
        image_url: product.image_url || "/assets/logo2.webp",
        url,
        lot_number: product.lot_number,
        viewedAt: new Date().toISOString(),
      };
    }

    if (type === "layout") {
      const rawId = String(product.id || product.handle || "");
      if (!rawId) return null;

      let shapeSize: any = null;
      if (typeof product?.shapeSizes?.value === "string") {
        try {
          shapeSize = JSON.parse(product.shapeSizes.value);
        } catch {}
      }
      const firstOption = Array.isArray(shapeSize) && shapeSize[0] ? shapeSize[0] : null;

      return {
        id: `layout_${rawId}`,
        productId: rawId,
        productType: "layout",
        title: product.title || "Color Stone Layout",
        gemstone: product.stone || "Gemstone",
        shape: product.shape || firstOption?.shape || "",
        size: product.size || firstOption?.size || "",
        dimension: product.size || firstOption?.size || "",
        color: product.color || "",
        quality: product.quality || "Fine",
        carat_weight: firstOption?.ct_weight || product.total_weight || "",
        price:
          product.variants?.edges?.[0]?.node?.price?.amount ||
          firstOption?.price ||
          0,
        image_url:
          product.images?.edges?.[0]?.node?.url ||
          product.featuredImage?.url ||
          "/assets/logo2.webp",
        url: `/trade/layouts/${product.handle || rawId}`,
        viewedAt: new Date().toISOString(),
      };
    }

    if (type === "jewelry") {
      const rawId = String(product.id || product.handle || "");
      if (!rawId) return null;

      const price = product?.variants?.edges?.[0]?.node?.price?.amount || 0;
      const img = product?.images?.edges?.[0]?.node?.url || "/assets/logo2.webp";

      return {
        id: `jewelry_${rawId}`,
        productId: rawId,
        productType: "jewelry",
        title: product.title || "Fine Jewelry",
        gemstone: product?.gemstone?.value || "",
        price,
        image_url: img,
        url: `/jewelry/${product.category || "all"}/${product.handle || rawId}`,
        viewedAt: new Date().toISOString(),
      };
    }
  } catch (err) {
    console.error("Error normalizing recently viewed product:", err);
  }

  return null;
}

interface RecentlyViewedStore {
  items: RecentlyViewedItem[];
  addItem: (item: RecentlyViewedItem) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  setItems: (items: RecentlyViewedItem[]) => void;
}

// Registry to isolate per-user or guest states
const storeRegistry: Record<string, any> = {};

const getRegistry = () => {
  if (typeof window !== "undefined") {
    if (!(window as any).__recentlyViewedStoreRegistry) {
      (window as any).__recentlyViewedStoreRegistry = {};
    }
    return (window as any).__recentlyViewedStoreRegistry;
  }
  return storeRegistry;
};

// Debounce helper for sending DB updates
let saveTimeout: NodeJS.Timeout | null = null;
const debouncedSaveToDb = (item: RecentlyViewedItem) => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      await axios.post("/api/recentlyViewed", { item });
    } catch (err) {
      // Non-blocking background sync
    }
  }, 400);
};

export const getRecentlyViewedStore = (userKey: string = "guest") => {
  const registry = getRegistry();

  if (!registry[userKey]) {
    registry[userKey] = create<RecentlyViewedStore>()(
      persist(
        (set, get) => ({
          items: [],

          addItem: (newItem: RecentlyViewedItem) => {
            if (!newItem?.id) return;

            set((state) => {
              // Deduplicate and move to top
              const filtered = state.items.filter((i) => i.id !== newItem.id);
              const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);
              return { items: updated };
            });

            // If user is authenticated, sync to PostgreSQL in background
            if (typeof window !== "undefined" && userKey !== "guest") {
              debouncedSaveToDb(newItem);
            }
          },

          removeItem: (id: string) => {
            set((state) => ({
              items: state.items.filter((i) => i.id !== id),
            }));
          },

          clearAll: () => {
            set({ items: [] });
            if (typeof window !== "undefined" && userKey !== "guest") {
              axios.delete("/api/recentlyViewed").catch(() => {});
            }
          },

          setItems: (items: RecentlyViewedItem[]) => {
            set({ items: Array.isArray(items) ? items.slice(0, MAX_ITEMS) : [] });
          },
        }),
        {
          name: `bvgems_recently_viewed_${userKey}`,
        }
      )
    );

    // Initial PostgreSQL sync for authenticated trade customers
    if (typeof window !== "undefined" && userKey !== "guest") {
      axios
        .get("/api/recentlyViewed")
        .then((res) => {
          if (res?.data?.items && Array.isArray(res.data.items)) {
            const currentItems = registry[userKey].getState().items;
            if (currentItems.length === 0 && res.data.items.length > 0) {
              registry[userKey].setState({ items: res.data.items });
            } else if (res.data.items.length > 0) {
              // Merge remote with local items
              const map = new Map<string, RecentlyViewedItem>();
              for (const it of currentItems) map.set(it.id, it);
              for (const it of res.data.items) {
                if (!map.has(it.id)) map.set(it.id, it);
              }
              const merged = Array.from(map.values())
                .sort(
                  (a, b) =>
                    new Date(b.viewedAt || 0).getTime() -
                    new Date(a.viewedAt || 0).getTime()
                )
                .slice(0, MAX_ITEMS);
              registry[userKey].setState({ items: merged });
            }
          }
        })
        .catch(() => {});
    }
  }

  return registry[userKey];
};

/**
 * Sync guest recently viewed items into PostgreSQL when user logs in
 */
export const syncRecentlyViewedOnLogin = async (userId: string | number) => {
  if (typeof window === "undefined" || !userId) return;

  try {
    const guestStore = getRecentlyViewedStore("guest");
    const guestItems = guestStore.getState().items;

    if (Array.isArray(guestItems) && guestItems.length > 0) {
      await axios.post("/api/recentlyViewed", { items: guestItems });
    }

    // Refresh user store
    const userStore = getRecentlyViewedStore(userId.toString());
    const res = await axios.get("/api/recentlyViewed");
    if (res?.data?.items && Array.isArray(res.data.items)) {
      userStore.setState({ items: res.data.items });
    }
  } catch (err) {
    console.error("Error syncing recently viewed on login:", err);
  }
};
