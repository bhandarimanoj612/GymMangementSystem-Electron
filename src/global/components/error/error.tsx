import "./style.css";
import { MdDashboard } from "react-icons/md";
import { MdFoodBank } from "react-icons/md";
import { ImGlass2 } from "react-icons/im";
import { IoReceiptSharp } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { GiTabletopPlayers } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
const Error = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col justify-center h-screen @container items-center bg-white text-[#585858]">
        <div className="flex flex-col items-center p-4 w-[25em] @[50em]:w-[30em] @[60em]:w-[35em]">
          <div id="error" className="flex flex-col items-center w-full">
            <div id="box"></div>
            <h3>ERROR 500</h3>
            <p>
              Things are a little <span>unstable</span> here
            </p>
            <p>I suggest come back later</p>
          </div>
          <div className="flex mt-3 gap-x-3">
            <MdDashboard
              className="w-8 h-8 border border-[#585858] cursor-pointer md:w-7 md:h-7"
              onClick={() => navigate("/")}
              title="Dashboard"
            />
            <FaUsers
              className="border p- w-9 h-9 border-[#585858] cursor-pointer md:w-7 md:h-7 p-[.1rem]"
              onClick={() => navigate("/staffs")}
              title="Staffs"
            />
            <MdFoodBank
              className="w-8 h-8 border  border-[#585858] cursor-pointer md:w-7 md:h-7"
              onClick={() => navigate("/foods")}
              title="Foods"
            />
            <ImGlass2
              className="w-8 h-8 p-1 border  border-[#585858] cursor-pointer md:w-7 md:h-7"
              onClick={() => navigate("/drinks")}
              title="Drinks"
            />
            <GiTabletopPlayers
              className="w-8 h-8 p-1 border md:w-7  border-[#585858] cursor-pointer md:h-7 text-[1.1rem]"
              onClick={() => navigate("/orders")}
              title="Orders"
            />
            <IoReceiptSharp
              className="w-8 h-8 p-1 border md:w-7 border-[#585858] cursor-pointer  md:h-7"
              onClick={() => navigate("/pos")}
              title="POS"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Error;
