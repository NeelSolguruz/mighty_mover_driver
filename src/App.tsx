// import { lazy, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { lazy } from "react";
// import Login from "./components/Login";
import useFcmToken from "../src/utils/FCM/useFcmToken";
// import { useSelector } from "react-redux";
// import { RootState } from "./app/store";

const Login = lazy(() => import("./components/Login"));
const Dashboard = lazy(() => import("./components/Dashboard"));
// const Driver_Vehicle = lazy(() => import("./components/DriverVehical"));
const DocumentData = lazy(() => import("./components/DriverDocument"));
const ProtectedRoutes = lazy(() => import("./utils/ProtectedRoutes"));
const PublicRoute = lazy(() => import("./utils/PublicRoute"));
const FixedLayout = lazy(() => import("./components/Layout"));
const ForogotPassword = lazy(() => import("./components/DriverForgotPassword"));
function App() {
  // const [count, setCount] = useState(0)
  const fcm_token = useFcmToken();
  if (fcm_token) {
    localStorage.setItem("fcm_token", fcm_token);
  }

  return (
    <>
      <div>
        <Routes>
          {/* <Route element={<ProtectedRoutes />}> */}
          <Route element={<FixedLayout />}>
            <Route path="/" element={<Dashboard />} />

            {/* <Route path="/driver" element={<Driver_Vehicle />} /> */}

            <Route path="/documentData" element={<DocumentData />} />
          </Route>
          {/* </Route> */}
          {/* <Route element={<PublicRoute />}> */}
          <Route path="/login" element={<Login />} />
          <Route
            path="/delivery-forgot-password"
            element={<ForogotPassword />}
          />
          {/* </Route> */}
        </Routes>
      </div>
    </>
  );
}

export default App;
