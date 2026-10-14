import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface JewelryCartItem {
  cartItemId: string;
  product: {
    productType: string;
    productId: string;
    title: string;
    goldColor: string;
    ct_weight: number;
    cut: string;
    image_url: string;
    price: number;
    quality: string;
    shape: string;
    size: string;
    type: string;
  };
  quantity: number;
}

interface JewelryCartStore {
  cart: JewelryCartItem[];
  addToCart: (item: JewelryCartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

const serverJewelryRegistry: Record<string, any> = {};

const getJewelryRegistry = () => {
  if (typeof window !== "undefined") {
    if (!(window as any).__jewelryCartStoreRegistry) {
      (window as any).__jewelryCartStoreRegistry = {};
    }
    return (window as any).__jewelryCartStoreRegistry;
  }
  return serverJewelryRegistry;
};


// Keeps every browser tab in sync with localStorage. Zustand's persist only reads
// storage once at creation, so without this a stale tab overwrites newer data
// written by another tab (e.g. wiping items added in the first tab).
const crossTabSync = (store: any, storageKey: string) => {
  if (typeof window === "undefined") return;

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

export const getJewelryCartStore = (userKey: string) => {
  if (!getJewelryRegistry()[userKey]) {
    getJewelryRegistry()[userKey] = create<JewelryCartStore>()(
      persist(
        (set, get) => ({
          cart: [],
          addToCart: (newItem) =>
            set((state) => ({
              cart: [...state.cart, newItem],
            })),

          removeFromCart: (cartItemId: string) =>
            set((state) => ({
              cart: state.cart.filter((item) => item.cartItemId !== cartItemId),
            })),

          updateQuantity: (productId, quantity) =>
            set((state) => ({
              cart: state.cart.map((item) =>
                item.product.productId === productId
                  ? { ...item, quantity }
                  : item
              ),
            })),
          clearCart: () => set({ cart: [] }),
          getTotalPrice: () => {
            const cart = get().cart;
            return cart.reduce(
              (total, item) => total + item.product.price * item.quantity,
              0
            );
          },
        }),
        {
          name: `jewelry-cart-storage-${userKey}`,
        }
      )
    );
    crossTabSync(getJewelryRegistry()[userKey], `jewelry-cart-storage-${userKey}`);
  }
  return getJewelryRegistry()[userKey];
};
