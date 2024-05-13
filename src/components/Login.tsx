import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
// import Link from "next/Link";
import http from "../http/http";
import axios, { AxiosError } from "axios";
// import { useRouter } from "next/navigation";
import NavLogo from "../assets/Images/icons/NavLogo";
import { useRef } from "react";
import { motion } from "framer-motion";
import { UploadOutlined } from "@ant-design/icons";

// import { useDispatch } from "react-redux";
// import { driverAdd } from "../redux/driverSlice";
import { toast } from "sonner";
import { documentData } from "../assets/dto/data.type";
import formhttp from "../http/formHttp";
import {
  DID_NOT_GET,
  DRIVER_LOGIN,
  LOGIN,
  OTP_SENT_TO_EMAIL,
  OTP_VERIFICATION,
} from "../assets/constant/constaint";
import { driver_login, verify_driver_otp } from "../http/staticTokenService";
import Loader from "./Loader";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Upload,
  UploadProps,
  message,
} from "antd";

interface Vehicle {
  id: string;
  status: string;
  created_at: string;
  vehicle_type: string;
  per_km_charge: number;
  max_weight: number;
  length: number;
  height: number;
  order_type: string | number;
}

function Login() {
  const router = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otppage, setotppage] = useState(false);
  const [otp, setOtp] = useState("");

  // const dispatch = useDispatch();
  const [form] = Form.useForm();
  // const data = useSelector((state) => state);

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
      localStorage.setItem(
        "driver",
        JSON.stringify({
          token: user_details.data.data.token,
          driver: user_details.data.data.name,
          email: user_details.data.data.email,
        })
      );
      // dispatch(driverAdd(user_details.data.data));

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
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[] | undefined>();
  const [vehicleFormData, setVehicleFormData] = useState<
    Vehicle[] | undefined
  >();
  // const [perKmCharge, setPerKmCharge] = useState(0);
  // const [maxWeight, setMaxWeight] = useState(0);
  // const [length, setLength] = useState(0);
  // const [height, setHeight] = useState(0);
  const fetchVehicleTypes = async () => {
    try {
      const response = await http.get<{ data: Vehicle[] }>("/api/v1/vehicle");
      const vehiclesData = response.data.data;
      console.log(vehiclesData);
      const uniqueVehicleTypes = Array.from(
        new Set(vehiclesData?.map((vehicle) => vehicle.vehicle_type))
      );
      setVehicleTypes(uniqueVehicleTypes);
      setVehicles(vehiclesData);
    } catch (error) {
      console.error("Error fetching vehicle types:", error);
    }
  };
  const handleVehicleTypeChange = (value: string) => {
    const selectedVehicle = vehicles?.find(
      (vehicle: Vehicle) => vehicle.vehicle_type === value
    );
    if (selectedVehicle) {
      form.setFieldsValue(selectedVehicle);
      console.log("selectedVehicle: ", selectedVehicle);
      // setVehicleFormData(selectedVehicle);
    }
  };
  useEffect(() => {
    fetchVehicleTypes();
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await driver_login({ email, password });
      console.log(response.data.message);
      // console.log(response);
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
      setLoading(false);
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

  const handleVehicleSubmit = async () => {
    console.log("hello");
    setLoading(true);
    try {
      const formData = form.getFieldsValue();
      const vehicleTypeEnum: Record<string, number> = {
        "2 wheeler": 0,
        "E loader": 1,
        "3 wheeler": 2,
        "Tata ace": 3,
        "Canter 14 ft": 4,
        "8 ft": 5,
        "1.7 ton": 6,
        "tata 407": 7,
        // Add more enum values as needed
      };
      console.log(formData.vehicle_type);
      const response = await http.post("/api/v1/driver/vehicle", {
        vehicle_num: formData.vehicle_num,
        vehicle_type: vehicleTypeEnum[formData.vehicle_type],
        order_type: formData.order_type,
      });
      console.log("api call");
      console.log("Success:", response);

      toast.success(response.data.message);
      form.resetFields();
      setLoading(false);
      setModal(false);
      setDocumentModal(true);
    } catch (error) {
      setModal(false);
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
      // setVehicleFormData({
      //   vehicle_num: "",
      //   max_weight: "",
      //   length: "",
      //   width: "",
      //   per_km_charge: "4",
      //   vehicle_type: "",
      //   order_type: "",
      // });
    }
  };

  // const handleVehicleSubmit = async () => {
  //   try {
  //     const response = await http.post("/api/v1/driver/vehicle", {
  //       vehicle_num: "GJ01PK1062",
  //       vehicle_type: 3,
  //       order_type: 1,
  //     });
  //     console.log("handle submit", response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const [documentModal, setDocumentModal] = useState(false);
  const [documentFormData, setDocumentFormData] = useState<documentData>({
    aadhar: null,
    licence: null,
    pancard: null,
    vehicle: null,
  });
  const handleDocument = async (type) => {
    setLoading(true);
    try {
      // Simulate uploading process for demonstration
      // setTimeout(async () => {
      //   setLoading(false);
      //   setDocumentFormData((prevState) => ({
      //     ...prevState,
      //     [type]: true,
      //   }));
      //   message.success(`${type} document uploaded successfully`);
      // }, 2000);

      // Uncomment below code for actual API call

      const formData = new FormData();
      formData.append("image", documentFormData[type]);
      formData.append("type", type);

      const response = await formhttp.post("api/v1/document", formData);
      setLoading(false);
      setDocumentFormData((prevState) => ({ ...prevState, [type]: true }));
      message.success(response.data.message);
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          //  message.error(axiosError.response.data.message);
          console.log(axiosError);
        } else if (axiosError.request) {
          console.log("Request Error", axiosError.request);
        } else {
          console.log("Error", axiosError.message);
        }
      }
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
                        to="/delivery-forgot-password"
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
                    <Link to="/delivery-partner">
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
                  <Modal
                    open={modal}
                    onOk={() => form.submit()}
                    onCancel={() => router("/")}
                  >
                    <Form
                      form={form}
                      onFinish={handleVehicleSubmit}
                      // onAbort={() => router("/")}
                    >
                      <Form.Item label="Vehicle number" name="vehicle_num">
                        <Input
                          placeholder="Enter vehicle number"
                          // onChange={handleVehicleChange}
                          name="vehicle_num"
                        />
                      </Form.Item>
                      <Form.Item
                        label="Max carrying capacity"
                        name="max_weight"
                      >
                        <Input
                          readOnly={true}
                          // value={vehicleFormData.max_weight}
                        />
                      </Form.Item>
                      <Form.Item label="Length" name="length">
                        <Input readOnly={true} />
                      </Form.Item>
                      <Form.Item label="Height" name="height">
                        <Input readOnly={true} />
                      </Form.Item>
                      <Form.Item label="Per KM charge" name="per_km_charge">
                        <Input readOnly={true} />
                      </Form.Item>
                      <Form.Item label="Vehicle Type" name="vehicle_type">
                        <Select
                          placeholder="Select vehicle category"
                          onChange={(value) => handleVehicleTypeChange(value)}
                          // value={vehicleFormData.vehicle_type}
                        >
                          {vehicleTypes.map((type) => (
                            <Select.Option key={type} value={type}>
                              {type}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item label="Order Type" name="order_type">
                        <Select
                          placeholder="Select Order Type"
                          // onChange={(value: Vehicle) =>
                          //   setVehicleFormData({
                          //     ...vehicleFormData,
                          //     order_type: value,
                          //   })
                          // }
                          // value={vehicleFormData.order_type}
                        >
                          <Select.Option value={0}>Local</Select.Option>
                          <Select.Option value={1}>Outdoor</Select.Option>
                          <Select.Option value={2}>Both</Select.Option>
                        </Select>
                      </Form.Item>
                    </Form>
                  </Modal>
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
              {/* <div className="bg-white p-4 rounded-lg w-11/12 h-auto flex flex-col items-center">
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
                      onClick={() => router("/delivery-partner")}
                    >
                      {anyOneDocument ? "Continue" : "Upload Later"}
                    </button>
                  </div>
                </div>
              </div> */}
              <div className="bg-white p-4 rounded-lg w-11/12 h-auto flex flex-col items-center">
                <Modal open={documentModal} onOk={handleDocument}>
                  <div>
                    <h1 className="text-3xl font-bold">Upload Documents</h1>
                  </div>
                  <div className="w-1/2 max-lg:w-9/12 max-sm:w-7/12 my-10 grid gap-10">
                    <Form className="justify-center">
                      <div className="w-11/12 grid grid-cols-1 items-center  gap-5">
                        <div className="">
                          <label htmlFor="aadhar">Aadhar Card:</label>
                          <Upload maxCount={1} {...uploadProps}>
                            <Button icon={<UploadOutlined />}>
                              Click to Upload
                            </Button>
                          </Upload>
                        </div>
                        <div className="">
                          <label htmlFor="licence">Licence :</label>
                          <Upload>
                            <Button icon={<UploadOutlined />}>
                              Click to Upload
                            </Button>
                          </Upload>
                        </div>
                        <div className="">
                          <label htmlFor="vehicle">vehicle:</label>
                          <Upload>
                            <Button icon={<UploadOutlined />}>
                              Click to Upload
                            </Button>
                          </Upload>
                        </div>
                        <div className="">
                          <label htmlFor="pancard">pancard Card:</label>
                          <Upload>
                            <Button icon={<UploadOutlined />}>
                              Click to Upload
                            </Button>
                          </Upload>
                        </div>
                      </div>
                    </Form>
                  </div>
                </Modal>
              </div>
            </motion.div>
          )}
        </>
      )}
    </>
  );
}

export default Login;
