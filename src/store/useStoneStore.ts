import { create } from "zustand";

interface GemStones {
  name: string;
}

interface GemstoneStore {
  gemstones: GemStones | any;
  setGemStones: (gemstones: GemStones | null) => void;
}

export const usestoneStore = create<GemstoneStore>((set) => ({
  gemstones: null,
  setGemStones: (gemstones: GemStones | null) => set({ gemstones }),
}));
