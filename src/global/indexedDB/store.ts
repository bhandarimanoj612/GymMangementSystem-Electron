import { create } from "zustand";
import { getCash, getMembers, getNotes, openDB } from "./db";
import { IMemberStoreN, INote, Member } from "./interface";
import { ICash } from "../../pages/cash/interface";

export const useMemberStoreN = create<IMemberStoreN>((set) => ({
  isAuthenticated:false,
  setAuthenticated: (value: boolean) => {
    set({ isAuthenticated: value });
  },
  members: [],
  cashes: [],
  notes: [],
  fetchMembers: async () => {
    try {
      const db = await openDB("members");
      const dbMembers = await getMembers(db);
      set({ members: dbMembers });
      return dbMembers;
    } catch (error) {
      console.error("Failed to fetch members from IndexedDB:", error);
      return [] as Member[];
    }
  },
  fetchCash: async () => {
    try {
      const db = await openDB("cash");
      const dbCash = await getCash(db);
      set({ cashes: dbCash });
   
      return dbCash;
    } catch (error) {
      console.error("Failed to fetch cash from IndexedDB:", error);
      return [] as ICash[];
    }
  },
  fetchNotes: async (memberId:string) => {
    try {
      const db = await openDB("notes");
      const dbNotes = await getNotes(db, memberId);
      set({ notes: dbNotes });
   
      return dbNotes;
    } catch (error) {
      console.error("Failed to fetch Notes from IndexedDB:", error);
      return [] as INote[];
    }
  },
}));
