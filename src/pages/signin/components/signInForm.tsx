import React, { useEffect, useState } from "react";
import { clientName } from "../../../global/components/config";
import logo from "../../../assets/nutrilogo.jpg";
import { useNavigate } from "react-router-dom";

import { IToasterData } from "../../../global/components/toaster/interface";
import Toaster from "../../../global/components/toaster/toaster";
import { getUser, saveUser } from "../../../global/indexedDB/db";
import { IUser } from "../../../global/indexedDB/interface";
import { useMemberStoreN } from "../../../global/indexedDB/store";

const Form = () => {
  const navigate = useNavigate();
  const { setAuthenticated } = useMemberStoreN();
  //states
  const [loading, setLoading] = useState<boolean>(false);
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
      message: null,
      severity: undefined,
    });
  };
  const [checkData, setCheckData] = useState({} as IUser);
  const [data, setData] = useState({} as IUser);

  const fetchUser = async () => {
    const user = await getUser();
    if (user.length === 0) {
      await saveUser(); // Add user if not found
      const newUser = await getUser(); // Fetch the user again after saving
      setCheckData({ ...newUser[0] });
    } else {
      setCheckData({ ...user[0] });
    }
  };

  //submit handler
  const submitClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!data?.name || !data?.password) {
      setToasterData({
        open: true,
        message: "Please fill out both fields",
        severity: "error",
      });
      return;
    }

    // Now check credentials
    if (
      data.name === checkData?.name &&
      data.password === checkData?.password
    ) {
      // Login success
      setLoading(true);
      setAuthenticated(true);
      setToasterData({
        open: true,
        message: "Login successful",
        severity: "success",
      });
      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard");
        // window.location.reload();
      }, 2000);
    } else {
      setToasterData({
        open: true,
        message: "Invalid credentials",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <Toaster data={toasterData} close={closeToaster} />
      <div className="flex flex-col items-center justify-center py-[3em] px-[1rem] rounded w-[80%] bg-gray-600 shadow-md max-w-[25em] ">
        <div className="w-[5em] h-[5em] select-none">
          <img
            src={logo}
            alt="sts-logo"
            className="object-cover w-full h-full rounded-full select-none"
          />
        </div>
        <div className="mt-4">
          <div className="font-mono font-bold ">
            <div className="mb-2 leading-8">
              <p className="text-[1.75em]">Welcome to </p>
              <p className="text-[1.95rem] md:text-[2.25rem]">{clientName}</p>
            </div>
          </div>
          <div className="mt-[1.5em]">
            <form className="flex flex-col gap-y-4">
              <div className="flex flex-col">
                <div className="flex flex-col gap-y-3">
                  <label htmlFor="username" className="font-semibold">
                    Username <span className="text-red-500 ml-[-3px]">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    value={data?.name as string}
                    required
                    placeholder="Enter your username"
                    className="w-full pl-2 bg-white  text-black py-2 rounded outline-0 border border-[#9e9c9c] focus:border-[#585858] focus:border-[1.5px] focus:rounded-sm tracking-wide focus:placeholder:text-[#585858]"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-col gap-y-3">
                  <label htmlFor="password" className="font-semibold">
                    Password <span className="text-red-500 ml-[-3px]">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                    value={data?.password as string}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-2 text-black bg-white py-2 rounded outline-0 border border-[#9e9c9c] focus:border-[#585858] focus:border-[1.5px] focus:rounded-sm tracking-wide focus:placeholder:text-[#585858]"
                  />
                </div>
              </div>
              <button
                type="submit"
                onClick={(e) => submitClick(e)}
                className="mt-2 rounded btn bg-black hover:bg-neutral-800 text-[#efefef]"
              >
                {loading ? "Loading..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
