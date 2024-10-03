import { create } from "zustand";
import { IMemberStore, IRegisterMember } from "./interface";
import { axios_auth } from "../../global/components/config";

export const useMemberStore = create<IMemberStore>((set, get) => ({
  registerMemberObj: {
    name: "",
    address: "",
    phnNo: "",
  },

  setRegisterMemberObj: (obj: IRegisterMember) => {
    set((state: IMemberStore) => ({
      registerMemberObj: {
        ...state.registerMemberObj,
        ...obj,
      },
    }));
  },

  clearRegisterMemberObj: () => {
    set(() => ({
      registerMemberObj: {
        name: "",
        address: "",
        phnNo: "",
      },
    }));
  },

  createMember: async () => {
    try {
      const res = await axios_auth.post(
        "members/create",
        get().registerMemberObj
      );

      return res.data?.message;
    } catch (error) {
      return "cannot create member";
    }
  },
  updateMemberObj: {
    name: "",
    address: "",
    phnNo: "",
  },

  setUpdateMemberObj: (obj: IRegisterMember) => {
    set((state: IMemberStore) => ({
      updateMemberObj: {
        ...state.registerMemberObj,
        ...obj,
      },
    }));
  },

  clearUpdateMemberObj: () => {
    set(() => ({
      updateMemberObj: {
        name: "",
        address: "",
        phnNo: "",
      },
    }));
  },
  updateMember: async (id: string) => {
    try {
      const res = await axios_auth.put(
        "members/update/" + id,
        get().updateMemberObj
      );

      return res.data?.message;
    } catch (error) {
      return "cannot update member";
    }
  },
  //for getting all
  getMemberById: async (id: string) => {
    try {
      const res = await axios_auth.get("members/get/" + id);
      if (res.data.status === 200) {
        set({ updateMemberObj: res.data.member });
      }
      return "got member";
    } catch (error) {
      return "cannot create member";
    }
  },
  //for getting all
  members: [],
  history:[],

  getAllMember: async () => {
    try {
      const res = await axios_auth.get("members/get-allRecent");

      if (res.data.status === 200) {
        set({ members: res.data.members });
      } else {
        set({ members: [] });
      }
    } catch (error) {
      return null;
    }
  },

  //purchase histry
  getAllPurchaseHistry: async (id:string) => {
    try {
      const res = await axios_auth.get("members/get-history/" + id);

      if (res.data.status === 200) {
        set({ history: res.data.data });
      } else {
        set({ history: [] });
      }
    } catch (error) {
      return null;
    }
  },
  deleteMember: async (id: string) => {
    try {
      const res = await axios_auth.delete(`members/delete/${id}`);

      if (res.data.status === 200) {
        return true;
      }
    } catch (error) {
      return true;
    }
  },
  clearPurchase: async (id: string) => {
    try {
      const res = await axios_auth.patch(`members/clear/${id}`);

      if (res.data.status === 200) {
        return true;
      }
    } catch (error) {
      return true;
    }
  },
}));
