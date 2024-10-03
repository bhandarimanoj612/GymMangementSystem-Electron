import { ISubscription } from "./components/subscription/interface";

export interface IRegisterMember {
  name: string;
  address: string;
  phnNo: string;
}
export interface IMemberStore {
  registerMemberObj: IRegisterMember;
  setRegisterMemberObj: (obj: IRegisterMember) => void;
  clearRegisterMemberObj: () => void;
  createMember: () => Promise<string>;
  members: ITableMember[];
  getAllMember: () => Promise<null | undefined>;
  deleteMember: (id: string) => Promise<true | undefined>;
  clearPurchase: (id: string) => Promise<true | undefined>;

  updateMemberObj: IRegisterMember;
  setUpdateMemberObj: (obj: IRegisterMember) => void;
  updateMember: (id: string) => Promise<string>;
  clearUpdateMemberObj: () => void;
  getMemberById: (id: string) => Promise<"cannot create member" | "got member">;
  history: IPurchaseHistry[];
  getAllPurchaseHistry: (id: string) => Promise<null | undefined>;
}

export interface ITableMember {
  id: string;
  name: string;
  address: string;
  phnNo: string;
  totalPurchase: number;
}

export interface IPurchaseHistry {
  id: string;
  address: string;
  description: string;
  purchaseAmt: number;
  createdDate: string;
  createdNepDate: string;
}
export interface IDeleteProps {
  data: ISubscription;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteClick: (subscription: ISubscription) => Promise<void>;
}
export interface IClearProps {
  data: ITableMember;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
