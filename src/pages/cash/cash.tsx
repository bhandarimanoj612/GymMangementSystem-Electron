import React, { useEffect, useState } from "react";
import { ICash, IReactOption } from "./interface";
import { openDB, saveCash } from "../../global/indexedDB/db";
import Heading from "../../global/components/error/heading";
import Toaster from "../../global/components/toaster/toaster";
import { IToasterData } from "../../global/components/toaster/interface";
import { useMemberStoreN } from "../../global/indexedDB/store";

import CreatableSelect from "react-select/creatable";

const Cash = () => {
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
  const [typeOption, setTypeOption] = useState<IReactOption[]>([
    {
      value: "",
      label: "",
    },
  ]);
  //states
  const [loading, setLoading] = useState(false);
  const [cash, setCash] = useState<ICash>({
    id: 0,
    type: "",
    price: 0,
  });

  const clearCash = () => {
    setCash({
      id: 0,
      type: "",
      price: 0,
    });
  };
  const { fetchCash, cashes } = useMemberStoreN();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      //check duplicate
      const isDuplicate = cashes?.find((item) => item?.type === cash?.type);
      if (isDuplicate) {
        setToasterData({
          open: true,
          message: "Plan already exist",
          severity: "error",
        });
        return;
      }
      if (cash?.type === "" || cash?.price === 0) {
        setToasterData({
          open: true,
          message: "Please fill all fields",
          severity: "error",
        });
        return;
      }
      setLoading(true);
      const db = await openDB("cash");

      await saveCash(db, {
        ...cash,
        id: Math.floor(Math.random() * 1000),
      });

      setToasterData({
        open: true,
        message: "Cash registered successfully",
        severity: "success",
      });
      await fetchCash();
      clearCash();
    } catch (error) {
      console.log(error);
      setToasterData({
        open: true,
        message: "Failed to register Cash",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleTypeChange = (e: any) => {
    setCash({
      ...cash,
      type: e.value,
    });
  };
  //for react select
  useEffect(() => {
    if (cashes) {
      const typeSet = new Set(cashes?.map((item) => item?.type));

      typeSet.add("Gym + Cardio-monthly");
      typeSet.add("Gym + Cardio-quarterly");
      typeSet.add("Gym + Cardio-1/2 yearly");
      typeSet.add("Gym + Cardio-1 yearly");

      typeSet.add("Gym only-monthly");
      typeSet.add("Gym only-quarterly");
      typeSet.add("Gym only-1/2 yearly");
      typeSet.add("Gym only-1 yearly");

      typeSet.add("Cardio only-monthly");
      typeSet.add("Cardio only-quarterly");
      typeSet.add("Cardio only-1/2 yearly");
      typeSet.add("Cardio only-1 yearly");

      typeSet.add("Zumba/Aerobics-monthly");
      typeSet.add("Zumba/Aerobics-quarterly");
      typeSet.add("Zumba/Aerobics-1/2 yearly");
      typeSet.add("Zumba/Aerobics-1 yearly");

      const newTypeOptions = Array.from(typeSet)?.map((type) => ({
        value: type as string,
        label: type as string,
      }));

      setTypeOption(newTypeOptions);
    }
  }, [cashes]);

  useEffect(() => {
    switch (cash.type) {
      case "Gym + Cardio-monthly":
        setCash({
          ...cash,
          price: 3000,
        });
        break;
      case "Gym + Cardio-quarterly":
        setCash({
          ...cash,
          price: 8000,
        });
        break;
      case "Gym + Cardio-1/2 yearly":
        setCash({
          ...cash,
          price: 14000,
        });
        break;
      case "Gym + Cardio-1 yearly":
        setCash({
          ...cash,
          price: 23000,
        });
        break;

      //gym only
      case "Gym only-monthly":
        setCash({
          ...cash,
          price: 1700,
        });
        break;
      case "Gym only-quarterly":
        setCash({
          ...cash,
          price: 4500,
        });
        break;
      case "Gym only-1/2 yearly":
        setCash({
          ...cash,
          price: 7500,
        });
        break;
      case "Gym only-1 yearly":
        setCash({
          ...cash,
          price: 14000,
        });
        break;
      //cardio only
      case "Cardio only-monthly":
        setCash({
          ...cash,
          price: 2000,
        });
        break;
      case "Cardio only-quarterly":
        setCash({
          ...cash,
          price: 5000,
        });
        break;
      case "Cardio only-1/2 yearly":
        setCash({
          ...cash,
          price: 9000,
        });
        break;
      case "Cardio only-1 yearly":
        setCash({
          ...cash,
          price: 17000,
        });
        break;
      //Zumba only
      case "Zumba/Aerobics-monthly":
        setCash({
          ...cash,
          price: 2000,
        });
        break;
      case "Zumba/Aerobics-quarterly":
        setCash({
          ...cash,
          price: 5000,
        });
        break;
      case "Zumba/Aerobics-1/2 yearly":
        setCash({
          ...cash,
          price: 9000,
        });
        break;
      case "Zumba/Aerobics-1 yearly":
        setCash({
          ...cash,
          price: 17000,
        });
        break;
    }
  }, [cash?.type]);

  useEffect(() => {
    fetchCash();
  }, [fetchCash]);
  return (
    <div>
      <Toaster data={toasterData} close={closeToaster} />
      <div className="flex-1 px-4 lg:py-[.1em] py-[1.5em] max-h-[650px] pb-[2em] font-sans">
        <div className="lg:hidden">
          <Heading heading="Register Cash" />
        </div>

        <div className="mt-5 text-[#585858] flex justify-center w-full ">
          <div className="flex flex-col items-center justify-center py-[1em] px-[.5rem] rounded shadow-md w-[25em] bg-white">
            {/* <div className="w-[5em] h-[5em] select-none cursor-pointer">
              <img
                src={sts}
                alt="image"
                className="mx-auto w-20 h-20 rounded-full border-4"
              />
            </div> */}
            <div className="w-[95%] mt-2 ">
              <div className="font-mono font-[900] select-none">
                <div className="mb-2 leading-8 text-center ">
                  <p className="text-[1.95rem] tracking-widest cursor-pointer capitalize">
                    Plans
                  </p>
                </div>
              </div>
              <div className="mt-[1.75em] w-full">
                <form
                  action="#"
                  onSubmit={(e) => handleSubmit(e)}
                  className="flex flex-col gap-y-4"
                >
                  <div className="flex flex-col gap-y-3">
                    <label htmlFor="name" className="font-semibold">
                      Plan Type{" "}
                      <span className="text-red-500 ml-[-3px]">*</span>
                    </label>
                    <CreatableSelect
                      value={{
                        value: cash?.type,
                        label: cash?.type,
                      }}
                      onChange={(e) => handleTypeChange(e)}
                      options={typeOption as any}
                    />
                  </div>

                  <div className="flex flex-col gap-y-1">
                    <label htmlFor="price" className="font-semibold">
                      price <span className="text-red-500 ml-[-3px]">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      required
                      value={cash.price || ""}
                      onChange={(e) =>
                        setCash({
                          ...cash,
                          price: Number(e.target.value),
                        })
                      }
                      placeholder="Enter address"
                      className="w-full pl-2 bg-white py-2 rounded outline-0 border border-[#9e9c9c] focus:border-[#585858] focus:border-[1.5px] focus:rounded-sm tracking-wide focus:placeholder:text-[#585858]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="  rounded btn text-[#fff] bg-slate-900 hover:bg-black"
                  >
                    {loading ? "Adding..." : "Add"}
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

export default Cash;
