import { useEffect, useState } from "react";
import { useMemberStoreN } from "../../../../global/indexedDB/store";
import { ISubscription } from "./interface";
import { openDB, saveSubscription } from "../../../../global/indexedDB/db";
import { IToasterData } from "../../../../global/components/toaster/interface";
import { useSubscriptionStore } from "./store";

const SubscriptionForm = ({
  setToasterData,
  id,
}: {
  setToasterData: React.Dispatch<React.SetStateAction<IToasterData>>;
  id: string;
}) => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [plan, setPlan] = useState<string>("");

  const { fetchSubscriptions, subscriptions } = useSubscriptionStore();

  const [price, setPrice] = useState<number>(0);
  const [paid, setPaid] = useState<boolean>(true);
  const [due, setDue] = useState<boolean>(false);
  const [advance, setAdvance] = useState<number>(0);

  const { fetchCash, cashes } = useMemberStoreN();
  useEffect(() => {
    fetchCash();
  }, [fetchCash]);

  // Mock subscription history, replace with API call to fetch member plans by ID

  const handlePlanChange = (selectedPlan: string) => {
    const plan = selectedPlan?.split("-")[1];
    console.log(plan);
    if (selectedPlan !== "select") {
      setPlan(selectedPlan); // Update the plan state
    } else {
      setPlan(""); // Reset if "select" is chosen
      setPrice(0); // Reset price to 0 if plan is not valid
      return;
    }

    const selectedCash = cashes.find((item) => item.type === selectedPlan);
    if (selectedCash) {
      setPrice(selectedCash?.price); // Set price based on plan
    } else {
      setPrice(0); // Set default if no price is found
    }

    // Find the latest end date from existing subscriptions
    const latestEndDate = subscriptions
      ?.filter((sub) => sub?.endDate) // Filter out any subscriptions without an end date
      .map((sub) => new Date(sub.endDate)) // Convert to Date objects
      .reduce(
        (latest, current) => (current > latest ? current : latest),
        new Date(0)
      ); // Find the latest end date

    // Set the new start date to the day after the latest end date (or today's date if no subscriptions)
    const start =
      latestEndDate > new Date(0) ? new Date(latestEndDate) : new Date();
    start.setDate(start.getDate() + 1); // Start the new subscription the day after the latest one

    setStartDate(start.toISOString().split("T")[0]); // Set startDate to the new value

    let calculatedEndDate: Date | null = null;
    switch (plan) {
      case "monthly":
        calculatedEndDate = new Date(start);
        calculatedEndDate.setMonth(calculatedEndDate.getMonth() + 1);
        break;
      case "quarterly":
        calculatedEndDate = new Date(start);
        calculatedEndDate.setMonth(calculatedEndDate.getMonth() + 3);
        break;
      case "1/2 yearly":
        calculatedEndDate = new Date(start);
        calculatedEndDate.setMonth(calculatedEndDate.getMonth() + 6);
        break;
      case "1 yearly":
        calculatedEndDate = new Date(start);
        calculatedEndDate.setFullYear(calculatedEndDate.getFullYear() + 1);
        break;
      case "custom":
        calculatedEndDate = null;
        break;
      default:
        calculatedEndDate = null;
        break;
    }

    setEndDate(
      calculatedEndDate ? calculatedEndDate.toISOString().split("T")[0] : null
    );
  };

  const handleSubscriptionSubmit = async () => {
    if (!startDate || !endDate) {
      setToasterData({
        open: true,
        message: "Please select start and end date",
        severity: "error",
      });
      return;
    }

    if (!plan || !price) {
      setToasterData({
        open: true,
        message: "Please select a plan and price",
        severity: "error",
      });
      return;
    }

    // Convert startDate and endDate to Date objects for comparison
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    if (newStartDate >= newEndDate) {
      setToasterData({
        open: true,
        message: "End date must be after the start date",
        severity: "error",
      });
      return;
    }

    let status = "";

    if (paid) {
      status = "Full Paid";
    }
    if (due) {
      status = "Due";

      if (advance > price) {
        setToasterData({
          open: true,
          message: "Advance amount should be less than price",
          severity: "error",
        });
        return;
      }
    }

    const newSubscription: ISubscription = {
      id: Math.floor(Math.random() * 10000),
      plan: plan,
      startDate: startDate,
      endDate: endDate,
      memberId: parseInt(id || "0"),
      price: price,
      status,
      advance,
      addedAt: new Date().toISOString(),
      state: "active",
    };

    try {
      const db = await openDB("subscriptions");

      // Fetch existing subscriptions for validation

      // Validate if the new subscription overlaps with any existing one
      const hasOverlap = subscriptions?.some((sub) => {
        console.log(plan);
        const planOnly =plan?.split("-")[0];
        console.log(planOnly);
        // console.log(plan)
        if (planOnly === "Zumba/Aerobics") {
          // allow overlap for Zumba/Aerobics
          return false;
        }
        const existingStartDate = new Date(sub?.startDate);
        const existingEndDate = new Date(sub?.endDate);

        // Check if the new start or end date falls within an existing subscription's date range
        return (
          (newStartDate >= existingStartDate &&
            newStartDate <= existingEndDate) ||
          (newEndDate >= existingStartDate && newEndDate <= existingEndDate)
        );
      });

      if (hasOverlap) {
        setToasterData({
          open: true,
          message: "Subscription dates overlap with an existing subscription",
          severity: "error",
        });
        return;
      }

      // Save the new subscription if validation passes
      await saveSubscription(db, newSubscription);

      // Show success toaster
      setToasterData({
        open: true,
        message: "Subscription added successfully",
        severity: "success",
      });

      // Fetch updated subscriptions list
      await fetchSubscriptions(id);

      // Reset form after successful submission
      setPlan("");
      setPrice(0);
      setStartDate(null);
      setEndDate(null);
    } catch (error) {
      setToasterData({
        open: true,
        message: "Failed to add subscription. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <div className="border-white border-2 p-4  rounded-lg m-2">
      <div className="flex justify-center font-extrabold text-xl mb-6 text-white">
        Subscription Plans
      </div>

      <div className="grid grid-cols-2 gap-4 items-center space-y-4 " >
        {/* Subscription Plan Selection */}
        <div className="flex flex-col">
          <label className="font-semibold mb-2 text-white">Select Plan:</label>
          <select
            value={plan}
            onChange={(e) => handlePlanChange(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="select">select</option>
            {cashes.map((item) => (
              <option key={item?.id} value={item?.type}>
                {item.type}
              </option>
            ))}

            <option value="custom">Custom</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="font-semibold mb-2 text-white"> Price:</label>
          <input
            type="number"
            value={price || ""}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        {/* Start and End Date Selection */}
        <div className="flex flex-col">
          <label className="font-semibold mb-2 text-white"> Start Date:</label>
          <input
            type="date"
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-2 text-white"> End Date:</label>
          <input
            type="date"
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className=" flex  gap-2">
          <label className="font-semibold mb-2 text-white"> Full Paid:</label>
          <input
            type="checkbox"
            onChange={(e) => {
              setPaid(e.target.checked);
              if (e.target.checked) {
                setDue(false); // Uncheck 'Due' when 'Full Paid' is checked
                setAdvance(0); // Reset advance to 0
              }
            }}
            checked={paid} // Sync with state
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className=" flex  gap-2">
          <label className="font-semibold mb-2 text-white"> Due:</label>
          <input
            type="checkbox"
            onChange={(e) => {
              setDue(e.target.checked);
              if (e.target.checked) {
                setPaid(false); // Uncheck 'Full Paid' when 'Due' is checked
              }
            }}
            checked={due} // Sync with state
            className="p-2 border border-gray-300 rounded-md"
          />

          {due && (
            <input
              type="number"
              placeholder="Enter advance amount"
              value={advance || ""}
              onChange={(e) => setAdvance(Number(e.target.value))}
              className="p-2 border border-gray-300 rounded-md"
            />
          )}
        </div>
      </div>
      <button
        onClick={handleSubscriptionSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
      >
        Submit Subscription
      </button>
    </div>
  );
};

export default SubscriptionForm;
