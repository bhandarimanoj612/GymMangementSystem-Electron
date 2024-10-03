import React, { useState } from "react";
import Heading from "../../../global/components/error/heading";
import logo from "../../../assets/nutrilogo.jpg";
import { IToasterData } from "../../../global/components/toaster/interface";
import { openDB, save } from "../../../global/indexedDB/db";
import { Member } from "../../../global/indexedDB/interface";
import { useMemberStoreN } from "../../../global/indexedDB/store";

const RegisterMember = ({
  setToasterData,
}: {
  setToasterData: React.Dispatch<React.SetStateAction<IToasterData>>;
}) => {
  //states
  const [loading, setLoading] = useState(false);
  const [registerMemberObj, setRegisterMemberObj] = useState<Member>({
    id: 0,
    name: "",
    address: "",
    phnNo: "",
    addedAt: "",
    isDeleted: false,

    membership: "",
  });

  const clearMember = () => {
    setRegisterMemberObj({
      id: 0,
      name: "",
      address: "",
      phnNo: "",
      addedAt: "",
      isDeleted: false,

      membership: "",
    });
  };
  const { fetchMembers, members } = useMemberStoreN();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      //check duplicate
      const isDuplicate = members?.find(
        (item) => item?.phnNo === registerMemberObj?.phnNo
      );
      if (isDuplicate) {
        setToasterData({
          open: true,
          message: "Phone No already exist",
          severity: "error",
        });
        return;
      }

      setLoading(true);
      const db = await openDB("members");
      await save(
        db,
        {
          ...registerMemberObj,
          id: Math.floor(Math.random() * 10000),
          addedAt: new Date().toISOString(),
        },
        "members"
      );

      setToasterData({
        open: true,
        message: "Member registered successfully",
        severity: "success",
      });
      await fetchMembers();
      clearMember();
    } catch (error) {
      console.log(error);
      setToasterData({
        open: true,
        message: "Failed to register member",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex-1 px-4 lg:py-[.1em] py-[1.5em] max-h-[650px] pb-[2em] font-sans  ">
        <div className="lg:hidden">
          <Heading heading="Register Member" />
        </div>

        <div className="mt-5 text-[#585858] flex justify-center w-full ">
          <div className="flex flex-col items-center justify-center py-[1em] px-[.5rem] rounded shadow-md w-[25em] bg-white">
            <div className="w-[5em] h-[5em] select-none cursor-pointer ">
              <img
                src={logo}
                alt="image"
                className="mx-auto w-20 h-20 rounded-full border-4"
              />
            </div>
            <div className="w-[95%] mt-2">
              <div className="font-mono font-[900] select-none">
                <div className="mb-2 leading-8 text-center">
                  <p className="text-[1.95rem] tracking-widest cursor-pointer capitalize">
                    NutriHub
                  </p>
                </div>
              </div>
              <div className="mt-[1.75em] w-full">
                <form
                  action="#"
                  onSubmit={(e) => handleSubmit(e)}
                  className="flex flex-col gap-y-4"
                >
                  <div className="flex flex-col gap-y-1">
                    <label htmlFor="username" className="font-semibold">
                      Name <span className="text-red-500 ml-[-3px]">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      required
                      value={registerMemberObj.name}
                      onChange={(e) =>
                        setRegisterMemberObj({
                          ...registerMemberObj,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter name"
                      className="w-full pl-2 bg-white py-2 rounded outline-0 border border-[#9e9c9c] focus:border-[#585858] focus:border-[1.5px] focus:rounded-sm tracking-wide focus:placeholder:text-[#585858]"
                    />
                  </div>

                  <div className="flex flex-col gap-y-1">
                    <label htmlFor="address" className="font-semibold">
                      Address <span className="text-red-500 ml-[-3px]">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      required
                      value={registerMemberObj.address}
                      onChange={(e) =>
                        setRegisterMemberObj({
                          ...registerMemberObj,
                          address: e.target.value,
                        })
                      }
                      placeholder="Enter address"
                      className="w-full pl-2 bg-white py-2 rounded outline-0 border border-[#9e9c9c] focus:border-[#585858] focus:border-[1.5px] focus:rounded-sm tracking-wide focus:placeholder:text-[#585858]"
                    />
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label htmlFor="phoneNo" className="font-semibold">
                      Phone No.
                      <span className="text-red-500 ml-[-3px]">*</span>
                    </label>
                    <input
                      type="number"
                      name="phoneNo"
                      id="phoneNo"
                      required
                      value={registerMemberObj.phnNo}
                      onChange={(e) =>
                        setRegisterMemberObj({
                          ...registerMemberObj,
                          phnNo: e.target.value,
                        })
                      }
                      placeholder="Enter Phn No"
                      className="w-full pl-2 bg-white py-2 rounded outline-0 border border-[#9e9c9c] focus:border-[#585858] focus:border-[1.5px] focus:rounded-sm tracking-wide focus:placeholder:text-[#585858]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="  rounded btn text-[#fff] bg-slate-900 hover:bg-black"
                  >
                    {loading ? "Registering..." : "Register"}
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

export default RegisterMember;
