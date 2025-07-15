import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LooseGemstone = {
  id: number;
  collection_slug: string;
  shape: string;
  size: string;
  ct_weight: string;
  cut: string;
  quality: string;
  price: string;
  type: string;
  color: string;
  image_url: string;
  value: string;
};

export type JeweleryProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  productType: string;
  createdAt: string;
  tags: string[];
  images: {
    edges: {
      node: {
        url: string;
        altText: string | null;
      };
    }[];
  };
  variants: {
    edges: {
      node: {
        price: {
          amount: string;
          currencyCode: string;
        };
        title: string;
        sku: string | null;
      };
    }[];
  };
};

type GemStore = {
  gemstones: LooseGemstone[];
  products: JeweleryProduct[];
  setGemstones: (items: LooseGemstone[]) => void;
  addGemstone: (item: LooseGemstone) => void;
  setProducts: (items: JeweleryProduct[]) => void;
  addProduct: (item: JeweleryProduct) => void;
  clearAll: () => void;
};

export const useGemStore = create<GemStore>()(
  persist(
    (set) => ({
      gemstones: [],
      products: [],
      setGemstones: (items) => set({ gemstones: items }),
      addGemstone: (item) =>
        set((state) => ({ gemstones: [...state.gemstones, item] })),
      setProducts: (items) => set({ products: items }),
      addProduct: (item) =>
        set((state) => ({ products: [...state.products, item] })),
      clearAll: () => set({ gemstones: [], products: [] }),
    }),
    {
      name: "gem-store-storage",
    }
  )
);
