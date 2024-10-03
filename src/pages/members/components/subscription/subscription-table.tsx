import React, { useEffect, useState } from "react";
import { ISubscription } from "./interface";
import { useSubscriptionStore } from "./store";
import { AiFillDelete } from "react-icons/ai";
import {
  deleteSubscription,
  openDB,
  updateSubscriptionStatus,
} from "../../../../global/indexedDB/db";
import { SiCashapp } from "react-icons/si";
import Delete from "../../../../global/components/delete";
const SubscriptionTable = ({ id }: { id: string }) => {
  // delete states
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState<ISubscription>(
    {} as ISubscription
  );
  const { subscriptions, fetchSubscriptions } = useSubscriptionStore();
  const [filteredData, setFilteredData] = useState<ISubscription[]>([]);
  useEffect(() => {
    const rev = subscriptions?.sort((a, b) => {
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });
    setFilteredData(rev);
  }, [subscriptions]);

  const handleDelete = (sub: ISubscription) => {
    setDeleteData(sub);
    setOpenDelete(true);
  };
  const deleteClick = async (subscription: ISubscription) => {
    try {
      const db = await openDB("subscriptions"); // Open the database
      await deleteSubscription(db, subscription?.id); // Soft delete by setting isDeleted to true

      await fetchSubscriptions(id); // Fetch subscriptions again to update the UI
    } catch (error) {
      console.error("Failed to mark subscription as deleted", error);
    }
  };
  const dueClick = async (subscription: ISubscription) => {
    try {
      const db = await openDB("subscriptions"); // Open the database
      await updateSubscriptionStatus(db, subscription?.id); // Soft delete by setting isDeleted to true

      await fetchSubscriptions(id); // Fetch subscriptions again to update the UI
    } catch (error) {
      console.error("Failed to mark subscription as deleted", error);
    }
  };

  return (
    <div className=" bg-[#fff] rounded @container px-4 py-5 sm:px-5 lg:px-6 h-[550px] ">
      <div className="flex items-center justify-between mt-3 relative">
        <p className="text-[1.15rem] capitalize font-bold text-[#585858]"></p>
        <div className="relative flex"></div>
        <div className="flex gap-4 text-[.7rem] sm:text-[.9rem] md:text-[1rem] font-sans font-semibold text-[#585858]">
          <div
            className="cursor-pointer btn bg-black text-white"
            onClick={() => window.history.back()}
          >
            Back
          </div>
        </div>
      </div>

      {/* Table starts here */}
      <div className=" text-[#585858] py-4 w-full max-h-[200px] md:max-h-[600px] md:overflow-y-scroll">
        <table className="  table w-full table-xs @[25em]:table-sm @[50em]:table-md border border-slate-200">
          <thead>
            {/* table heading starts here */}
            <tr className=" top-0 bg-slate-900 text-white ">
              <th>SN</th>
              <th>Plan</th>
              <th>Price</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Membership</th>
              <th>AddedAt</th>
              <th>Actions</th>
            </tr>
            {/* table heading ends here */}
          </thead>
          {/* tables data */}
          <tbody>
            {Array.isArray(filteredData) && filteredData.length > 0 ? (
              filteredData.map((subscription, index) => (
                <React.Fragment key={subscription.id}>
                  <tr>
                    <td className="text-black font-semibold">{index + 1}</td>
                    <td className="text-black font-semibold">
                      {subscription?.plan}
                    </td>
                    <td className="text-black font-semibold">
                      {subscription?.price}
                    </td>
                    <td className="text-black font-semibold">
                      {subscription?.startDate}
                    </td>
                    <td className="text-black font-semibold">
                      {subscription?.endDate}
                    </td>
                    <td className="text-black font-semibold">
                      {subscription?.status}

                      {subscription?.status?.toLocaleLowerCase() === "due" && (
                        <> ( {subscription?.price - subscription?.advance})</>
                      )}
                    </td>
                    <td className="text-black font-semibold">
                      {subscription?.state}
                    </td>
                    <td className="text-black font-semibold">
                      {subscription?.addedAt?.split("T")[0]}
                    </td>
                    <td className="flex gap-3 ml-[1em]">
                      <AiFillDelete
                        onClick={() => handleDelete(subscription)}
                        className=" text-[.9rem] md:text-[1rem] lg:text-[1.2rem] text-red-500/80  cursor-pointer"
                      />

                      {subscription?.status?.toLocaleLowerCase() === "due" && (
                        <>
                          {" "}
                          {
                            <SiCashapp
                              title="Pay"
                              onClick={() => dueClick(subscription)}
                              className=" text-[.9rem] md:text-[1rem] lg:text-[1.2rem] text-green-500/80  cursor-pointer"
                            />
                          }
                        </>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="font-semibold text-center text-black"
                >
                  subscriptions not available
                </td>
              </tr>
            )}
          </tbody>
          {/* ends of table data */}
        </table>
      </div>
      <Delete
        data={deleteData}
        open={openDelete}
        setOpen={setOpenDelete}
        deleteClick={deleteClick}
      />
    </div>
  );
};

export default SubscriptionTable;
