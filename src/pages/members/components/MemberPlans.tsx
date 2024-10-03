import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { IToasterData } from "../../../global/components/toaster/interface";
import Toaster from "../../../global/components/toaster/toaster";
import SubscriptionTable from "./subscription/subscription-table";
import SubscriptionForm from "./subscription/subscription-form";
import { useSubscriptionStore } from "./subscription/store";
import { ISubscription } from "./subscription/interface";
import { openDB, updateSubscriptionState } from "../../../global/indexedDB/db";
import NoteForm from "./notes/NoteForm";

const MemberPlans = () => {
  const { id } = useParams<{ id: string }>();
  const ids = id ?? "";
  // toaster states
  const [toasterData, setToasterData] = useState<IToasterData>({
    open: false,
    message: "",
    severity: undefined,
  });
  // Close Toaster
  const closeToaster = (value: boolean) => {
    setToasterData({
      open: value,
      message: "",
      severity: undefined,
    });
  };
  const { fetchSubscriptions, subscriptions } = useSubscriptionStore();
  const [add, setAdd] = useState(false);
  const [note, setNote] = useState(false);
  function checkSubscriptionStateByLatestEndDate() {
    // Find the latest endDate in the subscriptions
    const latestEndDate = subscriptions
      ?.filter((sub) => sub?.endDate) // Filter out subscriptions without an end date
      .map((sub) => new Date(sub?.endDate)) // Convert to Date objects
      .reduce(
        (latest, current) => (current > latest ? current : latest),
        new Date(0)
      ); // Find the latest endDate

    // Get today's date
    const today = new Date();

    // Update state of each subscription based on the latest end date
    return subscriptions.map((subscription) => {
      const subscriptionEndDate = subscription.endDate
        ? new Date(subscription.endDate)
        : null;

      // Check if subscription is expired based on latest end date and today's date
      const state =
        subscriptionEndDate &&
        subscriptionEndDate < today &&
        subscriptionEndDate <= latestEndDate
          ? "expired"
          : "active";

      // Return updated subscription object with new state
      return {
        ...subscription,
        state,
      } as ISubscription;
    });
  }

  useEffect(() => {
    fetchSubscriptions(ids);
  }, [fetchSubscriptions]);
  useEffect(() => {
    const check = async () => {
      const updated = checkSubscriptionStateByLatestEndDate();
      const db = await openDB("subscriptions");
      await updateSubscriptionState(db, updated);
    };
    check();
  }, [fetchSubscriptions]);

  return (
    <div className="p-10">
      <Toaster data={toasterData} close={closeToaster} />
      <div className="flex gap-3 m-2">
        <div
          className="btn bg-green-300 font-mono"
          onClick={() => setAdd(!add)}
        >
          Add Subscription
        </div>
        <div
          className="btn bg-yellow-300 font-mono"
          onClick={() => setNote(!note)}
        >
          Add Notes
        </div>
      </div>

      {add && <SubscriptionForm setToasterData={setToasterData} id={ids} />}
      {note && <NoteForm setToasterData={setToasterData} id={ids} />}

      {/* Subscription History */}
      <SubscriptionTable id={ids} />
    </div>
  );
};

export default MemberPlans;
