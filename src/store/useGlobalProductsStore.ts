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

export type FreeSizeGemstone = {
  id: number;
  gemstone_type: string;
  shape: string;
  dimension: string;
  ct_weight: string;
  lot_number: string;
  single_or_matched: string;
  price: string;
  enhancement: string;
  is_certified: boolean;
  image_url: string;
  origin: string;
  total_price: string;
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
  freeSizeGemstones: FreeSizeGemstone[];
  products: JeweleryProduct[];
  setGemstones: (items: LooseGemstone[]) => void;
  addGemstone: (item: LooseGemstone) => void;
  setFreeSizeGemstone: (items: FreeSizeGemstone[]) => void;
  addFreeSizeGemstone: (item: FreeSizeGemstone) => void;
  setProducts: (items: JeweleryProduct[]) => void;
  addProduct: (item: JeweleryProduct) => void;
  clearAll: () => void;
};

export const useGemStore = create<GemStore>()(
  persist(
    (set) => ({
      gemstones: [],
      freeSizeGemstones: [],
      products: [],
      setGemstones: (items) => set({ gemstones: items }),
      addGemstone: (item) =>
        set((state) => ({ gemstones: [...state.gemstones, item] })),
      setFreeSizeGemstone: (items) => set({ freeSizeGemstones: items }),
      addFreeSizeGemstone: (item) =>
        set((state) => ({
          freeSizeGemstones: [...state.freeSizeGemstones, item],
        })),
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
