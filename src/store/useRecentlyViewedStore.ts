import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { RecentlyViewedItem } from "@/types/recentlyViewed";
import { generateCalibratedStoneUrl, generateFreeSizeStoneUrl } from "@/utils/seoUrlHelpers";

const MAX_ITEMS = 30;
const LAB_LABELS = new Set(["Lab Grown", "Lab-Grown"]);

export function unwrapString(val: any): string {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (typeof val === "object") {
    if ("value" in val && val.value !== null && val.value !== undefined) {
      return unwrapString(val.value);
    }
    if ("amount" in val && val.amount !== null && val.amount !== undefined) {
      return unwrapString(val.amount);
    }
    if ("url" in val && typeof val.url === "string") {
      return val.url;
    }
    return "";
  }
  return "";
}

export function sanitizeRecentlyViewedItem(item: any): RecentlyViewedItem | null {
  if (!item || typeof item !== "object") return null;
  const id = unwrapString(item.id);
  if (!id) return null;

  let url = unwrapString(item.url) || "/";
  if (url.startsWith("/jewelry/all/") || url.includes("[object")) {
    url = url.replace(/^\/jewelry\/[^/]+\//, "/jewelry/rings/");
  }

  const rawPrice = unwrapString(item.price);
  const priceNum = Number(rawPrice);

  const rawPpc = unwrapString(item.price_per_carat);
  const ppcNum = Number(rawPpc);

  return {
    id,
    productId: unwrapString(item.productId) || id,
    productType:
      item.productType === "calibrated" ||
      item.productType === "free-size" ||
      item.productType === "layout" ||
      item.productType === "jewelry"
        ? item.productType
        : "calibrated",
    title: unwrapString(item.title) || "Gemstone",
    gemstone: unwrapString(item.gemstone) || "Gemstone",
    shape: unwrapString(item.shape) || undefined,
    size: unwrapString(item.size) || undefined,
    dimension: unwrapString(item.dimension) || undefined,
    color: unwrapString(item.color) || undefined,
    quality: unwrapString(item.quality) || undefined,
    carat_weight: unwrapString(item.carat_weight) || undefined,
    price: !Number.isNaN(priceNum) ? priceNum : 0,
    price_per_carat: rawPpc && !Number.isNaN(ppcNum) ? ppcNum : undefined,
    image_url: unwrapString(item.image_url) || "/assets/logo2.webp",
    url,
    lot_number: unwrapString(item.lot_number) || undefined,
    viewedAt: unwrapString(item.viewedAt) || new Date().toISOString(),
  };
}

export function sanitizeRecentlyViewedList(items: any): RecentlyViewedItem[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((it) => sanitizeRecentlyViewedItem(it))
    .filter((it): it is RecentlyViewedItem => it !== null);
}

export function normalizeToRecentlyViewed(
  product: any,
  type: "calibrated" | "free-size" | "layout" | "jewelry"
): RecentlyViewedItem | null {
  if (!product) return null;

  try {
    if (type === "calibrated") {
      const rawId = unwrapString(product.id ?? product.productId);
      if (!rawId) return null;

      const stone = unwrapString(product.collection_slug) || unwrapString(product.gemstone) || "Gemstone";
      const shape = unwrapString(product.shape);
      const size = unwrapString(product.size) || unwrapString(product.dimension);
      const color = unwrapString(product.color);
      const quality = unwrapString(product.quality) || unwrapString(product.type) || "Natural";
      const stoneHandle = (unwrapString(product.collection_slug) || "stone").toLowerCase();
      const url = generateCalibratedStoneUrl(product, stoneHandle);

      const titleParts = [
        quality && !LAB_LABELS.has(quality) ? quality : "",
        color,
        stone,
        shape,
      ].filter(Boolean);

      const title = titleParts.join(" ") || `Calibrated ${stone}`;
      const ctWeightNum = Number(unwrapString(product.ct_weight));
      const priceNum = Number(unwrapString(product.price));

      return sanitizeRecentlyViewedItem({
        id: `calibrated_${rawId}`,
        productId: rawId,
        productType: "calibrated",
        title,
        gemstone: stone,
        shape,
        size,
        dimension: unwrapString(product.dimension) || size,
        color,
        quality,
        carat_weight: unwrapString(product.ct_weight) || unwrapString(product.weight),
        price: !Number.isNaN(priceNum) ? priceNum : 0,
        price_per_carat:
          ctWeightNum > 0 && priceNum > 0
            ? Number((priceNum / ctWeightNum).toFixed(2))
            : undefined,
        image_url:
          unwrapString(product.image_url) ||
          (Array.isArray(product.extra_images) && unwrapString(product.extra_images[0])) ||
          "/assets/logo2.webp",
        url,
        viewedAt: new Date().toISOString(),
      });
    }

    if (type === "free-size") {
      const rawId = unwrapString(product.id ?? product.productId);
      if (!rawId) return null;

      const stone = unwrapString(product.gemstone_type) || unwrapString(product.collection_slug) || "Gemstone";
      const shape = unwrapString(product.shape);
      const size = unwrapString(product.dimension) || unwrapString(product.size);
      const color = unwrapString(product.color);
      const quality = unwrapString(product.quality) || unwrapString(product.enhancement) || "Natural";
      const stoneHandle = (unwrapString(product.gemstone_type) || unwrapString(product.collection_slug) || "gemstone").toLowerCase();
      const url = generateFreeSizeStoneUrl(product, stoneHandle);

      const ctWeightStr = unwrapString(product.ct_weight);
      const weightDisplay = ctWeightStr ? `${ctWeightStr} ct` : "";
      const title = `${color ? color + " " : ""}${stone} ${shape} ${weightDisplay}`.trim();

      return sanitizeRecentlyViewedItem({
        id: `free_size_${rawId}`,
        productId: rawId,
        productType: "free-size",
        title: title || `Free Size ${stone}`,
        gemstone: stone,
        shape,
        size,
        dimension: unwrapString(product.dimension) || size,
        color,
        quality,
        carat_weight: ctWeightStr,
        price: Number(unwrapString(product.price)) || 0,
        image_url: unwrapString(product.image_url) || "/assets/logo2.webp",
        url,
        lot_number: unwrapString(product.lot_number),
        viewedAt: new Date().toISOString(),
      });
    }

    if (type === "layout") {
      const rawId = unwrapString(product.id || product.handle);
      if (!rawId) return null;

      let shapeSize: any = null;
      const shapeSizesRaw = unwrapString(product?.shapeSizes);
      if (shapeSizesRaw) {
        try {
          shapeSize = JSON.parse(shapeSizesRaw);
        } catch {}
      }
      const firstOption = Array.isArray(shapeSize) && shapeSize[0] ? shapeSize[0] : null;
      const resolvedShape = unwrapString(product.shape) || unwrapString(firstOption?.shape);
      const resolvedSize =
        unwrapString(product.size) ||
        unwrapString(product.dimension) ||
        unwrapString(firstOption?.size);

      return sanitizeRecentlyViewedItem({
        id: `layout_${rawId}`,
        productId: rawId,
        productType: "layout",
        title: unwrapString(product.title) || "Color Stone Layout",
        gemstone: unwrapString(product.stone) || unwrapString(product.gemstone) || "Gemstone",
        shape: resolvedShape,
        size: resolvedSize,
        dimension: resolvedSize,
        color: unwrapString(product.color),
        quality: unwrapString(product.quality) || "Fine",
        carat_weight:
          unwrapString(firstOption?.ct_weight) ||
          unwrapString(product.ct_weight) ||
          unwrapString(product.total_weight),
        price:
          unwrapString(product.variants?.edges?.[0]?.node?.price?.amount) ||
          unwrapString(firstOption?.price) ||
          0,
        image_url:
          unwrapString(product.images?.edges?.[0]?.node?.url) ||
          unwrapString(product.featuredImage?.url) ||
          "/assets/logo2.webp",
        url: `/trade/layouts/${unwrapString(product.handle) || rawId}`,
        viewedAt: new Date().toISOString(),
      });
    }

    if (type === "jewelry") {
      const rawId = unwrapString(product.id || product.handle);
      if (!rawId) return null;

      const price = unwrapString(product?.variants?.edges?.[0]?.node?.price?.amount) || 0;
      const img = unwrapString(product?.images?.edges?.[0]?.node?.url) || "/assets/logo2.webp";
      const categorySlug = (
        unwrapString(product.category) ||
        unwrapString(product.productType) ||
        "rings"
      ).toLowerCase();

      return sanitizeRecentlyViewedItem({
        id: `jewelry_${rawId}`,
        productId: rawId,
        productType: "jewelry",
        title: unwrapString(product.title) || "Fine Jewelry",
        gemstone: unwrapString(product?.gemstone),
        price,
        image_url: img,
        url: `/jewelry/${categorySlug}/${unwrapString(product.handle) || rawId}`,
        viewedAt: new Date().toISOString(),
      });
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
            const cleanItem = sanitizeRecentlyViewedItem(newItem);
            if (!cleanItem?.id) return;

            set((state) => {
              // Deduplicate and move to top
              const filtered = sanitizeRecentlyViewedList(state.items).filter(
                (i) => i.id !== cleanItem.id
              );
              const updated = [cleanItem, ...filtered].slice(0, MAX_ITEMS);
              return { items: updated };
            });

            // If user is authenticated, sync to PostgreSQL in background
            if (typeof window !== "undefined" && userKey !== "guest") {
              debouncedSaveToDb(cleanItem);
            }
          },

          removeItem: (id: string) => {
            set((state) => ({
              items: sanitizeRecentlyViewedList(state.items).filter((i) => i.id !== id),
            }));
          },

          clearAll: () => {
            set({ items: [] });
            if (typeof window !== "undefined" && userKey !== "guest") {
              axios.delete("/api/recentlyViewed").catch(() => {});
            }
          },

          setItems: (items: RecentlyViewedItem[]) => {
            set({ items: sanitizeRecentlyViewedList(items).slice(0, MAX_ITEMS) });
          },
        }),
        {
          name: `bvgems_recently_viewed_${userKey}`,
          merge: (persistedState: any, currentState) => ({
            ...currentState,
            ...(persistedState || {}),
            items: sanitizeRecentlyViewedList(persistedState?.items).slice(0, MAX_ITEMS),
          }),
        }
      )
    );

    // Initial PostgreSQL sync for authenticated trade customers
    if (typeof window !== "undefined" && userKey !== "guest") {
      axios
        .get("/api/recentlyViewed")
        .then((res) => {
          if (res?.data?.items && Array.isArray(res.data.items)) {
            const remoteItems = sanitizeRecentlyViewedList(res.data.items);
            const currentItems = sanitizeRecentlyViewedList(registry[userKey].getState().items);
            if (currentItems.length === 0 && remoteItems.length > 0) {
              registry[userKey].setState({ items: remoteItems.slice(0, MAX_ITEMS) });
            } else if (remoteItems.length > 0) {
              // Merge remote with local items
              const map = new Map<string, RecentlyViewedItem>();
              for (const it of currentItems) map.set(it.id, it);
              for (const it of remoteItems) {
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
    const guestItems = sanitizeRecentlyViewedList(guestStore.getState().items);

    if (guestItems.length > 0) {
      await axios.post("/api/recentlyViewed", { items: guestItems });
    }

    // Refresh user store
    const userStore = getRecentlyViewedStore(userId.toString());
    const res = await axios.get("/api/recentlyViewed");
    if (res?.data?.items && Array.isArray(res.data.items)) {
      userStore.setState({ items: sanitizeRecentlyViewedList(res.data.items) });
    }
  } catch (err) {
    console.error("Error syncing recently viewed on login:", err);
  }
};
