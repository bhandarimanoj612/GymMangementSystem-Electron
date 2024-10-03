import { ICash } from "../../pages/cash/interface";

export interface Member {
  membership: string;
  id: number;
  name: string;
  address: string;
  phnNo: string;
  addedAt: string;
  isDeleted: boolean;
}
export interface IUser {
  id: number;
  name: string;
  password: string;
}
export interface INote {
  memberId: number;
  id: number;
  title: string;
  description: string;
  addedAt: string;
}

export interface IMemberStoreN {
  members: Member[];
  cashes: ICash[];
  notes: INote[];
  fetchMembers: () => Promise<Member[]>;
  fetchCash: () => Promise<ICash[]>;
  fetchNotes: (memberId: string) => Promise<INote[]>;

  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
}
