import { create } from "zustand";

// interface User {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
// }

// interface UserStore {
//   user: User | null;
//   setUser: (user: User | null) => void;
// }

interface GemStones {
  name: string;
}

interface GemstoneStore {
  gemstones: GemStones | null;
  setGemStones: (gemstones: GemStones | null) => void;
}

export const usestoneStore = create<GemstoneStore>((set) => ({
  gemstones: null,
  setGemStones: (gemstones: GemStones | null) => set({ gemstones }),
}));
