import { Car, City, Sublocations } from "@/types";
import { create } from "zustand";

interface BookingDraft {
  city: City | null;
  sublocation: Sublocations | null;
  car: Car | null;
  startTime: Date | null;
  endTime: Date | null;
}

interface BookingStore {
  draft: BookingDraft;
  setCity: (city: City) => void;
  setSublocation: (sublocation: Sublocations) => void;
  setCar: (car: Car) => void;
  setTime: (startTime: Date, endTime: Date) => void;
  resetDraft: () => void;
}

const emptyDraft: BookingDraft = {
  city: null,
  sublocation: null,
  car: null,
  startTime: null,
  endTime: null,
};

export const useBookingStore = create<BookingStore>((set) => ({
  draft: emptyDraft,

  setCity: (city) =>
    set((s) => ({ draft: { ...s.draft, city, sublocation: null, car: null } })),

  setSublocation: (sublocation) => set((s) => ({ draft: { ...s.draft } })),

  setCar: (car) => set((s) => ({ draft: { ...s.draft, car } })),

  setTime: (startTime, endTime) =>
    set((s) => ({ draft: { ...s.draft, startTime, endTime } })),

  resetDraft: () => set({ draft: emptyDraft }),
}));
