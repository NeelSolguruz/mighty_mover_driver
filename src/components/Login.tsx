import { useCallback, useEffect, useState } from "react";
// import Link from "next/Link";
import http from "../http/http";
import axios, { AxiosError } from "axios";
// import { useRouter } from "next/navigation";
import NavLogo from "../assets/Images/icons/NavLogo";
import { useRef } from "react";
import { motion } from "framer-motion";
// import { UploadOutlined } from "@ant-design/icons";

// import { useDispatch } from "react-redux";
// import { driverAdd } from "../redux/driverSlice";
import { toast } from "sonner";
// import { documentData } from "../assets/dto/data.type";
import formhttp from "../http/formHttp";
import {
  DID_NOT_GET,
  DRIVER_LOGIN,
  LOGIN_DATA_STRING,
  OTP_SENT_DESC,
  // LOGIN,
  OTP_SENT_TO_EMAIL,
  OTP_VERIFICATION,
} from "../assets/constant/constaint";
import { driver_login, verify_driver_otp } from "../http/staticTokenService";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  Image,
  // Image,
  Input,
  Modal,
  Select,
  Upload,
  // UploadProps,
  // message,
} from "antd";

import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { driverAdd } from "../redux/driverSlice";
import useFcmToken from "../utils/FCM/useFcmToken";

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
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localEmail, setLocalEmail] = useState("");
  const [localDriver, setLocalDriver] = useState("");
  const [localToken, setLocalToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [otppage, setotppage] = useState(false);
  const [modal, setModal] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[] | undefined>();
   const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
 const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  // const [otp, setOtp] = useState("");

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const fcm_token = useFcmToken();
  if (fcm_token) {
    localStorage.setItem("fcm_token", fcm_token);
  }

  const resetForm = () => {
    setEmail("");
  };
  console.log("otp", otp.join());
  const [flag, setFlag] = useState(false);
  console.log("flag", flag);
  const verifyotp = async () => {
    setLoading(true);

    try {
      const ftoken = localStorage.getItem("fcm_token");
      const user_details = await verify_driver_otp({
        email: email,
        OTP: otp.join(""),
        fcm_token: ftoken,
      });
      const updatedFlag = user_details.data.data.flag;
      setFlag(updatedFlag);
      if (updatedFlag == true) {
        navigate("/");
        const obj = {
          token: user_details.data.data.token,
          driver: user_details.data.data.name,
          email: user_details.data.data.email,
        };
        setFlag(false);
        console.log("after flag", !flag);
        console.log(obj);
        localStorage.setItem("Driver", JSON.stringify(obj));
        dispatch(driverAdd(obj));
      } else {
        setLocalDriver(user_details.data.data.name);
        setLocalEmail(user_details.data.data.email);
        const obj = {
          token: user_details.data.data.token,
        };
        console.log(obj);
        localStorage.setItem("Driver", JSON.stringify(obj));
        fetchVehicleTypes();
        setLoading(false);
        resetForm();
        setotppage(false);
        setModal(true);
      }

      toast.success(user_details.data.message);
      // console.log(user_details.data);
      // console.log(user_details.data.data.token);
      // setLocalToken(user_details.data.data.token);
      // setLocalDriver(user_details.data.data.name);
      // setLocalEmail(user_details.data.data.email);

      // console.log(obj);
      // localStorage.setItem("Driver", JSON.stringify(obj));

      // dispatch(driverAdd(obj));
      // const obj = {
      //   token: localToken,
      //   // driver: localDriver,
      //   // email: localEmail,
      // };
    } catch (error) {
      handleError(error as Error);
    } finally {
      console.log("final flag", flag);

      setLoading(false);
      setOtp(["", "", "", "", "", ""]);
    }
  };
  const fetchVehicleTypes = async () => {
    console.log("Fetch api called");
    try {
      const response = await http.get<{ data: Vehicle[] }>("/api/v1/vehicle");
      console.log("response", response);
      const vehiclesData = response.data.data;
      console.log(vehiclesData);
      const uniqueVehicleTypes = Array.from(
        new Set(vehiclesData?.map((vehicle) => vehicle.vehicle_type))
      );
      setVehicleTypes(uniqueVehicleTypes);
      setVehicles(vehiclesData);
    } catch (error) {
      handleError(error as Error);
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

  const handleError = (error: Error) => {
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
  };
  useEffect(() => {
    fetchVehicleTypes();
  }, []);

  const handleSubmit = async (data) => {
    // console.log("====================================");
    // console.log(data);
    // console.log("====================================");
    // e.preventDefault();
    setLoading(true);

    try {
      const response = await driver_login({
        email: data.email,
        password: data.password,
      });
      console.log(response.data.message);
      // console.log(response);
      toast.success(response.data.message);
      setotppage(true);
      setEmail(data.email);
      setPassword(data.password);
      // setModal(true);
    } catch (error) {
      setModal(false);
      handleError(error as Error);
    } finally {
      setLoading(false);
    }
  };
  const handleDidNotGet = async () => {
    setLoading(true);
    console.log("email :", email);
    try {
      const response = await driver_login({
        email: email,
        password: password,
      });
      console.log(response.data.message);
      setLoading(false);
      setotppage(true);
    } catch (error) {
      handleError(error as Error);
    }
  };

  const handleInputChange = useCallback(
    (index: number, value: string) => {
      const newOtp = [...otp];
      newOtp[index] = value;

      if (value && index < otp.length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }

      setOtp(newOtp);
    },
    [otp]
  );

  const handleInputKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (index > 0 && !otp[index]) {
          const newOtp = [...otp];
          newOtp[index - 1] = "";
          setOtp(newOtp);
          inputRefs.current[index - 1]?.focus();
        } else {
          const newOtp = [...otp];
          newOtp[index] = "";
          setOtp(newOtp);
        }
      }
    },
    [otp]
  );
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
      handleError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const [documentModal, setDocumentModal] = useState(false);

  const [aadharPreview, setAadharPreview] = useState("");
  const [licencePreview, setLicencePreview] = useState("");
  const [vehiclePreview, setVehiclePreview] = useState("");
  const [pancardPreview, setPancardPreview] = useState("");
  const [documentUploadStatus, setDocumentUploadStatus] = useState({
    aadhar: false,
    licence: false,
    pancard: false,
    vehicle: false,
  });
  const handleDocument = async (type, file) => {
    if (!file) return;
    setLoading(true);
    const imageUrl = URL.createObjectURL(file.originFileObj);
    if (type === "aadhar") {
      setAadharPreview(imageUrl);
    } else if (type === "licence") {
      setLicencePreview(imageUrl);
    } else if (type === "vehicle") {
      setVehiclePreview(imageUrl);
    } else if (type === "pancard") {
      setPancardPreview(imageUrl);
    }
    // setPreviewImage(file.originFileObj);
    console.log("file.originFileObj:", file.originFileObj);
    try {
      const formData = new FormData();
      formData.append("image", file.originFileObj);
      formData.append("type", type);
      const response = await formhttp.post("api/v1/document", formData);
      setLoading(false);

      setDocumentUploadStatus((prevState) => ({ ...prevState, [type]: true }));
      toast.success(response.data.message);
      const obj = {
        token: localToken,
        driver: localDriver,
        email: localEmail,
      };
      console.log(obj);
      localStorage.setItem("Driver", JSON.stringify(obj));

      dispatch(driverAdd(obj));
    } catch (error) {
      setLoading(false);
      handleError(error as Error);
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
            {/* <div className="w-[180px]">
                <NavLogo />
              </div> */}
            {otppage ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[10] flex justify-center items-center"
                >
                  <div className=" relative w-[35%] flex justify-center items-center gap-2 p-10 bg-white rounded-lg max-[1228px]:w-[40%] max-[1025px]:w-[50%] max-[818px]:w-[60%] max-[683px]:w-[70%] max-[587px]:w-[80%] max-[517px]:w-[90%] max-[455px]:p-4 max-[386px]:p-2">
                    <div className="">
                      <button
                        className=" absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none "
                        onClick={() => setotppage(false)} // Add a function to handle the close action
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="w-full flex flex-col justify-center p-4 gap-6">
                      <div className="w-full flex justify-center">
                        <div className="w-[40%]">
                          <NavLogo />
                        </div>
                      </div>
                      <h1 className="text-2xl font-bold text-center max-[332px]:text-3xl ">
                        {OTP_VERIFICATION}
                      </h1>
                      <div className="max-[455px]:text-sm text-center max-[360px]:text-xs w-auto">
                        {OTP_SENT_DESC}
                      </div>
                      <div className="flex justify-center w-auto items-center">
                        <div className="max-[455px]:text-sm  text-center max-[360px]:text-xs w-auto">
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
                        {/* {[...Array(6)].map((_, index) => ( */}
                        {/* // <input
                            //   key={index}
                            //   ref={(el) =>
                            //     (inputs.current[index] = el as HTMLInputElement)
                            //   }
                            //   type="text"
                            //   id={`otp${index + 1}`}
                            //   className="border border-black w-10 h-10 rounded-lg text-center text-xl font-medium max-[386px]:w-8 max-[386px]:h-8 "
                            //   maxLength={1}
                            //   onInput={(e) => handleInput(e, index)}
                            // />
                          // ))} */}
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            className="border border-black w-10 h-10 rounded-lg text-center text-xl font-medium max-[386px]:w-8 max-[386px]:h-8"
                            type="text"
                            maxLength={1}
                            value={digit}
                            autoFocus={index === 0}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            onChange={(e) =>
                              handleInputChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleInputKeyDown(index, e)}
                          />
                        ))}
                      </div>
                      <div
                        className="flex w-full justify-end items-center text-gray-400 text-xs"
                        onClick={handleDidNotGet}
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
              <section className=" min-h-screen flex items-center justify-center ">
                <div className="w-full max-w-md p-8  rounded-lg shadow-xl ">
                  <div className="flex justify-center mb-5 w-full h-full">
                    <div className="w-[50%] h-[50%]">
                      <NavLogo />
                    </div>
                  </div>
                  <div className="bg-[#2967ff] py-4 px-4 rounded-t-lg text-white">
                    <h1 className="text-xl text-white font-bold text-center">
                      {/* <h1 className="text-4xl font-bold"> */}
                      {DRIVER_LOGIN.sign_in}
                    </h1>
                    {/* </h1> */}
                  </div>
                  <div className="mt-6">
                    <Form
                      name="login-form"
                      onFinish={handleSubmit}
                      className="space-y-4"
                    >
                      <Form.Item
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: "Please input your email!",
                          },
                        ]}
                      >
                        <Input
                          prefix={<UserOutlined />}
                          placeholder={LOGIN_DATA_STRING.EMAIL}
                          className="input-field"
                          // value={email}
                          // onChange={(e) => setEmail(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: "Please input your password!",
                          },
                        ]}
                      >
                        <Input.Password
                          prefix={<LockOutlined />}
                          placeholder={LOGIN_DATA_STRING.PASSWORD}
                          className="input-field"
                          // value={password}
                          // onChange={(e) => setPassword(e.target.value)}
                        />
                      </Form.Item>

                      <Form.Item>
                        <label
                          onClick={() => navigate("/login/forgot-password")}
                          // to="/login/forgot-password"
                          className="font-semibold text-blue-500 hover:text-blue-400 transition-all flex justify-end"
                        >
                          Forgot Password
                        </label>
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="btn-signin"
                          block
                          style={{ backgroundColor: "#2967ff" }}
                        >
                          {LOGIN_DATA_STRING.LOGIN}
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              </section>
            </>
          </div>
          {/* </div> */}
          {flag == false && (
            <>
              {modal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="top-0 z-10 left-0 w-full h-full bg-black bg-opacity-50"
                >
                  <div className="bg-white p-4 rounded-lg w-11/12 h-auto flex flex-col items-center">
                    <div>
                      <h1 className="text-3xl font-bold">VEHICLE DETAILS</h1>
                    </div>
                    <div className="w-1/2">
                      <Modal
                        open={modal}
                        onOk={() => form.submit()}
                        onCancel={() => navigate("/")}
                      >
                        <Form
                          form={form}
                          onFinish={handleVehicleSubmit}
                          className="p-3 m-3"
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 14 }}
                          style={{ maxWidth: 600 }}
                          // onAbort={() => router("/")}
                        >
                          <Form.Item label="Vehicle Number" name="vehicle_num">
                            <Input
                              placeholder="Enter vehicle number"
                              // onChange={handleVehicleChange}
                              name="vehicle_num"
                            />
                          </Form.Item>
                          <Form.Item label="Vehicle Type" name="vehicle_type">
                            <Select
                              placeholder="Select vehicle category"
                              onChange={(value) =>
                                handleVehicleTypeChange(value)
                              }
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
                          <Form.Item label="Max Weight" name="max_weight">
                            <Input
                              readOnly={true}
                              disabled
                              // value={vehicleFormData.max_weight}
                            />
                          </Form.Item>
                          <Form.Item label="Length" name="length">
                            <Input readOnly={true} disabled />
                          </Form.Item>
                          <Form.Item label="Height" name="height">
                            <Input readOnly={true} disabled />
                          </Form.Item>
                          <Form.Item label="Per KM charge" name="per_km_charge">
                            <Input readOnly={true} disabled />
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
                  <Modal
                    open={documentModal}
                    onOk={() => navigate("/")}
                    className="w-auto h-auto p-4"
                  >
                    <div className="p-4 rounded-lg w-full h-auto flex flex-col items-center ">
                      <div>
                        <h1 className="text-xl font-bold">Upload Documents</h1>
                      </div>
                      <div className="w-auto max-lg:w-9/12 max-sm:w-7/12 my-10 grid grid-cols-2 gap-6">
                        <div className="">
                          <Form className="justify-center mr-4 ">
                            <div className="mb-4">
                              <label htmlFor="aadhar">Aadhar Card:</label>
                              <Upload
                                maxCount={1}
                                listType="picture-card"
                                className="avatar-uploader"
                                disabled={documentUploadStatus.aadhar}
                                // beforeUpload=
                                onChange={(info) =>
                                  handleDocument("aadhar", info.file)
                                }
                              >
                                {aadharPreview ? (
                                  <Image
                                    src={aadharPreview}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div>Upload here</div>
                                )}

                                {/* here is a demo of how loader is worked */}
                                {/* {aadharPreview && (
                              <>
                                {loading ? (
                                  <Spin />
                                ) : (
                                  <Image
                                    src={aadharPreview}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </>
                            )}
                            {!aadharPreview && <div>Upload here</div>} */}

                                {/* <Button icon={<UploadOutlined />}>
                              Click to Upload Aadhar card
                            </Button> */}
                              </Upload>
                            </div>
                            <div className="">
                              <label htmlFor="licence">Licence :</label>
                              <Upload
                                maxCount={1}
                                listType="picture-card"
                                disabled={documentUploadStatus.licence}
                                onChange={(info) =>
                                  handleDocument("licence", info.file)
                                }
                              >
                                {licencePreview ? (
                                  <Image
                                    src={licencePreview}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div>Upload here</div>
                                )}
                                {/* <Image src={licencePreview} /> */}
                                {/* <Button icon={<UploadOutlined />}>
                              Click to Upload
                            </Button> */}
                              </Upload>
                            </div>
                          </Form>
                        </div>
                        <div className="">
                          <Form className="justify-center ml-4">
                            <div className="mb-4">
                              <label htmlFor="vehicle">Vehicle:</label>
                              <Upload
                                maxCount={1}
                                listType="picture-card"
                                disabled={documentUploadStatus.vehicle}
                                onChange={(info) =>
                                  handleDocument("vehicle", info.file)
                                }
                              >
                                {vehiclePreview ? (
                                  <Image
                                    src={vehiclePreview}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div>Upload here</div>
                                )}
                                {/* <Image src={vehiclePreview} className=" w-full " /> */}
                                {/* <Button icon={<UploadOutlined />}>
                              Click to Upload
                            </Button> */}
                              </Upload>
                            </div>
                            <div className="">
                              <label htmlFor="pancard">Pancard Card:</label>
                              <Upload
                                maxCount={1}
                                listType="picture-card"
                                disabled={documentUploadStatus.pancard}
                                onChange={(info) =>
                                  handleDocument("pancard", info.file)
                                }
                              >
                                {pancardPreview ? (
                                  <Image
                                    src={pancardPreview}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div>Upload here</div>
                                )}
                                {/* <Image src={pancardPreview} /> */}
                                {/* <Button icon={<UploadOutlined />}>
                              Click to Upload
                            </Button> */}
                              </Upload>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </div>
                  </Modal>
                </motion.div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

export default Login;
