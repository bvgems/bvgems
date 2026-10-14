import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
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
  caratWeight: string;
}

interface CartStore {
  cart: CartItem[];
  cartTotal: number;
  shippingTotal: number;
  grandTotal: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, shade?: string) => void;
  updateQuantity: (productId: string, quantity: number, shade?: string) => void;
  toggleCertification: (productId: string, checked: boolean, shade?: string) => void;
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
              if (newItem.product.isGift) {
                const alreadyExists = state.cart.find(
                  (item) => item.product.isGift,
                );

                if (alreadyExists) return state;
              }

              const existingItem = state.cart.find(
                (item) =>
                  item.product.productId === newItem.product.productId &&
                  item.product.shade === newItem.product.shade &&
                  !item.product.isGift,
              );

              if (existingItem) {
                return {
                  cart: state.cart.map((item) =>
                    item.product.productId === newItem.product.productId &&
                    item.product.shade === newItem.product.shade
                      ? { ...item, quantity: item.quantity + newItem.quantity }
                      : item,
                  ),
                };
              }

              return { cart: [...state.cart, newItem] };
            }),

          updateGiftItem: (updatedProduct) =>
            set((state) => ({
              cart: state.cart.map((item) =>
                item.product.isGift
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

          removeFromCart: (productId, shade) =>
            set((state) => ({
              cart: state.cart.filter(
                (item) => !(item.product.productId === productId && item.product.shade === shade),
              ),
            })),

          updateQuantity: (productId, quantity, shade) =>
            set((state) => ({
              cart: state.cart.map((item) =>
                item.product.productId === productId && item.product.shade === shade
                  ? { ...item, quantity }
                  : item,
              ),
            })),

          toggleCertification: (productId, checked, shade) =>
            set((state) => ({
              cart: state.cart.map((item) =>
                item.product.productId === productId && item.product.shade === shade
                  ? {
                      ...item,
                      product: { ...item.product, needCertification: checked },
                    }
                  : item,
              ),
            })),

          clearCart: () =>
            set({ cart: [], cartTotal: 0, shippingTotal: 0, grandTotal: 0 }),

          getTotalPrice: () => {
            const cart = get().cart;
            return cart.reduce((total, item) => {
              let productTotal = 0;

              if (
                item.product.productType === "stone" ||
                item.product.productType === "freeSizeStone"
              ) {
                if (item.product.purchaseByCarat) {
                  const caratPrice = item.product.productType === "stone" 
                    ? Number(item.product.price) * Number(item.caratWeight)
                    : Number(item.product.price) * Number(item.product.ct_weight);
                  productTotal = caratPrice;
                } else {
                  productTotal = Number(item.product.price) * item.quantity;
                }
              } else {
                productTotal = Number(item.product.price) * item.quantity;
              }

              if (item.product.needCertification) {
                productTotal += 75 * item.quantity;
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
  }
  return getRegistry()[userKey];
};
