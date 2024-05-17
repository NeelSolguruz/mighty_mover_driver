import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import NavLogo from "../assets/Images/icons/NavLogo";
import { driver_new_password } from "../http/staticTokenService";


export default function DriverNewPassword({ id }: any) {
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");

  const handlesubmit = async () => {
    if (password === cpassword) {
      try {
        const response = await driver_new_password({newPassword:password}, id);
        console.log(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<{
            status: number;
            message: string;
          }>;
          if (axiosError.response) {
            console.log("Response Error", axiosError.response);
            toast.error(axiosError.response.data.message);
          } else if (axiosError.request) {
            console.log("Request Error", axiosError.request);
          } else {
            console.log("Error", axiosError.message);
          }
        }
      }
    } else {
      toast.error("Please Enter Same Password In Both Fields");
    }
  };
  return (
    <div className="w-full flex justify-center py-16">
      <div
        className="flex flex-col items-center gap-10 py-10 w-5/12
            max-lg:w-8/12
            max-sm:w-11/12
            "
      >
        <div
          className="w-[180px]
                max-sm:w-[150px]
                "
        >
          <NavLogo />
        </div>
        <div className="w-full flex justify-center"></div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="user" className="font-bold text-lg">
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            placeholder="Enter your New Password"
            className="p-3 w-full border border-gray-400 text-lg rounded-md
                "
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="user" className="font-bold text-lg">
            Confirm Password
          </label>
          <input
            type="password"
            id="cpassword"
            value={cpassword}
            onChange={(e) => setcpassword(e.target.value)}
            placeholder="Confirm your Password"
            className="p-3 w-full border border-gray-400 text-lg rounded-md
                "
          />
        </div>
        <div className="w-full" onClick={handlesubmit}>
          <button className="bg-[#2967ff] text-white w-full p-3 rounded-md font-bold hover:bg-blue-500 transition-all text-xl">
            Submit 
          </button>
        </div>
      </div>
    </div>
  );
}
