import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../app/store";

const PublicRoute = () => {
  const driver = useSelector((state: RootState) => state.driver);
  // console.log(driver);

  return !driver.token ? <Outlet /> : <Navigate to="/" />;
};

export default PublicRoute;
