import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Appbar from "./appbar";
import SignIn from "../signin/signIn";
import { useMemberStoreN } from "../../global/indexedDB/store";

const Layout = () => {
  const {isAuthenticated} = useMemberStoreN();
   
 
 if (!isAuthenticated) {
   return <SignIn />;
 }

  return (
    <>
      <div className="flex bg-gray-900">

        <Sidebar />

        <div className="w-full overflow-x-hidden">
          <Appbar />

          <div className="">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
export default Layout;
