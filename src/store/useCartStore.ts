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
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleCertification: (productId: string, checked: boolean) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  updateTotals: () => void;
  setCartTotal: (total: number) => void;
  freeGiftSession: boolean;
  setFreeGiftSession: (value: boolean) => void;
}

const storeRegistry: any = {};

export const getCartStore = (userKey: string) => {
  if (!storeRegistry[userKey]) {
    storeRegistry[userKey] = create<CartStore>()(
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
              const existingItem = state.cart.find(
                (item) => item.product.productId === newItem.product.productId,
              );
              if (existingItem) {
                return {
                  cart: state.cart.map((item) =>
                    item.product.productId === newItem.product.productId
                      ? { ...item, quantity: item.quantity + newItem.quantity }
                      : item,
                  ),
                };
              } else {
                return { cart: [...state.cart, newItem] };
              }
            }),

          removeFromCart: (productId) =>
            set((state) => ({
              cart: state.cart.filter(
                (item) => item.product.productId !== productId,
              ),
            })),

          updateQuantity: (productId, quantity) =>
            set((state) => ({
              cart: state.cart.map((item) =>
                item.product.productId === productId
                  ? { ...item, quantity }
                  : item,
              ),
            })),

          toggleCertification: (productId, checked) =>
            set((state) => ({
              cart: state.cart.map((item) =>
                item.product.productId === productId
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
              let productTotal = item.product.price * item.quantity;
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
  }
  return storeRegistry[userKey];
};
