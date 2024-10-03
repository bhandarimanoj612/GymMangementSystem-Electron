export type ISubscriptionStore = {
  subscriptions: ISubscription[];
  fetchSubscriptions: (memerId:string) => Promise<ISubscription[]>;
};

export interface ISubscription {
  state: string;
  id: number;
  plan: string;
  startDate: string;
  endDate: string;
  memberId: number;
  price: number;
  status: string;
  advance: number;
  addedAt: string;
}
