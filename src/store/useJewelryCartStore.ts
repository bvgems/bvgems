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

const jewelryStoreRegistry: any = {};

export const getJewelryCartStore = (userKey: string) => {
  if (!jewelryStoreRegistry[userKey]) {
    jewelryStoreRegistry[userKey] = create<JewelryCartStore>()(
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
  }
  return jewelryStoreRegistry[userKey];
};
