import { create } from "zustand";
import { persist } from "zustand/middleware";

type dataFlags = {
  shippingData: boolean;
  businessReference: boolean;
  amlInfo: boolean;
};

type StepperUser = {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  phoneNumber: string;
  password: string;
};

type BusinessVerification = {
  ownerName: string;
  companyAddress: string;
  country: string;
  state: string;
  city: string;
  companyWebsite: string;
};

type ShippingAddress = {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
  email: string;
};

type BusinessReference = {
  companyName: string;
  contactPerson: string;
  phoneNumber: string;
  companyAddress: string;
  addtionalNotes: string;
};

type amlInfo = {
  amlStatus: string;
};

type UserStore = {
  stepperUser: StepperUser | null;
  setStepperUser: (user: StepperUser | null) => void;
  clearStepperUser: () => void;

  businessVerification: BusinessVerification | null;
  setBusinessVerification: (data: BusinessVerification | null) => void;
  clearBusinessVerification: () => void;

  shippingAddress: ShippingAddress | null;
  setShippingAddress: (data: ShippingAddress | null) => void;
  clearShippingAddress: () => void;

  businessReference: BusinessReference | null;
  setBusinessReference: (data: BusinessReference | null) => void;
  clearBusinessReference: () => void;

  amlInfo: amlInfo | null;
  setAmlInfo: (data: amlInfo | null) => void;
  clearAmlInfo: () => void;

  dataFlags: dataFlags | null;
  setDataFlags: (data: dataFlags | null) => void;
  clearDataFlags: () => void;

  hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
};

export const useStpperStore = create<UserStore>()(
  persist(
    (set, get) => ({
      stepperUser: null,
      setStepperUser: (stepperUser) => set({ stepperUser }),
      clearStepperUser: () => set({ stepperUser: null }),

      businessVerification: null,
      setBusinessVerification: (data) => set({ businessVerification: data }),
      clearBusinessVerification: () => set({ businessVerification: null }),

      shippingAddress: null,
      setShippingAddress: (data) => set({ shippingAddress: data }),
      clearShippingAddress: () => set({ shippingAddress: null }),

      businessReference: null,
      setBusinessReference: (data) => set({ businessReference: data }),
      clearBusinessReference: () => set({ businessReference: null }),

      amlInfo: null,
      setAmlInfo: (data) => set({ amlInfo: data }),
      clearAmlInfo: () => set({ amlInfo: null }),

      dataFlags: null,
      setDataFlags: (data) => set({ dataFlags: data }),
      clearDataFlags: () => set({ dataFlags: null }),

      hasHydrated: false,
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
    }),
    {
      name: "user-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
