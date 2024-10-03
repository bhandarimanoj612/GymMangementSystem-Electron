import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

import { IDeleteProps } from "../../pages/members/interface";
import memberImage from "../../assets/productTableStock.jpg";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
//store

const Delete = ({ data, open, setOpen, deleteClick }: IDeleteProps) => {
  // states
  const [loading, setLoading] = React.useState(false);

  const deleteMembers = async () => {
    try {
      setLoading(true);
      deleteClick(data);
      setOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
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
                alt={data?.plan}
              />
            </div>
            <span className="text-[#585858]/80 text-[1.07rem] font-semibold ">
              This will Permanently delete your {data?.plan}!
            </span>
          </DialogTitle>
          <DialogContent>
            <DialogContentText className="text-[.9rem] text-center flex flex-col">
              <span>You are about to delete {data?.plan}</span>
              <span>Are you sure?</span>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="mb-2 px-[3em] flex justify-center">
            <button
              onClick={() => deleteMembers()}
              className="rounded btn text-[#fff] bg-[#2e2e2e] hover:bg-[#585858] w-[8em] tracking-wider"
            >
              {loading ? "Deleting..." : "Delete"}
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

export default Delete;
