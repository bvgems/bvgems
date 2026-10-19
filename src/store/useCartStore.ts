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
  if (p.isGift) {
    return `gift_${pid}`;
  }
  const pType = p.productType || "stone";
  const shade = (p.shade || "").trim();
  const byCarat = Boolean(p.purchaseByCarat);

  if (pType === "stone" || pType === "freeSizeStone") {
    // Distinguish carat lot from stone piece orders so they appear as separate cards
    return `${pType}_${pid}_${shade}_${byCarat ? "carat" : "piece"}`;
  }

  // Jewelry and other products
  const variant = [p.goldColor, p.size, p.length, p.totalCaratWeight].filter(Boolean).join("_");
  return `${pType}_${pid}_${variant || "default"}`;
};

interface CartStore {
  cart: CartItem[];
  cartTotal: number;
  shippingTotal: number;
  grandTotal: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemIdOrProductId: string, shade?: string, purchaseByCarat?: boolean) => void;
  updateQuantity: (cartItemIdOrProductId: string, quantity: number, shade?: string, purchaseByCarat?: boolean) => void;
  updateCaratWeight: (cartItemIdOrProductId: string, caratWeight: number, shade?: string) => void;
  toggleCertification: (cartItemIdOrProductId: string, checked: boolean, shade?: string, purchaseByCarat?: boolean) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  updateTotals: () => void;
  setCartTotal: (total: number) => void;
  freeGiftSession: boolean;
  setFreeGiftSession: (value: boolean) => void;
  updateGiftItem: (updatedProduct: Partial<CartItem["product"]>) => void;
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


// Keeps every browser tab in sync with localStorage. Zustand's persist only reads
// storage once at creation, so without this a stale tab overwrites newer data
// written by another tab (e.g. wiping items added in the first tab).
const crossTabSync = (store: any, storageKey: string) => {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const rehydrate = () => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw === null) {
        store.setState({ cart: [] });
      } else {
        store.persist.rehydrate();
      }
    } catch {}
  };

  window.addEventListener("storage", (e: StorageEvent) => {
    if (e.key === storageKey) rehydrate();
  });

  // Safety net: when a tab becomes active again, pull the latest data.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") rehydrate();
  });
  window.addEventListener("focus", rehydrate);
};

const debounceTimers: Record<string, NodeJS.Timeout> = {};

const debouncedSaveCartToDb = (userKey: string, cart: CartItem[]) => {
  if (typeof window === "undefined" || !userKey || userKey === "guest") return;

  if (debounceTimers[userKey]) {
    clearTimeout(debounceTimers[userKey]);
  }

  debounceTimers[userKey] = setTimeout(async () => {
    try {
      await axios.post("/api/cart", { cart });
    } catch (err) {
      console.error("Failed to auto-save cart to DB:", err);
    }
  }, 400);
};

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    Object.keys(debounceTimers).forEach((key) => {
      if (key && key !== "guest" && debounceTimers[key]) {
        clearTimeout(debounceTimers[key]);
        const currentCart = getRegistry()[key]?.getState()?.cart;
        if (currentCart && navigator.sendBeacon) {
          navigator.sendBeacon(
            "/api/cart",
            new Blob([JSON.stringify({ cart: currentCart })], { type: "application/json" })
          );
        }
      }
    });
  });
}

export const fetchAndSyncUserCart = async (userId: string | number) => {
  if (typeof window === "undefined" || !userId || String(userId) === "guest") return;
  try {
    const res = await axios.get("/api/cart");
    if (res?.data?.cart && Array.isArray(res.data.cart)) {
      const store = getCartStore(String(userId));
      store.setState({ cart: res.data.cart });
    }
  } catch (err) {
    console.error("Failed to fetch user cart from DB:", err);
  }
};

export const mergeGuestCartOnLogin = async (userId: string | number) => {
  if (typeof window === "undefined" || !userId || String(userId) === "guest") return;
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
      const res = await axios.post("/api/cart", { guestCart });
      if (res?.data?.cart) {
        window.localStorage.removeItem("cart-storage-guest");
        const userStore = getCartStore(String(userId));
        userStore.setState({ cart: res.data.cart });
      }
    }
  } catch (err) {
    console.error("Failed to merge guest cart on login:", err);
  }
};

export const getCartStore = (userKey: string) => {
  if (!getRegistry()[userKey]) {
    getRegistry()[userKey] = create<CartStore>()(
      persist(
        (set, get) => ({
          cart: [],
          cartTotal: 0,
          shippingTotal: 0,
          grandTotal: 0,
          freeGiftSession: false,

          setCartTotal: (total) => set({ cartTotal: total }),
          setFreeGiftSession: (value) => set({ freeGiftSession: value }),

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

              if (itemToAdd.product?.isGift) {
                const alreadyExists = state.cart.find(
                  (item) => item.product?.isGift,
                );
                if (alreadyExists) return state;
                return { cart: [...state.cart, itemToAdd] };
              }

              const existingIndex = state.cart.findIndex((item) => {
                const existingId = item.cartItemId || generateCartItemId(item);
                if (existingId === targetCartItemId) return true;

                const sameProduct =
                  String(item.product?.productId ?? item.product?.id ?? "") ===
                  String(itemToAdd.product?.productId ?? itemToAdd.product?.id ?? "");
                const sameShade =
                  (item.product?.shade || "").trim() ===
                  (itemToAdd.product?.shade || "").trim();
                const sameMode =
                  Boolean(item.product?.purchaseByCarat) ===
                  Boolean(itemToAdd.product?.purchaseByCarat);
                const notGift = !item.product?.isGift;

                return sameProduct && sameShade && sameMode && notGift;
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
                return { cart: updatedCart };
              }

              // Different purchase mode or product: add as separate card
              return { cart: [...state.cart, itemToAdd] };
            }),

          updateGiftItem: (updatedProduct) =>
            set((state) => ({
              cart: state.cart.map((item) =>
                item.product?.isGift
                  ? {
                      ...item,
                      product: {
                        ...item.product,
                        ...updatedProduct,
                      },
                    }
                  : item,
              ),
            })),

          removeFromCart: (cartItemIdOrProductId, shade, purchaseByCarat) =>
            set((state) => ({
              cart: state.cart.filter((item) => {
                const itemId = item.cartItemId || generateCartItemId(item);
                if (itemId === cartItemIdOrProductId) return false;

                if (purchaseByCarat !== undefined) {
                  const sameProduct =
                    String(item.product?.productId ?? item.product?.id ?? "") ===
                    String(cartItemIdOrProductId);
                  const sameShade =
                    (item.product?.shade || "").trim() === (shade || "").trim();
                  const sameMode =
                    Boolean(item.product?.purchaseByCarat) === Boolean(purchaseByCarat);
                  if (sameProduct && sameShade && sameMode) return false;
                } else if (shade !== undefined) {
                  const sameProduct =
                    String(item.product?.productId ?? item.product?.id ?? "") ===
                    String(cartItemIdOrProductId);
                  const sameShade =
                    (item.product?.shade || "").trim() === (shade || "").trim();
                  if (sameProduct && sameShade) return false;
                }

                return true;
              }),
            })),

          updateQuantity: (cartItemIdOrProductId, quantity, shade, purchaseByCarat) =>
            set((state) => ({
              cart: state.cart.map((item) => {
                const itemId = item.cartItemId || generateCartItemId(item);
                const matches =
                  itemId === cartItemIdOrProductId ||
                  (purchaseByCarat !== undefined
                    ? String(item.product?.productId ?? item.product?.id ?? "") ===
                        String(cartItemIdOrProductId) &&
                      (item.product?.shade || "").trim() === (shade || "").trim() &&
                      Boolean(item.product?.purchaseByCarat) === Boolean(purchaseByCarat)
                    : String(item.product?.productId ?? item.product?.id ?? "") ===
                        String(cartItemIdOrProductId) &&
                      (item.product?.shade || "").trim() === (shade || "").trim());

                return matches ? { ...item, quantity } : item;
              }),
            })),

          updateCaratWeight: (cartItemIdOrProductId, caratWeight, shade) =>
            set((state) => ({
              cart: state.cart.map((item) => {
                const itemId = item.cartItemId || generateCartItemId(item);
                const matches =
                  itemId === cartItemIdOrProductId ||
                  (String(item.product?.productId ?? item.product?.id ?? "") ===
                    String(cartItemIdOrProductId) &&
                    (item.product?.shade || "").trim() === (shade || "").trim() &&
                    Boolean(item.product?.purchaseByCarat));

                if (matches) {
                  const stoneWeight = Number(item.product?.ct_weight) || 0;
                  const reqNum = Math.max(0.01, Number(caratWeight) || 0);
                  const { stoneCount, totalCarats } = calculateNearestStones(stoneWeight, reqNum);
                  return {
                    ...item,
                    quantity: stoneCount,
                    caratWeight: `${totalCarats}`,
                    requestedCarats: reqNum,
                  };
                }
                return item;
              }),
            })),

          toggleCertification: (cartItemIdOrProductId, checked, shade, purchaseByCarat) =>
            set((state) => ({
              cart: state.cart.map((item) => {
                const itemId = item.cartItemId || generateCartItemId(item);
                const matches =
                  itemId === cartItemIdOrProductId ||
                  (purchaseByCarat !== undefined
                    ? String(item.product?.productId ?? item.product?.id ?? "") ===
                        String(cartItemIdOrProductId) &&
                      (item.product?.shade || "").trim() === (shade || "").trim() &&
                      Boolean(item.product?.purchaseByCarat) === Boolean(purchaseByCarat)
                    : String(item.product?.productId ?? item.product?.id ?? "") ===
                        String(cartItemIdOrProductId) &&
                      (item.product?.shade || "").trim() === (shade || "").trim());

                return matches
                  ? {
                      ...item,
                      product: { ...item.product, needCertification: checked },
                    }
                  : item;
              }),
            })),

          clearCart: () => {
            if (typeof window !== "undefined" && userKey !== "guest") {
              axios.delete("/api/cart").catch(() => {});
            }
            set({ cart: [], cartTotal: 0, shippingTotal: 0, grandTotal: 0 });
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
                productTotal += 75 * Number(item.quantity || 1);
              }
              return total + productTotal;
            }, 0);
          },

          updateTotals: () => {
            const subtotal = get().getTotalPrice();
            const shipping = subtotal < 200 && subtotal > 0 ? 15 : 0;
            const grandTotal = subtotal + shipping;
            set({
              cartTotal: subtotal,
              shippingTotal: shipping,
              grandTotal,
            });
          },
        }),
        {
          name: `cart-storage-${userKey}`,
        },
      ),
    );
    crossTabSync(getRegistry()[userKey], `cart-storage-${userKey}`);

    if (typeof window !== "undefined" && userKey !== "guest") {
      // 1. Initial fetch from PostgreSQL for cross-device consistency (DB is master for logged in users)
      axios
        .get("/api/cart")
        .then((res) => {
          if (res?.data?.cart && Array.isArray(res.data.cart)) {
            getRegistry()[userKey].setState({ cart: res.data.cart });
          }
        })
        .catch(() => {});

      // 2. Subscribe to store changes to automatically persist to PostgreSQL
      getRegistry()[userKey].subscribe((state: CartStore, prevState: CartStore) => {
        if (state.cart !== prevState.cart) {
          debouncedSaveCartToDb(userKey, state.cart);
        }
      });
    }
  }
  return getRegistry()[userKey];
};
