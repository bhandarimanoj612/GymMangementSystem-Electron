import { TbDashboard } from "react-icons/tb";
import logo from "../../assets/nutrilogo.jpg";

import { SiCashapp } from "react-icons/si";
import { MdOutlinePeople } from "react-icons/md";
import { SlLogout } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "../../global/store";
import { IGlobalStore } from "../../global/interface";

import LogOutClick from "./LogOutClick";
import { useState } from "react";

const Sidebar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const logOutClick = () => {
    setOpen(true);
  };
  const navigate = useNavigate();
  // for border
  const activeUrl = useGlobalStore((state: IGlobalStore) => state.activeUrl);
  const setActiveUrl = useGlobalStore(
    (state: IGlobalStore) => state.setActiveUrl
  );
  //for user

  return (
    <>
      <div className="flex flex-col gap-4 w-[4em] h-screen bg-[#1F1F1F] p-4  text-gray-800 font-semibold text-xl border-r-2 border-gray-300  justify-between sticky top-0">
        <div className="flex flex-col   ">
          <div className="">
            <img src={logo} alt="" className="rounded-[2rem] w-[2.4em]" />
          </div>
          <div
            className={`mt-[3em] px-[.4em] py-2 rounded-md cursor-pointer select-none delay-150 transition-[.5s] hover:opacity-100
            ${activeUrl === "dashboard" && "border  opacity-100"}`}
            title="dashboard"
            onClick={() => {
              setActiveUrl("dashboard");
              navigate("dashboard");
            }}
          >
            <TbDashboard size={30} color="#FFFFFF" className="" />
          </div>
          <div
            className={`mt-[1em] px-[.4em] py-2 rounded-md  cursor-pointer select-none delay-150 transition-[.5s] hover:opacity-100 ${
              activeUrl === "user" && "border border-white opacity-100"
            }`}
            title="staff_user"
            onClick={() => {
              setActiveUrl("user");
              navigate("members");
            }}
          >
            <MdOutlinePeople size={30} color="#FFFFFF" className="" />
          </div>

          <div
            className={`mt-[1em] px-[.4em] py-2 rounded-md  cursor-pointer select-none delay-150 transition-[.5s] hover:opacity-100 ${
              activeUrl === "cash" && "border border-white opacity-100"
            }`}
            title="cash"
            onClick={() => {
              setActiveUrl("cash");
              navigate("cash");
            }}
          >
            <SiCashapp size={30} color="#FFFFFF" className="" />
          </div>

          {/* Entry section */}
        </div>
        <div
          className={`px-[.4em] py-2 rounded-md cursor-pointer select-none delay-150 transition-[.5s] hover:opacity-100${
            activeUrl === "logout" && " border border-white opacity-100"
          }`}
          title="logout"
          onClick={() => logOutClick()}
        >
          <div className="">
            <SlLogout size={27} color="#FFFFFF" />
          </div>
        </div>
        {open && <LogOutClick open={open} setOpen={setOpen} />}
      </div>
    </>
  );
};

export default Sidebar;
