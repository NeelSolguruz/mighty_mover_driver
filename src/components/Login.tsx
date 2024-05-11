
import { ChangeEvent, SetStateAction, useState } from "react";
import Link from "next/link";
import http from "../http/http";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import NavLogo from "../assets/Images/icons/NavLogo"; 
import { useRef } from "react";
import { motion } from "framer-motion";
import { ImCross } from "react-icons/im";


import { useDispatch, useSelector } from "react-redux";
import { driverAdd } from "@/redux/driverSlice";
import { toast } from "sonner";
import { documentData } from "../assets/dto/data.type"; 
import formhttp from "../http/formHttp";
import { DID_NOT_GET, OTP_SENT_TO_EMAIL, OTP_VERIFICATION } from "../assets/constant/login";
import { driver_login, verify_driver_otp } from "../http/staticTokenService";
import Loader from "./Loader";
export default function DriverLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otppage, setotppage] = useState(false);
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const data = useSelector((state) => state);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setEmailError("");
    setPasswordError("");
  };
  const verifyotp = async () => {
    setLoading(true);
    try {
      const ftoken = localStorage.getItem("fcm_token");
      const user_details = await verify_driver_otp({
        email: email,
        OTP: otp,
        fcm_token: ftoken,
      });
      toast.success(user_details.data.message);
      console.log(user_details.data);
      console.log(user_details.data.data.token);
      // localStorage.setItem(
      //   "driver",
      //   JSON.stringify({
      //     token: user_details.data.data.token,
      //     driver: user_details.data.data.name,
      //     email: user_details.data.data.email,
      //   })
      // );
      dispatch(driverAdd(user_details.data.data));

      setLoading(false);
      resetForm();
      setModal(true);
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
    } finally {
      setLoading(false);
      setOtp("");
    }
  };

  const validateEmail = (value: string | any) => {
    if (!value.trim()) {
      setEmailError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError("Invalid email address");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const handleEmailChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setEmail(e.target.value);
    validateEmail(e.target.value);
  };

  const handlePasswordChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setPassword(e.target.value);
    // validatePassword(e.target.value);
  };

  const [modal, setModal] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await driver_login({ email, password });
      console.log(response.data.message);
      console.log(response.data.token);
      toast.success(response.data.message);
      setotppage(true);
      // setModal(true);
    } catch (error) {
      setModal(false);
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
        resetForm();
      }
    } finally {
      // router.push('/driver-partner', { scroll: false })
      setLoading(false);
      // resetForm();
    }
  };
  const inputs = useRef<HTMLInputElement[]>([]);

  const focusNextInput = (index: number) => {
    const nextIndex = index + 1;
    if (nextIndex < inputs.current.length) {
      inputs.current[nextIndex].focus();
    }
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (value.length > 0) {
      setOtp((prevOtp) => {
        const newOtp = prevOtp + value;
        if (newOtp.length === inputs.current.length) {
          console.log("Final OTP:", newOtp);
          setOtp(newOtp);
          console.log("otp state", otp);
        }
        return newOtp;
      });
      focusNextInput(index);
    }
  };

  const [vehicleFormData, setVehicleFormData] = useState({
    vehicle_num: "",
    max_weight: "",
    length: "",
    width: "",
    per_km_charge: "",
    vehicle_category: "",
    order_type: "",
  });

  const handleVehicleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setVehicleFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleVehicleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(vehicleFormData);
    setLoading(true);
    try {
      const response = await http.post(
        "api/v1/driver/vehicle",
        vehicleFormData
      );
      console.log("Success:", response.data);
      toast.success(response.data.message);
      setLoading(false);
      setDocumentModal(true);
    } catch (error) {
      // setModal(false);
      setLoading(false);
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
    } finally {
      setLoading(false);
      setVehicleFormData({
        vehicle_num: "",
        max_weight: "",
        length: "",
        width: "",
        per_km_charge: "",
        vehicle_category: "",
        order_type: "",
      });
    }
  };

  const [documentModal, setDocumentModal] = useState(false);
  const [documentFormData, setDocumentFormData] = useState<documentData>({
    aadhar: null,
    licence: null,
    pancard: null,
    image: null,
  });
  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement> | null,
    type: string
  ) => {
    setDocumentFormData({
      ...documentFormData,
      [type]: e.target.files[0],
    });
  };

  const [documentUploadStatus, setDocumentUploadStatus] = useState({
    aadhar: false,
    licence: false,
    pancard: false,
    vehicle: false,
  });

  const [anyOneDocument, setAnyOneDocument] = useState(false);
  const handleDocument = async (type: string) => {
    // console.log('handleDocument function running')
    const formData = new FormData();
    formData.append("image", documentFormData[type] as Blob);
    formData.append("type", type);
    setLoading(true);
    try {
      const response = await formhttp.post("api/v1/document", formData);
      setLoading(false);
      toast.success(response.data.message);
      setDocumentUploadStatus((prevState) => ({
        ...prevState,
        [type]: true,
      }));
      setAnyOneDocument(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex w-full h-lvh justify-center items-center">
          <Loader />
        </div>
      ) : (
        <>
          <div className="w-full flex justify-center">
            <div
              className={`flex flex-col items-center gap-10 py-10 w-5/12 max-lg:w-8/12 max-sm:w-11/12`}
            >
              <div className="w-[180px]">
                <NavLogo />
              </div>
              {otppage ? (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[10] flex justify-center items-center"
                  >
                    <div className="w-[35%] flex justify-center items-center gap-2 p-10 bg-white rounded-lg max-[1228px]:w-[40%] max-[1025px]:w-[50%] max-[818px]:w-[60%] max-[683px]:w-[70%] max-[587px]:w-[80%] max-[517px]:w-[90%] max-[455px]:p-4 max-[386px]:p-2">
                      <div className="w-full flex flex-col justify-center p-4 gap-6">
                        <div className="w-full flex justify-center">
                          <div className="w-[180px]">
                            <NavLogo />
                          </div>
                        </div>
                        <h1 className="text-4xl font-bold tracking-wide text-center max-[332px]:text-3xl ">
                          {OTP_VERIFICATION}
                        </h1>

                        <div className="flex justify-center gap-2 items-center">
                          <div className="max-[455px]:text-sm w-full text-end max-[360px]:text-xs">
                            {OTP_SENT_TO_EMAIL}
                          </div>
                          <div>
                            <h5 className="text-lg font-bold text-center">
                              {email.split("").map((item, index) => (
                                <>{index <= 4 ? <>{"*"}</> : <>{item}</>}</>
                              ))}
                            </h5>
                          </div>
                        </div>
                        <div className="flex w-full justify-center items-center gap-4 ">
                          {[...Array(6)].map((_, index) => (
                            <input
                              key={index}
                              ref={(el) =>
                                (inputs.current[index] = el as HTMLInputElement)
                              }
                              type="text"
                              id={`otp${index + 1}`}
                              className="border border-black w-10 h-10 rounded-lg text-center text-xl font-medium max-[386px]:w-8 max-[386px]:h-8 "
                              maxLength={1}
                              onInput={(e) => handleInput(e, index)}
                            />
                          ))}
                        </div>
                        <div
                          className="flex w-full justify-end items-center text-gray-400 text-xs"
                          onClick={handleSubmit}
                        >
                          {DID_NOT_GET}
                        </div>
                        <div className="flex w-full justify-center items-center ">
                          <button
                            className="border-none bg-[#2967ff] text-white font-bold px-10 py-4 rounded-lg text-xl"
                            onClick={verifyotp}
                          >
                            Verify OTP
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </>
              ) : (
                <></>
              )}

              <>
                <div className="w-full">
                  <div>
                    <h1 className="text-4xl font-bold">
                      {DRIVER_LOGIN.sign_in}
                    </h1>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">
                      {DRIVER_LOGIN.tagline}
                    </h3>
                  </div>
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="w-full flex flex-col gap-10"
                >
                  <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="user" className="font-bold text-lg">
                      {LOGIN.email_label}
                    </label>
                    <input
                      type="text"
                      id="username"
                      placeholder="Enter your email address"
                      className={`p-3 w-full border transition-all border-gray-400 hover:border-black text-lg rounded-md focus:outline-2 focus:outline-blue-500
                                ${emailError ? " border-red-500" : ""}`}
                      value={email}
                      onChange={handleEmailChange}
                    />
                    <p
                      className={`text-red-500 transition-all ${
                        emailError ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {emailError}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex justify-between">
                      <label htmlFor="password" className="font-bold text-lg">
                        {LOGIN.password_label}
                      </label>
                      <Link
                        href="/delivery-forgot-password"
                        className="font-semibold text-blue-500 hover:text-blue-400 transition-all"
                      >
                        {LOGIN.forgot_text}
                      </Link>
                    </div>
                    <input
                      type="password"
                      id="password"
                      placeholder="Enter your password"
                      className={`p-3 w-full border transition-all border-gray-400 hover:border-black text-lg rounded-md focus:outline-2 focus:outline-blue-500
                                ${passwordError ? "border-red-500" : ""}`}
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <p
                      className={`text-red-500 transition-all ${
                        passwordError ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {passwordError}
                    </p>
                  </div>
                  <div className="w-full">
                    <button className="bg-[#2967ff] text-white w-full p-3 rounded-md font-bold hover:bg-blue-500 transition-all text-xl">
                      Submit
                    </button>
                  </div>
                  <div className="w-full flex justify-center">
                    <div className="w-full flex text-center mt-[10px] mx-[0] mb-[20px]">
                      <div className="border border-gray-400 w-full" />
                      <h2 className="bg-[#fff] px-[10px] leading-[0.1em] py-[0] font-bold">
                        OR
                      </h2>
                      <div className="border border-gray-400 w-full" />
                    </div>
                  </div>
                  <div className="w-full">
                    <Link href="/delivery-partner">
                      <button className="w-full border-2 border-[#2967ff] p-3 rounded-md font-bold transition-all text-xl text-[#2967ff] hover:text-white hover:bg-[#2967ff]">
                        Create your Driver account
                      </button>
                    </Link>
                  </div>
                </form>
              </>
            </div>
          </div>
          {modal && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="fixed top-0 z-10 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
            >
              <div className="bg-white p-4 rounded-lg w-11/12 h-auto flex flex-col items-center">
                <div>
                  <h1 className="text-3xl font-bold">VEHICLE DETAILS</h1>
                </div>
                <div className="w-1/2">
                  <form
                    onSubmit={handleVehicleSubmit}
                    className="grid grid-cols-2 gap-y-5 items-center my-5"
                  >
                    <label htmlFor="vehicle_num" className="text-lg">
                      Vehicle number:
                    </label>
                    <input
                      type="text"
                      id="vehicle_num"
                      name="vehicle_num"
                      placeholder="Enter vehicle number"
                      className="border border-gray-400 p-2 text-base rounded-lg hover:border-black focus:outline-[#2967ff]"
                      onChange={handleVehicleChange}
                      value={vehicleFormData.vehicle_num}
                    />
                    <label htmlFor="max_weight" className="text-lg">
                      Max carrying capacity:{" "}
                    </label>
                    <input
                      type="text"
                      id="max_weight"
                      name="max_weight"
                      placeholder="Enter max weight"
                      className="border border-gray-400 p-2 text-base rounded-lg hover:border-black focus:outline-[#2967ff]"
                      onChange={handleVehicleChange}
                      value={vehicleFormData.max_weight}
                    />
                    <label htmlFor="length" className="text-lg">
                      Length:{" "}
                    </label>
                    <input
                      type="text"
                      id="length"
                      name="length"
                      placeholder="Enter length"
                      className="border border-gray-400 p-2 text-base rounded-lg hover:border-black focus:outline-[#2967ff]"
                      onChange={handleVehicleChange}
                      value={vehicleFormData.length}
                    />
                    <label htmlFor="width" className="text-lg">
                      Width:{" "}
                    </label>
                    <input
                      type="text"
                      id="width"
                      name="width"
                      placeholder="Enter width"
                      className="border border-gray-400 p-2 text-base rounded-lg hover:border-black focus:outline-[#2967ff]"
                      onChange={handleVehicleChange}
                      value={vehicleFormData.width}
                    />
                    <label htmlFor="per_km_charge" className="text-lg">
                      Per KM charge:{" "}
                    </label>
                    <input
                      type="text"
                      id="per_km_charge"
                      name="per_km_charge"
                      placeholder="Enter per km charge"
                      className="border border-gray-400 p-2 text-base rounded-lg hover:border-black focus:outline-[#2967ff]"
                      onChange={handleVehicleChange}
                      value={vehicleFormData.per_km_charge}
                    />
                    <label htmlFor="vehicle_category">Vehicle Type:</label>
                    <select
                      name="vehicle_category"
                      id="vehicle_category"
                      className="p-2 border border-gray-400 rounded-lg hover:border-black focus:outline-[#2967ff] text-gray-400"
                      onChange={handleVehicleChange}
                      value={vehicleFormData.vehicle_category}
                    >
                      <option value="">Select vehicle category</option>
                      <option value="2-wheeler">2 Wheeler</option>
                      <option value="4-wheeler">4 Wheeler</option>
                    </select>
                    <label htmlFor="order_type">Order Type:</label>
                    <select
                      name="order_type"
                      id="order_type"
                      className="p-2 border border-gray-400 rounded-lg hover:border-black focus:outline-[#2967ff] text-gray-400"
                      onChange={handleVehicleChange}
                      value={vehicleFormData.order_type}
                    >
                      <option value="">Select Order Type</option>
                      <option value="local">Local</option>
                      <option value="outdoor">Inter State</option>
                      <option value="both">Both</option>
                    </select>
                    <button
                      type="submit"
                      className="bg-[#2967ff] p-2 font-semibold text-white rounded-xl w-[99%]"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => router.push("/delivery-partner")}
                      className="bg-red-500 p-2 font-semibold text-white rounded-xl w-[99%]"
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
          {documentModal && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="fixed top-0 z-10 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
            >
              <div className="bg-white p-4 rounded-lg w-11/12 h-auto flex flex-col items-center">
                <div
                  className="absolute w-6 h-6 right-[60px] top-12 cursor-pointer"
                  onClick={() => setDocumentModal(false)}
                >
                  <ImCross className="w-full h-full" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Upload Documents</h1>
                </div>
                <div className="w-1/2 max-lg:w-9/12 max-sm:w-7/12 my-10 grid gap-10">
                  <form className="flex justify-center">
                    <div className="w-10/12 grid grid-cols-2 items-center gap-y-5 gap-x-5">
                      <div className="">
                        <label htmlFor="aadhar">Aadhar Card:</label>
                        <input
                          type="file"
                          id="aadhar"
                          name="aadhar"
                          onChange={(e) => handleFileChange(e, "aadhar")}
                          disabled={documentUploadStatus.aadhar}
                        />
                      </div>
                      <div className="">
                        <button
                          onClick={() => handleDocument("aadhar")}
                          type="button"
                          className="bg-[#2967ff] text-white rounded-xl p-1 w-full"
                        >
                          Upload
                        </button>
                      </div>

                      <div>
                        <label htmlFor="licence">Licence:</label>
                        <input
                          type="file"
                          id="licence"
                          name="licence"
                          onChange={(e) => handleFileChange(e, "licence")}
                          disabled={documentUploadStatus.licence}
                        />
                      </div>
                      <div className="">
                        <button
                          onClick={() => handleDocument("licence")}
                          type="button"
                          className="bg-[#2967ff] text-white rounded-xl p-1 w-full"
                        >
                          Upload
                        </button>
                      </div>

                      <div>
                        <label htmlFor="pancard">PAN Card:</label>
                        <input
                          type="file"
                          id="pancard"
                          name="pancard"
                          onChange={(e) => handleFileChange(e, "pancard")}
                          disabled={documentUploadStatus.pancard}
                        />
                      </div>
                      <div className="">
                        <button
                          onClick={() => handleDocument("pancard")}
                          type="button"
                          className="bg-[#2967ff] text-white rounded-xl p-1 w-full"
                        >
                          Upload
                        </button>
                      </div>

                      <div>
                        <label htmlFor="vehicle">Vehicle image:</label>
                        <input
                          type="file"
                          id="vehicle"
                          name="vehicle"
                          onChange={(e) => handleFileChange(e, "vehicle")}
                          disabled={documentUploadStatus.vehicle}
                        />
                      </div>
                      <div className="">
                        <button
                          onClick={() => handleDocument("vehicle")}
                          type="button"
                          className="bg-[#2967ff] text-white rounded-xl p-1 w-full"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  </form>
                  <div className="flex justify-center">
                    <button
                      className="p-2 bg-[#2967ff] w-1/2 rounded-lg text-white font-semibold hover:bg-blue-500"
                      onClick={() => router.push("/delivery-partner")}
                    >
                      {anyOneDocument ? "Continue" : "Upload Later"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </>
  );
}
