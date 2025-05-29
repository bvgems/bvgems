import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  phoneNumber: string;
  isAddressStored?: boolean;
};

type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setAddressStored: (stored: boolean) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setAddressStored: (stored) =>
        set((state) =>
          state.user ? { user: { ...state.user, isAddressStored: stored } } : {}
        ),
    }),
    {
      name: "user-storage",
    }
  )
);
