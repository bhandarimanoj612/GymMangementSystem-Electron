import React, { useCallback, useEffect, useState } from "react";
import Heading from "../../../global/components/error/heading";
import sts from "../../../assets/nutrilogo.jpg";
import { IToasterData } from "../../../global/components/toaster/interface";
import { useParams } from "react-router-dom";
import Toaster from "../../../global/components/toaster/toaster";
import {
  openDB,
  getMemberById,
  updateMember,
} from "../../../global/indexedDB/db"; // Import your IndexedDB functions
import { Member } from "../../../global/indexedDB/interface";

const MembersUpdate = () => {
  const { id } = useParams<{ id: string }>(); // Get ID from URL params
  const [loading, setLoading] = useState(false);

  // Member state for update
  const [updateMemberObj, setUpdateMemberObj] = useState<Member>({
    id: 0,
    name: "",
    address: "",
    phnNo: "",
    addedAt: "",
    isDeleted: false,

    membership: "",
  });

  // Toaster state
  const [toasterData, setToasterData] = useState<IToasterData>({
    open: false,
    message: "",
    severity: undefined,
  });

  // Close Toaster
  const closeToaster = (value: boolean) => {
    setToasterData({
      open: value,
      message: null,
      severity: undefined,
    });
  };

  // Handle form submit for updating member
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const db = await openDB("members"); // Open IndexedDB connection
      const response = await updateMember(db, updateMemberObj); // Update member in IndexedDB

      setToasterData({
        open: true,
        message: response,
        severity: response?.includes("success") ? "success" : "error",
      });

      if (response?.includes("success")) {
        // Clear or reset form after successful update
      }
    } catch (error) {
      console.error("Error updating member", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch member by ID when component is mounted
  const getMemberId = useCallback(async () => {
    if (id) {
      try {
        const db = await openDB("members"); // Open IndexedDB connection
        const member = await getMemberById(db, parseInt(id)); // Get member by ID
        setUpdateMemberObj(member); // Populate form with fetched member data
      } catch (error) {
        console.error("Error fetching member by ID", error);
      }
    }
  }, [id]);

  useEffect(() => {
    getMemberId(); // Fetch member on component mount
  }, [getMemberId]);


  return (
    <div className="p-10">
      <Toaster data={toasterData} close={closeToaster} />
      <div className="flex-1 px-4 lg:py-[.1em] py-[1.5em] max-h-[650px] pb-[2em] font-sans p-10">
      <div
            className="cursor-pointer btn bg-black text-white mb-4 text-[.7rem] sm:text-[.9rem] md:text-[1rem] font-sans font-semibold"
            onClick={() => window.history.back()}
          >
            Back
          </div>
        <div>
          <Heading heading="Update Member" />
        </div>
      
        <div className="mt-5 text-[#585858] flex justify-center w-full">
       
          <div className="flex flex-col items-center justify-center py-[1em] px-[.5rem] rounded shadow-md w-[25em] bg-white">
            <div className="w-[5em] h-[5em] select-none cursor-pointer">
              <img
                src={sts}
                alt="image"
                className="mx-auto w-20 h-20 rounded-full border-4"
              />
            </div>
            <div className="w-[95%] mt-2">
              <div className="font-mono font-[900] select-none">
                <div className="mb-2 leading-8 text-center">
                  <p className="text-[1.95rem] tracking-widest cursor-pointer capitalize">
                    STS
                  </p>
                </div>
              </div>
              <div className="mt-[1.75em] w-full">
                <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
                  <div className="flex flex-col gap-y-3">
                    <label htmlFor="username" className="font-semibold">
                      Name <span className="text-red-500 ml-[-3px]">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      required
                      value={updateMemberObj?.name}
                      onChange={(e) =>
                        setUpdateMemberObj({
                          ...updateMemberObj,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter name"
                      className="w-full pl-2 bg-white py-2 rounded outline-0 border border-[#9e9c9c] focus:border-[#585858] focus:border-[1.5px] focus:rounded-sm tracking-wide focus:placeholder:text-[#585858]"
                    />
                  </div>

                  <div className="flex flex-col gap-y-3">
                    <label htmlFor="address" className="font-semibold">
                      Address <span className="text-red-500 ml-[-3px]">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      required
                      value={updateMemberObj?.address}
                      onChange={(e) =>
                        setUpdateMemberObj({
                          ...updateMemberObj,
                          address: e.target.value,
                        })
                      }
                      placeholder="Enter address"
                      className="w-full pl-2 bg-white py-2 rounded outline-0 border border-[#9e9c9c] focus:border-[#585858] focus:border-[1.5px] focus:rounded-sm tracking-wide focus:placeholder:text-[#585858]"
                    />
                  </div>

                  <div className="flex flex-col gap-y-3">
                    <label htmlFor="phoneNo" className="font-semibold">
                      Phone No.
                      <span className="text-red-500 ml-[-3px]">*</span>
                    </label>
                    <input
                      type="number"
                      name="phoneNo"
                      id="phoneNo"
                      required
                      value={updateMemberObj?.phnNo}
                      onChange={(e) =>
                        setUpdateMemberObj({
                          ...updateMemberObj,
                          phnNo: e.target.value,
                        })
                      }
                      placeholder="Enter Phone No."
                      className="w-full pl-2 bg-white py-2 rounded outline-0 border border-[#9e9c9c] focus:border-[#585858] focus:border-[1.5px] focus:rounded-sm tracking-wide focus:placeholder:text-[#585858]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-4 rounded btn text-[#fff] bg-slate-900 hover:bg-black"
                  >
                    {loading ? "Updating..." : "Update"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersUpdate;
