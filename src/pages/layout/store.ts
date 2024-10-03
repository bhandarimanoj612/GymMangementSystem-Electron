import { create } from "zustand";
import { axios_auth } from "../../global/components/config";
import { IUseLayoutStore } from "./interface";

export const useLayoutStore = create<IUseLayoutStore>((set) => ({
  isAuth: false,
  checkAuth: async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await axios_auth.get("user/check-auth");
        if (res.data.status === 200) {
          set(() => ({ isAuth: true }));
        }
        if (res.data.status === 400) {
          set(() => ({ isAuth: false }));

          return;
        }
      }
    } catch (error) {
      set(() => ({ isAuth: false }));
    }
  },
}));
