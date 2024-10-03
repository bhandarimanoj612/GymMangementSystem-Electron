import { create } from "zustand";
import { getSubscriptions, openDB } from "../../../../global/indexedDB/db";
 
import { ISubscription, ISubscriptionStore } from "./interface";

export const useSubscriptionStore = create<ISubscriptionStore>((set) => ({
  subscriptions: [],
 
  fetchSubscriptions: async (memerId:string) => {
    try {
      const db = await openDB("subscriptions");
      const dbSubscriptions = await getSubscriptions(db, memerId);
      set({ subscriptions: dbSubscriptions });
      return dbSubscriptions;
    } catch (error) {
      console.error("Failed to fetch Subscriptions from IndexedDB:", error);
      return [] as ISubscription[];
    }
  },
}));
