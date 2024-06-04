// import { useSelector } from "react-redux";
// import { RootState } from "@reduxjs/toolkit/query";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../app/store";
// import FixedLayout from "../components/Layout";
// import { userData } from '../assets/userData';

const ProtectedRoutes = () => {
  const driver = useSelector((state: RootState) => state.driver);
  //   const driver: any = localStorage.getItem("Driver");
  // console.log("driver", driver);

  //   if (user) {
  //       const userObj = JSON.parse(user);
  //       const userExists = userData.find((u) => u.username === userObj.username);
  //       if (userExists?.role === 'admin') {
  //           return <Route path="/dashboard" element={<Admin />} />;
  //       }
  //       return <Navigate to="/login" />;
  //   }

    return driver.token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
