import { create } from "zustand";
import type { Order, PaymentMethod, ShippingAddress, ShippingMethod } from "../types";

interface CheckoutState {
  step: number;
  shippingAddress: ShippingAddress | null;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  placedOrder: Order | null;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setShippingMethod: (method: ShippingMethod) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setPlacedOrder: (order: Order) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  step: 0,
  shippingAddress: null,
  shippingMethod: "standard",
  paymentMethod: "cod",
  placedOrder: null,
  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: s.step + 1 })),
  prevStep: () => set((s) => ({ step: Math.max(0, s.step - 1) })),
  setShippingAddress: (address) => set({ shippingAddress: address }),
  setShippingMethod: (method) => set({ shippingMethod: method }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setPlacedOrder: (order) => set({ placedOrder: order }),
  reset: () =>
    set({
      step: 0,
      shippingAddress: null,
      shippingMethod: "standard",
      paymentMethod: "cod",
      placedOrder: null,
    }),
}));
