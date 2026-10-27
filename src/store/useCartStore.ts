import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { calculateNearestStones } from "@/utils/priceHelpers";

export interface CartItem {
  cartItemId?: string;
  product: {
    id: any;
    handle: string;
    productType: string;
    purchaseByCarat: boolean;
    productId: string;
    collection_slug: string;
    color: string;
    ct_weight: number;
    cut: string;
    image_url: string;
    price: number;
    quality: string;
    shape: string;
    shade: string;
    size: string;
    type: string;
    goldColor: string;
    gemstone: string;
    length: string;
    firstStone: string;
    secondStone: string;
    needCertification: boolean;
    additionalComments: string;
    totalCaratWeight: string;
    stoneCount: any;
    isGift: boolean;
  };
  quantity: number;
  caratWeight?: string;
  requestedCarats?: number;
}

export const generateCartItemId = (item: Partial<CartItem> | any): string => {
  const p = item?.product || {};
  const pid = String(p.productId ?? p.id ?? "");
  const pType = p.productType || "stone";
  const shade = (p.shade || "").trim();
  const byCarat = Boolean(p.purchaseByCarat);

  if (pType === "stone" || pType === "freeSizeStone") {
    // Distinguish carat lot from stone piece orders so they appear as separate cards
    return `${pType}_${pid}_${shade}_${byCarat ? "carat" : "piece"}`;
  }

  if (pType === "layouts") {
    const layoutVariant = [p.size, p.quality, p.shape].filter(Boolean).join("_");
    return `${pType}_${pid}_${layoutVariant || "default"}`;
  }

  // Jewelry, beads, and other products
  const variant = [
    p.goldColor,
    p.size,
    p.length,
    p.quality,
    p.totalCaratWeight,
    p.gemstone,
    p.firstStone,
    p.secondStone,
  ]
    .filter(Boolean)
    .join("_");
  return `${pType}_${pid}_${variant || "default"}`;
};

export const matchesCartItem = (
  item: CartItem | any,
  cartItemIdOrProductId: string | any,
  shade?: string,
  purchaseByCarat?: boolean,
): boolean => {
  if (!item || !cartItemIdOrProductId) return false;
  const targetKey = String(cartItemIdOrProductId).trim();
  const currentCartItemId = String(item.cartItemId || "").trim();
  const computedItemId = generateCartItemId(item);

  // 1. Exact cartItemId match
  if (currentCartItemId && currentCartItemId === targetKey) return true;

  // 2. Exact computed generateCartItemId match
  if (computedItemId === targetKey) return true;

  const prodId = String(item.product?.productId ?? "").trim();
  const rawId = String(item.product?.id ?? "").trim();

  // 3. Fallback for legacy composite keys: `${productId}-${mode}-${shade}-${index}`
  if (
    (prodId && (targetKey.startsWith(`${prodId}-`) || targetKey === prodId)) ||
    (rawId && (targetKey.startsWith(`${rawId}-`) || targetKey === rawId))
  ) {
    if (
      item.product?.productType === "stone" ||
      item.product?.productType === "freeSizeStone"
    ) {
      if (purchaseByCarat !== undefined) {
        const sameMode =
          Boolean(item.product?.purchaseByCarat) === Boolean(purchaseByCarat);
        const sameShade =
          (item.product?.shade || "").trim() === (shade || "").trim();
        return sameMode && sameShade;
      }
      if (shade !== undefined) {
        const sameShade =
          (item.product?.shade || "").trim() === (shade || "").trim();
        return sameShade;
      }
    }
    return true;
  }

  // 4. Match by direct productId or id
  const matchesProd = Boolean(prodId && prodId === targetKey);
  const matchesRaw = Boolean(rawId && rawId === targetKey);

  if (matchesProd || matchesRaw) {
    if (
      item.product?.productType === "stone" ||
      item.product?.productType === "freeSizeStone"
    ) {
      if (purchaseByCarat !== undefined) {
        const sameMode =
          Boolean(item.product?.purchaseByCarat) === Boolean(purchaseByCarat);
        const sameShade =
          (item.product?.shade || "").trim() === (shade || "").trim();
        return sameMode && sameShade;
      } else if (shade !== undefined) {
        const sameShade =
          (item.product?.shade || "").trim() === (shade || "").trim();
        return sameShade;
      }
      return true;
    }
    // For Layouts, Jewelry, Beads, etc.: productId/id match is a direct match
    return true;
  }

  return false;
};

interface CartStore {
  cart: CartItem[];
  isSynced: boolean;
  cartTotal: number;
  shippingOption: "2day" | "overnight";
  shippingTotal: number;
  grandTotal: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemIdOrProductId: string, shade?: string, purchaseByCarat?: boolean) => void;
  updateQuantity: (cartItemIdOrProductId: string, quantity: number, shade?: string, purchaseByCarat?: boolean) => void;
  updateCaratWeight: (cartItemIdOrProductId: string, caratWeight: number, shade?: string) => void;
  toggleCertification: (cartItemIdOrProductId: string, checked: boolean, shade?: string, purchaseByCarat?: boolean) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  setShippingOption: (option: "2day" | "overnight") => void;
  updateTotals: (deliveryMethod?: string, customOption?: "2day" | "overnight") => void;
  setCartTotal: (total: number) => void;
}

const serverRegistry: Record<string, any> = {};

const getRegistry = () => {
  if (typeof window !== "undefined") {
    if (!(window as any).__cartStoreRegistry) {
      (window as any).__cartStoreRegistry = {};
    }
    return (window as any).__cartStoreRegistry;
  }
  return serverRegistry;
};

const normalizeCartItems = (cart: CartItem[]): CartItem[] => {
  if (!Array.isArray(cart)) return [];
  return cart
    .filter(
      (item) =>
        item &&
        typeof item === "object" &&
        item.product &&
        !item.product?.isGift &&
        !String(item.product?.productId || "").includes("FREE-GIFT"),
    )
    .map((item) => {
      return {
        ...item,
        cartItemId: item.cartItemId || generateCartItemId(item),
        quantity: Number(item.quantity) || 1,
        product: {
          ...item.product,
          price: Number(item.product?.price) || 0,
        },
      };
    });
};

const areCartsEquivalent = (a: CartItem[], b: CartItem[]): boolean => {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  try {
    return JSON.stringify(normalizeCartItems(a)) === JSON.stringify(normalizeCartItems(b));
  } catch {
    return false;
  }
};

// Track user-initiated mutations & in-flight saves so background GET syncs never overwrite active edits
const debounceTimers: Record<string, ReturnType<typeof setTimeout>> = {};
const inFlightSaves: Record<string, number> = {};
const inFlightFetches: Record<string, boolean> = {};
const mutationVersion: Record<string, number> = {};
const syncListenersAttached: Record<string, boolean> = {};
const broadcastChannels: Record<string, BroadcastChannel> = {};

const getBroadcastChannel = (userKey: string): BroadcastChannel | null => {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
    return null;
  }
  if (!broadcastChannels[userKey]) {
    try {
      broadcastChannels[userKey] = new BroadcastChannel(`bvgems-cart-sync-${userKey}`);
    } catch {
      return null;
    }
  }
  return broadcastChannels[userKey];
};

const broadcastCartToSameOriginTabs = (userKey: string, cart: CartItem[]) => {
  const channel = getBroadcastChannel(userKey);
  if (channel) {
    try {
      channel.postMessage({ type: "CART_UPDATED", cart, timestamp: Date.now() });
    } catch {}
  }
};

const debouncedSaveCartToDb = (userKey: string, cart: CartItem[]) => {
  if (typeof window === "undefined" || !userKey || userKey === "guest") return;

  if (debounceTimers[userKey]) {
    clearTimeout(debounceTimers[userKey]);
  }

  const versionAtSchedule = mutationVersion[userKey] || 0;

  debounceTimers[userKey] = setTimeout(async () => {
    delete debounceTimers[userKey];
    inFlightSaves[userKey] = (inFlightSaves[userKey] || 0) + 1;
    try {
      const res = await axios.post("/api/cart", { cart: normalizeCartItems(cart) });
      // Only reconcile server-verified cart if the user hasn't made another edit while POST was in flight
      if (
        (mutationVersion[userKey] || 0) === versionAtSchedule &&
        res?.data?.cart &&
        Array.isArray(res.data.cart)
      ) {
        const store = getRegistry()[userKey];
        if (store && !areCartsEquivalent(store.getState().cart, res.data.cart)) {
          store.setState({ cart: res.data.cart, isSynced: true });
        }
      }
    } catch (err) {
      console.error("Failed to auto-save cart to DB:", err);
    } finally {
      inFlightSaves[userKey] = Math.max(0, (inFlightSaves[userKey] || 1) - 1);
    }
  }, 250);
};

// Called ONLY when the user explicitly mutates the cart (add, remove, update quantity/carat/cert/gift)
const commitUserCartMutation = (userKey: string, nextCart: CartItem[]) => {
  const normalized = normalizeCartItems(nextCart);
  mutationVersion[userKey] = (mutationVersion[userKey] || 0) + 1;
  broadcastCartToSameOriginTabs(userKey, normalized);
  if (userKey !== "guest") {
    debouncedSaveCartToDb(userKey, normalized);
  }
};

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    Object.keys(debounceTimers).forEach((key) => {
      if (key && key !== "guest" && debounceTimers[key]) {
        clearTimeout(debounceTimers[key]);
        delete debounceTimers[key];
        const currentCart = getRegistry()[key]?.getState()?.cart;
        if (currentCart && navigator.sendBeacon) {
          navigator.sendBeacon(
            "/api/cart",
            new Blob([JSON.stringify({ cart: normalizeCartItems(currentCart) })], {
              type: "application/json",
            }),
          );
        }
      }
    });
  });
}

export const fetchAndSyncUserCart = async (userId: string | number) => {
  if (typeof window === "undefined" || !userId || String(userId) === "guest") return;
  const key = String(userId);

  // Never overwrite the local store if the user has a pending debounced save or an in-flight POST
  if (debounceTimers[key] || (inFlightSaves[key] || 0) > 0 || inFlightFetches[key]) {
    return;
  }

  const versionBeforeFetch = mutationVersion[key] || 0;
  inFlightFetches[key] = true;

  try {
    const res = await axios.get(`/api/cart?_t=${Date.now()}`, {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    // Re-check after network await that no user mutation happened while GET was in-flight
    if (
      debounceTimers[key] ||
      (inFlightSaves[key] || 0) > 0 ||
      (mutationVersion[key] || 0) !== versionBeforeFetch
    ) {
      return;
    }

    if (res?.data?.cart && Array.isArray(res.data.cart)) {
      const store = getCartStore(key);
      const remoteCart = normalizeCartItems(res.data.cart);
      const currentState = store.getState();

      if (!areCartsEquivalent(currentState.cart, remoteCart) || !currentState.isSynced) {
        store.setState({ cart: remoteCart, isSynced: true });
      }
    }
  } catch (err) {
    console.error("Failed to fetch user cart from DB:", err);
  } finally {
    inFlightFetches[key] = false;
  }
};

export const mergeGuestCartOnLogin = async (userId: string | number) => {
  if (typeof window === "undefined" || !userId || String(userId) === "guest") return;
  const key = String(userId);
  try {
    const rawGuest = window.localStorage.getItem("cart-storage-guest");
    let guestCart: any[] = [];
    if (rawGuest) {
      try {
        const parsed = JSON.parse(rawGuest);
        guestCart = parsed?.state?.cart || [];
      } catch {}
    }

    if (Array.isArray(guestCart) && guestCart.length > 0) {
      inFlightSaves[key] = (inFlightSaves[key] || 0) + 1;
      try {
        const res = await axios.post("/api/cart", { guestCart });
        if (res?.data?.cart) {
          window.localStorage.removeItem("cart-storage-guest");
          const guestStore = getRegistry()["guest"];
          if (guestStore) {
            guestStore.setState({ cart: [] });
          }
          const userStore = getCartStore(key);
          const merged = normalizeCartItems(res.data.cart);
          userStore.setState({ cart: merged, isSynced: true });
          broadcastCartToSameOriginTabs(key, merged);
        }
      } finally {
        inFlightSaves[key] = Math.max(0, (inFlightSaves[key] || 1) - 1);
      }
    } else {
      await fetchAndSyncUserCart(key);
    }
  } catch (err) {
    console.error("Failed to merge guest cart on login:", err);
  }
};

// Synchronizes cart across tabs AND across origins/environments (e.g. localhost <-> production).
// CRITICAL: For logged-in users, PostgreSQL is the single source of truth — we NEVER rehydrate
// from window.localStorage on focus/visibilitychange, because another origin (e.g. production)
// may have updated PostgreSQL while this origin's localStorage is stale.
const setupLiveCartSync = (store: any, userKey: string, storageKey: string) => {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (syncListenersAttached[userKey]) return;
  syncListenersAttached[userKey] = true;

  // 1. Instant 0ms sync across tabs on the SAME origin via BroadcastChannel + storage event
  const channel = getBroadcastChannel(userKey);
  if (channel) {
    channel.onmessage = (event) => {
      if (event?.data?.type === "CART_UPDATED" && Array.isArray(event.data.cart)) {
        const incoming = normalizeCartItems(event.data.cart);
        if (!areCartsEquivalent(store.getState().cart, incoming)) {
          store.setState({ cart: incoming, isSynced: true });
        }
      }
    };
  }

  window.addEventListener("storage", (e: StorageEvent) => {
    if (e.key !== storageKey) return;
    try {
      if (e.newValue === null) {
        if (store.getState().cart.length > 0) {
          store.setState({ cart: [] });
        }
      } else {
        const parsed = JSON.parse(e.newValue);
        const incoming = normalizeCartItems(parsed?.state?.cart || []);
        if (!areCartsEquivalent(store.getState().cart, incoming)) {
          store.setState({ cart: incoming });
        }
      }
    } catch {}
  });

  if (userKey === "guest") {
    // Guest carts only exist in localStorage
    const rehydrateGuest = () => {
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (raw === null) {
          store.setState({ cart: [] });
        } else {
          const parsed = JSON.parse(raw);
          const incoming = normalizeCartItems(parsed?.state?.cart || []);
          if (!areCartsEquivalent(store.getState().cart, incoming)) {
            store.setState({ cart: incoming });
          }
        }
      } catch {}
    };
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") rehydrateGuest();
    });
    window.addEventListener("focus", rehydrateGuest);
    return;
  }

  // 2. Logged-in users: PostgreSQL is master. Pull fresh cart from DB on:
  //    - Initial creation
  //    - Window focus / tab visibility change / back-forward cache restore / reconnect
  //    - Live background heartbeat while tab is visible (so localhost & production update live without refreshing!)
  const syncFromDatabase = () => {
    if (document.visibilityState === "visible") {
      fetchAndSyncUserCart(userKey);
    }
  };

  fetchAndSyncUserCart(userKey);

  window.addEventListener("focus", syncFromDatabase);
  window.addEventListener("pageshow", syncFromDatabase);
  window.addEventListener("online", syncFromDatabase);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      fetchAndSyncUserCart(userKey);
    }
  });

  // Live background sync every 3 seconds while the tab is visible
  setInterval(() => {
    if (document.visibilityState === "visible") {
      fetchAndSyncUserCart(userKey);
    }
  }, 3000);
};

export const getCartStore = (userKey: string) => {
  const normalizedKey = userKey ? String(userKey) : "guest";
  if (!getRegistry()[normalizedKey]) {
    getRegistry()[normalizedKey] = create<CartStore>()(
      persist(
        (set, get) => ({
          cart: [],
          isSynced: normalizedKey === "guest",
          cartTotal: 0,
          shippingTotal: 0,
          grandTotal: 0,

          setCartTotal: (total) => set({ cartTotal: total }),

          addToCart: (newItem) =>
            set((state) => {
              const targetCartItemId =
                newItem.cartItemId || generateCartItemId(newItem);
              const itemToAdd: CartItem = {
                ...newItem,
                cartItemId: targetCartItemId,
              };

              // Enforce nearest whole stone count and exact carat weight
              if (
                itemToAdd.product?.purchaseByCarat &&
                itemToAdd.product?.productType === "stone"
              ) {
                const stoneWeight = Number(itemToAdd.product?.ct_weight) || 0;
                const requested = Number(itemToAdd.requestedCarats || itemToAdd.caratWeight || stoneWeight);
                const { stoneCount, totalCarats } = calculateNearestStones(stoneWeight, requested);
                itemToAdd.quantity = stoneCount;
                itemToAdd.caratWeight = `${totalCarats}`;
                itemToAdd.requestedCarats = requested;
              }

              const existingIndex = state.cart.findIndex((item) => {
                const existingId = item.cartItemId || generateCartItemId(item);
                if (existingId === targetCartItemId) return true;
                if (generateCartItemId(item) === generateCartItemId(itemToAdd)) return true;

                // Only use product+shade+mode fallback for stones; layouts/jewelry/beads have distinct size/gold/quality variants
                const pType = itemToAdd.product?.productType || "stone";
                if (pType !== "stone" && pType !== "freeSizeStone") {
                  return false;
                }

                const sameProduct =
                  String(item.product?.productId ?? item.product?.id ?? "") ===
                  String(itemToAdd.product?.productId ?? itemToAdd.product?.id ?? "");
                const sameShade =
                  (item.product?.shade || "").trim() ===
                  (itemToAdd.product?.shade || "").trim();
                const sameMode =
                  Boolean(item.product?.purchaseByCarat) ===
                  Boolean(itemToAdd.product?.purchaseByCarat);

                return sameProduct && sameShade && sameMode;
              });

              if (existingIndex > -1) {
                const existingItem = state.cart[existingIndex];
                const updatedCart = [...state.cart];

                // If both are by carat weight: combine requested carats and recalculate nearest stones
                if (
                  (itemToAdd.product?.productType === "stone" ||
                    itemToAdd.product?.productType === "freeSizeStone") &&
                  itemToAdd.product?.purchaseByCarat
                ) {
                  const stoneWeight = Number(existingItem.product?.ct_weight) || Number(itemToAdd.product?.ct_weight) || 0;
                  const currentReq = Number(existingItem.requestedCarats || existingItem.caratWeight || stoneWeight);
                  const addedReq = Number(itemToAdd.requestedCarats || itemToAdd.caratWeight || stoneWeight);
                  const totalReq = currentReq + addedReq;
                  const { stoneCount, totalCarats } = calculateNearestStones(stoneWeight, totalReq);

                  updatedCart[existingIndex] = {
                    ...existingItem,
                    cartItemId: targetCartItemId,
                    quantity: stoneCount,
                    caratWeight: `${totalCarats}`,
                    requestedCarats: totalReq,
                    product: {
                      ...existingItem.product,
                      price: itemToAdd.product?.price || existingItem.product?.price,
                      ct_weight: existingItem.product?.ct_weight || itemToAdd.product?.ct_weight,
                    },
                  };
                  commitUserCartMutation(normalizedKey, updatedCart);
                  return { cart: updatedCart };
                }

                // If bought by stone count / pieces: increase quantity
                const currentQty = Number(existingItem.quantity) || 1;
                const addedQty = Number(itemToAdd.quantity) || 1;
                updatedCart[existingIndex] = {
                  ...existingItem,
                  cartItemId: targetCartItemId,
                  quantity: currentQty + addedQty,
                  product: {
                    ...existingItem.product,
                    price: itemToAdd.product?.price || existingItem.product?.price,
                  },
                };
                commitUserCartMutation(normalizedKey, updatedCart);
                return { cart: updatedCart };
              }

              // Different purchase mode or product: add as separate card
              const nextCart = [...state.cart, itemToAdd];
              commitUserCartMutation(normalizedKey, nextCart);
              return { cart: nextCart };
            }),

          removeFromCart: (cartItemIdOrProductId, shade, purchaseByCarat) =>
            set((state) => {
              const nextCart = state.cart.filter(
                (item) => !matchesCartItem(item, cartItemIdOrProductId, shade, purchaseByCarat)
              );
              if (nextCart.length === state.cart.length) {
                return state;
              }
              commitUserCartMutation(normalizedKey, nextCart);
              return { cart: nextCart };
            }),

          updateQuantity: (cartItemIdOrProductId, quantity, shade, purchaseByCarat) =>
            set((state) => {
              let matched = false;
              const nextCart = state.cart.map((item) => {
                if (matchesCartItem(item, cartItemIdOrProductId, shade, purchaseByCarat)) {
                  matched = true;
                  return {
                    ...item,
                    cartItemId: item.cartItemId || generateCartItemId(item),
                    quantity: Math.max(1, Number(quantity) || 1),
                  };
                }
                return item;
              });
              if (!matched) return state;
              commitUserCartMutation(normalizedKey, nextCart);
              return { cart: nextCart };
            }),

          updateCaratWeight: (cartItemIdOrProductId, caratWeight, shade) =>
            set((state) => {
              let matched = false;
              const nextCart = state.cart.map((item) => {
                if (matchesCartItem(item, cartItemIdOrProductId, shade, true)) {
                  matched = true;
                  const stoneWeight = Number(item.product?.ct_weight) || 0;
                  const reqNum = Math.max(0.01, Number(caratWeight) || 0);
                  const { stoneCount, totalCarats } = calculateNearestStones(stoneWeight, reqNum);
                  return {
                    ...item,
                    cartItemId: item.cartItemId || generateCartItemId(item),
                    quantity: stoneCount,
                    caratWeight: `${totalCarats}`,
                    requestedCarats: reqNum,
                  };
                }
                return item;
              });
              if (!matched) return state;
              commitUserCartMutation(normalizedKey, nextCart);
              return { cart: nextCart };
            }),

          toggleCertification: (cartItemIdOrProductId, checked, shade, purchaseByCarat) =>
            set((state) => {
              let matched = false;
              const nextCart = state.cart.map((item) => {
                if (matchesCartItem(item, cartItemIdOrProductId, shade, purchaseByCarat)) {
                  matched = true;
                  return {
                    ...item,
                    cartItemId: item.cartItemId || generateCartItemId(item),
                    product: { ...item.product, needCertification: Boolean(checked) },
                  };
                }
                return item;
              });
              if (!matched) return state;
              commitUserCartMutation(normalizedKey, nextCart);
              return { cart: nextCart };
            }),

          clearCart: () => {
            if (debounceTimers[normalizedKey]) {
              clearTimeout(debounceTimers[normalizedKey]);
              delete debounceTimers[normalizedKey];
            }
            mutationVersion[normalizedKey] = (mutationVersion[normalizedKey] || 0) + 1;
            broadcastCartToSameOriginTabs(normalizedKey, []);

            if (typeof window !== "undefined" && normalizedKey !== "guest") {
              inFlightSaves[normalizedKey] = (inFlightSaves[normalizedKey] || 0) + 1;
              axios
                .delete("/api/cart")
                .catch(() => {})
                .finally(() => {
                  inFlightSaves[normalizedKey] = Math.max(
                    0,
                    (inFlightSaves[normalizedKey] || 1) - 1,
                  );
                });
            }
            set({ cart: [], cartTotal: 0, shippingOption: "2day", shippingTotal: 0, grandTotal: 0 });
          },

          shippingOption: "2day",

          setShippingOption: (option: "2day" | "overnight") => {
            set({ shippingOption: option });
            get().updateTotals("delivery", option);
          },

          getTotalPrice: () => {
            const cart = get().cart;
            return cart.reduce((total, item) => {
              let productTotal = 0;

              if (
                item.product?.productType === "stone" ||
                item.product?.productType === "freeSizeStone"
              ) {
                if (item.product.purchaseByCarat) {
                  const stoneWeight = Number(item.product?.ct_weight) || 0;
                  const minWeight = stoneWeight > 1 ? Number(stoneWeight.toFixed(2)) : 1;
                  const actualWeight = item.product.productType === "stone"
                    ? Number(item.caratWeight || minWeight)
                    : Number(item.product.ct_weight || 1);
                  productTotal = Number(item.product.price) * actualWeight;
                } else {
                  productTotal = Number(item.product.price) * Number(item.quantity || 1);
                }
              } else {
                productTotal = Number(item.product?.price || 0) * Number(item.quantity || 1);
              }

              if (item.product?.needCertification) {
                productTotal += 75 * (item.product.purchaseByCarat ? 1 : Number(item.quantity || 1));
              }
              return total + productTotal;
            }, 0);
          },

          updateTotals: (deliveryMethod = "delivery", customOption?: "2day" | "overnight") => {
            const subtotal = get().getTotalPrice();
            const option = customOption || get().shippingOption || "2day";
            let shipping = 0;
            if (deliveryMethod === "store" || subtotal === 0) {
              shipping = 0;
            } else if (subtotal >= 500) {
              shipping = option === "overnight" ? 15 : 0;
            } else {
              shipping = option === "overnight" ? 38 : 23;
            }
            const grandTotal = subtotal + shipping;
            set({
              cartTotal: subtotal,
              shippingTotal: shipping,
              grandTotal,
            });
          },
        }),
        {
          name: `cart-storage-${normalizedKey}`,
          partialize: (state) => ({
            cart: state.cart,
            cartTotal: state.cartTotal,
            shippingOption: state.shippingOption,
            shippingTotal: state.shippingTotal,
            grandTotal: state.grandTotal,
          }),
        },
      ),
    );
    setupLiveCartSync(
      getRegistry()[normalizedKey],
      normalizedKey,
      `cart-storage-${normalizedKey}`,
    );
  }
  return getRegistry()[normalizedKey];
};
