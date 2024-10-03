export interface IGlobalStore {
  activeUrl: string;
  setActiveUrl: (url: string) => void;
  user: {
    role: string;
    token: string;
  };
  setUser: (data: { role: string; token: string }) => void;
}
