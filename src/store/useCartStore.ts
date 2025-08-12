import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  product: {
    id: any;
    handle:string;
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
    size: string;
    type: string;
    goldColor: string;
    gemstone: string;
    length: string;
    firstStone: string;
    secondStone: string;
  };
  quantity: number;
  caratWeight: string;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  cartTotal: number; // NEW
  setCartTotal: (total: number) => void; // NEW
}

const storeRegistry: any = {};

export const getCartStore = (userKey: string) => {
  if (!storeRegistry[userKey]) {
    storeRegistry[userKey] = create<CartStore>()(
      persist(
        (set, get) => ({
          cart: [],
          cartTotal: 0, // NEW
          setCartTotal: (total) => set({ cartTotal: total }), // NEW
          addToCart: (newItem) =>
            set((state) => {
              const existingItem = state.cart.find(
                (item) => item.product.productId === newItem.product.productId
              );
              if (existingItem) {
                return {
                  cart: state.cart.map((item) =>
                    item.product.productId === newItem.product.productId
                      ? { ...item, quantity: item.quantity + newItem.quantity }
                      : item
                  ),
                };
              } else {
                return { cart: [...state.cart, newItem] };
              }
            }),
          removeFromCart: (productId) =>
            set((state) => ({
              cart: state.cart.filter(
                (item) => item.product.productId !== productId
              ),
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
          name: `cart-storage-${userKey}`,
        }
      )
    );
  }
  return storeRegistry[userKey];
};
