export type ISignInObj = {
  name: string | FormDataEntryValue | null;
  password: string | FormDataEntryValue | null;
};
export type ISignInObjError = {
  name: string;
  password: string;
};

export interface ISignInStore {
  singInObj: ISignInObj;
  setSignInObj: (obj: ISignInObj) => void;
  clearSignInObj: () => void;

  signInObjError: ISignInObjError;
  setSignInObjError: (obj: ISignInObjError) => void;
  clearSignInObjError: () => void;

  staffName: string;

  signIn: () => Promise<
    | false
    | {
        status: boolean;
        token: string;
        role: string;
      }
  >;
}
