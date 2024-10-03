import { create } from "zustand";
import { ISignInObj, ISignInObjError, ISignInStore } from "./interface";
import { axios_no_auth } from "../../global/components/config";

export const useSIgnInStore = create<ISignInStore>((set, get) => ({
  singInObj: {
    name: "",
    password: "",
  },
  setSignInObj: (obj: ISignInObj) => {
    set((state: ISignInStore) => ({
      singInObj: { ...state.singInObj, ...obj },
    }));
  },

  clearSignInObj: () => {
    set(() => ({
      singInObj: {
        name: "",
        password: "",
      },
    }));
  },
  signInObjError: { name: "", password: "" },
  setSignInObjError: (obj: ISignInObjError) => {
    set((state: ISignInStore) => ({
      signInObjError: { ...state.signInObjError, ...obj },
    }));
  },
  clearSignInObjError: () => {
    set(() => ({
      signInObjError: { name: "", password: "" },
    }));
  },
  staffName: "",

  signIn: async () => {
    try {
      const response = await axios_no_auth.post("user/login", get().singInObj);

      if (response.data.token) {
        set({ staffName: response.data.name });
        localStorage.setItem("staff", get().staffName);

        return {
          status: true,
          token: response.data.token,
          role: response.data.userRole,
        };
      }
      return false;
    } catch (error) {
      return false;
    }
  },
}));
