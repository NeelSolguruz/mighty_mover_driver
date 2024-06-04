import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Suspense, lazy, useEffect } from "react";
import useFcmToken from "../src/utils/FCM/useFcmToken";
import PublicRoute from "./utils/PublicRoute";
import { onMessage } from "firebase/messaging";
import { messaging } from "./utils/firebase/firebase";
import { toast } from "sonner";

const Login = lazy(() => import("./components/Login"));
const Dashboard = lazy(() => import("./components/Dashboard"));
// const Driver_Vehicle = lazy(() => import("./components/DriverVehical"));
const DocumentData = lazy(() => import("./components/DriverDocument"));
const ProtectedRoutes = lazy(() => import("./utils/ProtectedRoutes"));
// const PublicRoute = lazy(() => import("./utils/PublicRoute"));
const FixedLayout = lazy(() => import("./components/Layout"));
const ForogotPassword = lazy(() => import("./components/DriverForgotPassword"));
const AddressPage = lazy(() => import("./components/DriverAddress"));
const OrderPage = lazy(() => import("./components/DriverOrder"));
function App() {
  const notificationSound = () => {
    const audio = new Audio("../message-notification.mp3");
    audio.volume = 0.5;
    audio.play();
  };
  const fcm_token = useFcmToken();

  useEffect(() => {
    if (fcm_token) {
      localStorage.setItem("fcm_token", fcm_token);
    }
    // console.log("token", token);

    const notification = onMessage(messaging, (payload) => {
      console.log("Foreground message received: ", payload);
      // const token = JSON.parse(localStorage.getItem("Driver") || "{}").token;

      // const orderIdFromPayload = payload.data.id;
      // const handleAccept = async () => {
      //   try {
      //     const data = await http.patch(
      //       `/api/v1/driver-order/accept/${orderIdFromPayload}`
      //     );
      //     toast.success(data.data.message);
      //     console.log("data", data);
      //   } catch (error) {
      //     console.log("error", error);
      //   }
      // };
      // const handleReject = () => {
      //   try {
      //     const data = http.patch(
      //       `/api/v1/driver-order/cancel/${orderIdFromPayload}`
      //     );
      //     console.log("data", data);
      //   } catch (error) {
      //     console.log("error", error);
      //   }
      // };

      // setOrderid(orderIdFromPayload);
      // console.log("orderid", orderIdFromPayload);
      notificationSound();
      toast.success(
        <div>
          <p>{payload?.notification?.title}</p>
          {/* <button
            onClick={handleAccept}
            style={{
              marginLeft: "16px",
              padding: "8px 12px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Accept
          </button>
          <button
            onClick={handleReject}
            style={{
              marginLeft: "16px",
              padding: "8px 12px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reject
          </button> */}
        </div>
      );
    });

    return () => notification();
  }, [fcm_token]);
  // const handleAction = (action: string) => {
  //   if (action === "accept") {
  //     console.log("accept");
  //   } else if (action === "reject") {
  //     console.log("reject");
  //   }
  // };
  console.log("fcm_token", fcm_token);
  return (
    <>
      <div>
        <Suspense>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route element={<FixedLayout />}>
                <Route path="/" element={<Dashboard />} />

                {/* <Route path="/driver" element={<Driver_Vehicle />} /> */}

                <Route path="/document" element={<DocumentData />} />
                <Route path="/address" element={<AddressPage />} />
                <Route path="/order" element={<OrderPage />} />
              </Route>
            </Route>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route
                path="/login/forgot-password"
                element={<ForogotPassword />}
              />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

export default App;
