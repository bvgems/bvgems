import { create } from "zustand";
import { persist } from "zustand/middleware";

type GuestUser = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

type GuestUserStore = {
  guestUser: GuestUser | null;
  setGuestUser: (GuestUser: GuestUser | null) => void;
  clearGuestUser: () => void;
};

export const useGuestUserStore = create<GuestUserStore>()(
  persist(
    (set, get) => ({
      guestUser: null,
      setGuestUser: (guestUser) => set({ guestUser }),
      clearGuestUser: () => set({ guestUser: null }),
    }),
    {
      name: "user-storage",
    }
  )
);
