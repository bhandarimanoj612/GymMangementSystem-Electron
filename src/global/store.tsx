import { create } from "zustand";
import { IGlobalStore } from "./interface";
export const useGlobalStore = create<IGlobalStore>((set) => ({
  activeUrl: "",
  setActiveUrl: (url: string) => set({ activeUrl: url }),
  user: {
    role: "",
    token: "",
  },
  setUser: (data: { role: string; token: string }) => {
    set((state: IGlobalStore) => ({
      user: {
        ...state.user,
        ...data,
      },
    }));
  },
}));
