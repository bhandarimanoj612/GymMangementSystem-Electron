import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";

import { BiMessageSquareEdit } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { CgGym } from "react-icons/cg";

import { Member } from "../../../global/indexedDB/interface";
import { useMemberStoreN } from "../../../global/indexedDB/store";
import { openDB, softDeleteMember } from "../../../global/indexedDB/db";
import { useSubscriptionStore } from "./subscription/store";
import { MdPersonAddDisabled } from "react-icons/md";

const MembersTable = ({
  setCount,
}: {
  setCount: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const navigate = useNavigate();

  // states
  const [nav, setNav] = useState("All");
  const [search, setSearch] = useState("");

  const [filteredData, setFilteredData] = useState<Member[]>([]); // To store filtered members

  const { members, fetchMembers } = useMemberStoreN();
  const { fetchSubscriptions } = useSubscriptionStore();

  const handleSearchIcon = (e: any) => {
    setSearch(e.target.value);
  };

  // delete handlers
  // const deleteClick = (member: Member) => {
  //   setOpenDelete(true);
  //   setDeleteData(member);
  // };

  const deleteClick = async (member: Member) => {
    try {
      const db = await openDB("members"); // Open the database
      await softDeleteMember(db, member?.id); // Soft delete by setting isDeleted to true

      await fetchMembers(); // Fetch members again to update the UI
    } catch (error) {
      console.error("Failed to mark member as deleted", error);
    }
  };

  // clear purchase handler

  const updateClick = (member: Member) => {
    navigate(`/members/update/${member?.id}`);
  };

  const plansClick = (member: Member) => {
    navigate(`/members/plans/${member?.id}`);
  };

  // Fetch members from IndexedDB and set it to state
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Filter members based on search input
  useEffect(() => {
    setCount(members?.length);
    const checkExpires = async () => {
      const updatedMembers = await Promise.all(
        members?.map(async (i) => {
          const res = await fetchSubscriptions(i?.id?.toString());
          const rev = res?.sort((a, b) => {
            return (
              new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
            );
          });
          i.membership = rev[0]?.state || "pending";
          return i;
        }) || []
      );
      return updatedMembers;
    };

    const handleFiltering = async () => {
      const updatedMembers = await checkExpires();
      const mem = updatedMembers
        ?.reverse()
        ?.filter(
          (i) => nav?.toLocaleLowerCase() !== "deactivated" && !i?.isDeleted
        );

      if (search) {
        setFilteredData(
          mem?.filter(
            (member) =>
              member?.name?.toLowerCase()?.includes(search.toLowerCase()) ||
              member?.address?.toLowerCase()?.includes(search.toLowerCase()) ||
              member?.phnNo?.toLowerCase()?.includes(search.toLowerCase()) ||
              member?.addedAt?.toLowerCase()?.includes(search.toLowerCase())
          )
        );
      } else if (nav) {
        switch (nav?.toLocaleLowerCase()) {
          case "all":
            setFilteredData(mem);
            break;
          case "active":
            setFilteredData(
              mem?.filter(
                (member) => member?.membership?.toLowerCase() === "active"
              )
            );
            break;
          case "expired":
            setFilteredData(
              mem?.filter(
                (member) => member?.membership?.toLowerCase() !== "active"
              )
            );
            break;
          case "deactivated":
            console.log("object hah");
            setFilteredData(members?.filter((member) => member?.isDeleted));
            break;
        }
      } else {
        setFilteredData(mem);
      }
    };

    handleFiltering();
  }, [search, nav, members]);

  return (
    <>
      <div className=" bg-[#fff] rounded @container px-4 py-5 sm:px-5 lg:px-6 h-[full] w-[full] ">
        <div className="flex items-center justify-between mt-3 relative">
          <p className="text-[1.15rem] capitalize font-bold text-[#585858]">
            {nav} ({filteredData?.length}) records
          </p>
          <div className="relative flex">
            <input
              type="search"
              placeholder="Search member"
              name="search"
              id="search"
              onChange={handleSearchIcon}
              className="bg-white border-[1.5px] border-[#585858] focus:border-[#585858] focus:outline-none pl-2 text-[#585858] py-1 @[30em]:py-1.5 w-full rounded-sm text-[.9rem] @[30em]:text-[1rem]"
            />
            {search === "" && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <BsSearch />
              </div>
            )}
          </div>
          <div className="flex gap-4 text-[.7rem] sm:text-[.9rem] md:text-[1rem] font-sans font-semibold text-[#585858]">
            {nav === "Active" ? (
              <div onClick={() => setNav("All")} className="cursor-pointer">
                All
              </div>
            ) : (
              <div onClick={() => setNav("Active")} className="cursor-pointer">
                Active
              </div>
            )}
            {nav === "Expired" ? (
              <div onClick={() => setNav("All")} className="cursor-pointer">
                All
              </div>
            ) : (
              <div onClick={() => setNav("Expired")} className="cursor-pointer">
                Expired
              </div>
            )}
            {nav === "Deactivated" ? (
              <div
                onClick={() => setNav("All")}
                className="lg:mr-3 cursor-pointer"
              >
                All
              </div>
            ) : (
              <div
                onClick={() => setNav("Deactivated")}
                className="lg:mr-3 cursor-pointer"
              >
                Deactivated
              </div>
            )}
          </div>
        </div>

        {/* Table starts here */}
        <div className=" text-[#585858] py-4 w-full max-h-[200px] md:max-h-[600px] md:overflow-y-scroll">
          <table className="  table w-full table-xs @[25em]:table-sm @[50em]:table-md border border-slate-200">
            <thead>
              {/* table heading starts here */}
              <tr className=" top-0 bg-slate-900 text-white ">
                <th>SN</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>

                <th>Membership</th>
                <th>registeredAt</th>
                <th>Actions</th>
              </tr>
              {/* table heading ends here */}
            </thead>
            {/* tables data */}
            <tbody>
              {Array.isArray(filteredData) && filteredData.length > 0 ? (
                filteredData.map((member, index) => (
                  <React.Fragment key={member.id}>
                    <tr>
                      <td className="text-black font-semibold">{index + 1}</td>
                      <td className="text-black font-semibold">
                        {member?.name}
                      </td>
                      <td className="text-black font-semibold">
                        {member?.phnNo}
                      </td>
                      <td className="text-black font-semibold">
                        {member?.address}
                      </td>

                      <td className="text-black font-semibold">
                        {member?.membership}
                      </td>
                      <td className="text-black font-semibold">
                        {member?.addedAt?.split("T")[0]}
                      </td>

                      <td className="flex gap-3 ml-[1em]">
                        {member?.isDeleted ? (
                          <div
                            className="bg-green-500 p-2"
                            onClick={() => deleteClick(member)}
                          >
                            restore
                          </div>
                        ) : (
                          <MdPersonAddDisabled
                            onClick={() => deleteClick(member)}
                            className=" text-[.9rem] md:text-[1rem] lg:text-[1.2rem] text-red-500/80  cursor-pointer"
                          />
                        )}

                        <BiMessageSquareEdit
                          className="text-[1.2rem] text-[green]/80 cursor-pointer"
                          onClick={() => updateClick(member)}
                        />
                        <CgGym
                          className="text-[1.2rem] text-[green]/80 cursor-pointer"
                          onClick={() => plansClick(member)}
                        />
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
                    Members not available
                  </td>
                </tr>
              )}
            </tbody>
            {/* ends of table data */}
          </table>
        </div>
      </div>
      {/* <Delete data={deleteData} open={openDelete} setOpen={setOpenDelete} />
       */}
    </>
  );
};

export default MembersTable;
