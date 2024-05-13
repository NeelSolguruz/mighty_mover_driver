import { useState } from "react";
import { toast } from "sonner";
import { driver_forgotpassword } from "../http/staticTokenService";
import NavLogo from "../assets/Images/icons/NavLogo"; // Update the import path for NavLogo
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

export default function DriverForgotPassword() {
  const router = useNavigate(); // Changed from useNavigate to useNavigate()

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const forgotPassword = async () => {
    setLoading(true);

    try {
      const response = await driver_forgotpassword({ email });
      toast.success(response.data.message);
      setEmail("");

      router("/delivery-partner-login", { replace: true }); // Changed from router.push to router
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.log("Response Error", axiosError.response);
          // toast.error(axiosError?.response?.data?.message);
        } else if (axiosError.request) {
          console.log("Request Error", axiosError.request);
        } else {
          console.log("Error", axiosError.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full flex justify-center py-16">
        <div className="flex flex-col items-center gap-10 py-10 w-5/12 max-lg:w-8/12 max-sm:w-11/12">
          <div className="w-[180px] max-sm:w-[150px]">
            <NavLogo />
          </div>
          <div className="w-full flex justify-center">
            <h1 className="text-4xl font-semibold max-sm:text-3xl">
              Tyre Puncture?
            </h1>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="email" className="font-bold text-lg">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              id="email"
              placeholder="Enter your email address"
              className="p-3 w-full border border-gray-400 text-lg rounded-md"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="w-full" onClick={forgotPassword}>
            <button className="bg-[#2967ff] text-white w-full p-3 rounded-md font-bold hover:bg-blue-500 transition-all text-xl">
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
