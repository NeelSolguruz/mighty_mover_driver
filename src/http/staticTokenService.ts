import axios from "axios";
// import { error } from "console";
const config = {
  baseURL: `http://${import.meta.env.VITE_LOCAL_HOST}`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJVc2VybmFtZSI6IktldGFuIiwiUGFzc3dvcmQiOiJLZXRhbkAxMjIzIn0.2ypcOji0gmoYcFfGaa16cD5SNtYW8is8bx779KcMOM8",
  },
};

export const driver_login = async (payload: any) => {
  return axios.post("/api/V1/driver/login", payload, config);
};
export const verify_driver_otp = async (payload: any) => {
  return axios.post("/api/V1/driver/verify", payload, config);
};
export const driver_forgotpassword = async (payload: any) => {
  return axios.post("api/V1/driver/forgotPassword", payload, config);
};

export const driver_new_password = async (payload: any, token: any) => {
  return axios.post(`/api/v1/user/resetPassword/${token}`, payload, config);
};
