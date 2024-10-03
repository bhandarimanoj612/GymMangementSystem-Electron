import React, { useState } from "react";
import RegisterMember from "./components/registerMember";
import Heading from "../../global/components/error/heading";
import MembersTable from "./components/membersTable";
import { IToasterData } from "../../global/components/toaster/interface";
import Toaster from "../../global/components/toaster/toaster";

const Members = () => {
  const [count, setCount] = useState(0);
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
  return (
    <React.Fragment>
      <Toaster data={toasterData} close={closeToaster} />

      <div className="mt-6 ">
        <div className="container ">
          <div className="flex flex-col-reverse lg:flex lg:flex-row-reverse lg:justify-between">
            {/* List of Members */}
            <div className="lg:w-3/5">
              <div className="lg:flex justify-between lg:px-0">
                <div className="lg:hidden">
                  <Heading heading="Members" />
                </div>
                <div className="text-lg lg:text-xl">
                  <div className="hidden lg:block text-4xl font-bold font-mono text-white">
                    Members ({count}) Records
                  </div>
                </div>
              </div>
              <div className="mt-6 lg:mt-12">
                <MembersTable setCount={setCount} />
              </div>
            </div>

            {/* Form to register a new staff */}
            <div className="lg:w-2/5 mt-0 lg:mt-[4em]">
              <div className="lg:px-6">
                <RegisterMember setToasterData={setToasterData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Members;
