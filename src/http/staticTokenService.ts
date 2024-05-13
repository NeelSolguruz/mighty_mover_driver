import axios, { AxiosResponse } from "axios";
// import { error } from "console";
const config = {
  baseURL: "http://192.168.68.93:3000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJVc2VybmFtZSI6IktldGFuIiwiUGFzc3dvcmQiOiJLZXRhbkAxMjIzIn0.2ypcOji0gmoYcFfGaa16cD5SNtYW8is8bx779KcMOM8",
  },
};

export const driver_login = async (
  payload: any
): Promise<AxiosResponse<any, any>> => {
  return axios.post("/api/V1/driver/login", payload, config);
};
export const verify_driver_otp = async (
  payload: any
): Promise<AxiosResponse<any, any>> => {
  return axios.post("/api/V1/driver/verify", payload, config);
};
export const driver_forgotpassword = async (
  payload: any
): Promise<AxiosResponse<any, any>> => {
  return axios.post("api/V1/driver/forgotPassword", payload, config);
};