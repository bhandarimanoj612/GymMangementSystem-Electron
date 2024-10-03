import { IToasterData } from "../../global/components/toaster/interface";
import { ISignInObj, ISignInObjError } from "./interface";

export class SignInClass {
  validateObj = (obj: ISignInObj) => {
    const error: ISignInObjError = {} as ISignInObjError;
    if (!obj.name) error.name = "username is required";
    if (!obj.password) error.password = "password is required";
    return error;
  };

  signIn = async (
    obj: ISignInObj,

    loginUser: () => Promise<
      | false
      | {
          status: boolean;
          token: string;
          role: string;
        }
    >,
    clearSignInObj: () => void,
    setSignInObjError: (obj: ISignInObjError) => void,
    clearSignInObjError: () => void,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setToasterData: React.Dispatch<React.SetStateAction<IToasterData>>,
    setUser: (data: { role: string; token: string }) => void
  ) => {
    const errors: ISignInObjError = this.validateObj(obj);
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      setSignInObjError(errors);
      setToasterData({
        severity: "warning",
        message: "empty fields",
        open: true,
      });
      return false;
    }
    try {
      const res = await loginUser();
      if (res && Object.keys(res).length > 0) {
        setUser({
          token: res.token,
          role: res.role,
        });
        setLoading(false);
        clearSignInObj();
        clearSignInObjError();
        setToasterData({
          severity: "success",
          message: "login success",
          open: true,
        });
        return true;
      }

      setLoading(false);
      setToasterData({
        severity: "error",
        message: "login fail",
        open: true,
      });
      return false;
    } catch (error) {
      setLoading(false);
      setToasterData({
        severity: "error",
        message: "login fail",
        open: true,
      });
      return false;
    }
  };
}
