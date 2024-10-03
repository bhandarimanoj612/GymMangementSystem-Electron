export interface IUseLayoutStore {
  isAuth: boolean;
  checkAuth: () => Promise<void>;
}
