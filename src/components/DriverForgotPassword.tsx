import { useState } from "react";
import { toast } from "sonner";
import { driver_forgotpassword } from "../http/staticTokenService";
import NavLogo from "../assets/Images/icons/NavLogo";
import { useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

import axios, { AxiosError } from "axios";
import { DRIVER_LOGIN, LOGIN_DATA_STRING } from "../assets/constant/constaint";
import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";

export default function DriverForgotPassword() {
  const router = useNavigate();
  // const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [form] = useForm();

  const forgotPassword = async (data) => {
    console.log("data:", data);
    setLoading(true);

    try {
      // const formdata = form.getFieldsValue();
      const response = await driver_forgotpassword({ email: data.email });
      toast.success(response.data.message);
      // setEmail("");

      router("/delivery-partner-login", { replace: true });
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
      <section className=" min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-8  rounded-lg shadow-xl ">
          <div className="flex justify-center mb-5 w-full h-full">
            <div className="w-[50%] h-[50%]">
              <NavLogo />
            </div>
          </div>
          <div className="bg-[#2967ff] py-4 px-4 rounded-t-lg text-white">
            <h1 className="text-xl text-white font-bold text-center">
              {DRIVER_LOGIN.sign_in}
            </h1>
          </div>
          <div className="mt-6">
            <Form
              form={form}
              name="login-form"
              onFinish={forgotPassword}
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

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="btn-signin"
                  block
                  style={{ backgroundColor: "#2967ff" }}
                >
                  {<>{loading ? "Loading..." : "Submit"}</>}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </section>
      {/* <div className="w-full flex justify-center py-16">
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
      </div> */}
    </>
  );
}
