import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
const Layout = React.lazy(() => import("./pages/layout/layout"));
const Error = React.lazy(() => import("./global/components/error/error"));

// import Dashboard from "./pages/dashboard/Dashboard";
// import Users from "./pages/users/users";
// import Products from "./pages/products/products";
// import Payments from "./pages/payments/payments";
// import Members from "./pages/members/members";

import SuspenseLoader from "./global/components/loader/suspense-loader";

 
import MembersUpdate from "./pages/members/components/MembersUpdate";
import MemberPlans from "./pages/members/components/MemberPlans";
import Cash from "./pages/cash/cash";
import Dashboard from "./pages/dashboard/Dashboard";
import NoteTable from "./pages/members/components/notes/NoteTable";

const SignIn = React.lazy(() => import("./pages/signin/signIn"));

const Members = React.lazy(() => import("./pages/members/members"));

const App = () => {
  return (
    <ErrorBoundary fallback={<Error />}>
      <Suspense fallback={<SuspenseLoader />}>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/" element={<Layout />}>
         
            {/* staff__user */}
            {/* staff__user */}
          <Route path="dashboard" element={<Dashboard />}/>
            
            {/* staff section fin */}
            {/* staff__user ends*/}

            {/* entry */}

            {/* entry end */}
            <Route path="members" element={<Members />} />
            <Route path="members/update/:id" element={<MembersUpdate />} />
            <Route path="members/plans/:id" element={<MemberPlans />} />


            <Route path="notes/:id" element={<NoteTable />} />




            <Route path="cash" element={<Cash />} />
            <Route path="logout" element={<SignIn />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
