import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

import memberImage from "../../../assets/logo.png";

import { IClearProps, IMemberStore } from "../interface";
import { useMemberStore } from "../store";
import Toaster from "../../../global/components/toaster/toaster";
import { IToasterData } from "../../../global/components/toaster/interface";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
//store

const ClearPurchase = ({ data, open, setOpen }: IClearProps) => {
  const clearPurchase = useMemberStore(
    (state: IMemberStore) => state.clearPurchase
  );
  const getAllMember = useMemberStore(
    (state: IMemberStore) => state.getAllMember
  );
  // states
  const [loading, setLoading] = React.useState(false);
  // toaster states
  const [toasterData, setToasterData] = React.useState<IToasterData>({
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
  const clearPurchases = async () => {
    try {
      setLoading(true);
      const res = await clearPurchase(data.id);

      if (res) {
        setLoading(false);
        setOpen(false);
        await getAllMember();
        setToasterData({
          open: true,
          message: "Members data cleared successfully",
          severity: "success",
        });
        return;
      }
      setToasterData({
        open: true,
        message: "Something went wrong",
        severity: "error",
      });
    } catch (error) {
      setToasterData({
        open: true,
        message: "Something went wrong",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Toaster data={toasterData} close={closeToaster} />
      <div className="w-full">
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle className="relative flex flex-col items-center mt-[.5em] space-y-[.3em]">
            <div className="h-[3em] w-[3em] bg-slate-200 rounded-full ">
              <img
                className="w-full h-full rounded-[inherit] object-cover"
                src={memberImage}
                alt={data?.name}
              />
            </div>
            <span className="text-[#585858]/80 text-[1.07rem] font-semibold ">
              This will clear your purchase history of {data?.name}!
            </span>
          </DialogTitle>
          <DialogContent>
            <DialogContentText className="text-[.9rem] text-center flex flex-col">
              <span>
                You are about to clear the purchase history of {data?.name}
              </span>
              <span>Are you sure?</span>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="mb-2 px-[3em] flex justify-center">
            <button
              onClick={() => clearPurchases()}
              className="rounded btn text-[#fff] bg-[#2e2e2e] hover:bg-[#585858] w-[8em] tracking-wider"
            >
              {loading ? "Clearing..." : "Clear"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded btn text-[#fff] bg-red-500 hover:bg-red-500/80 border-none w-[8em] tracking-wider"
            >
              Cancel
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default ClearPurchase;
