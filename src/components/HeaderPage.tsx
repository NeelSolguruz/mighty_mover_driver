import {
  Tooltip,
  Flex,
  Modal,
  Upload,
  Avatar,
  Input,
  Button,
  message,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { FaAddressCard, FaHome, FaUser } from "react-icons/fa";
import { useState, useEffect, ChangeEventHandler } from "react";
import ImgCrop from "antd-img-crop";
import type { GetProp, UploadProps, UploadFile } from "antd";
import { useNavigate } from "react-router-dom";
import { Menu, Dropdown } from "antd";
import { TiArrowSortedDown } from "react-icons/ti";
// import { IoArrowBack } from 'react-icons/io5';
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
// import { useDispatch } from 'react-redux';
// import { Adminlogout } from '../redux/userSlice';
import http from "../http/http";
import Loader from "./Loader";
import { HiMiniBarsArrowDown } from "react-icons/hi2";
// import { userData } from '../assets/userData';
// import { IoMdSettings } from "react-icons/io";
// import { BiSolidMessageEdit } from "react-icons/bi";
// import { RiUserSettingsFill } from 'react-icons/ri';
// import { TbSettingsCog } from 'react-icons/tb';
// import { FaCity } from "react-icons/fa";
// import { RiCoupon2Fill } from "react-icons/ri";
// import { FaMotorcycle } from "react-icons/fa6";
// import { RiUserSettingsLine } from "react-icons/ri";
// import {
//   MdOutlineCategory,
//   // MdOutlineContactPage,
//   MdOutlinePayment,
// } from "react-icons/md";
import { GrDocumentImage } from "react-icons/gr";
import { useDispatch } from "react-redux";
import { driverLogout } from "../redux/driverSlice";
// import { set } from "firebase/database";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export default function HeaderPage({
  collapse,
  setcollapse,
  currentPage,
}: {
  collapse: boolean;
  setcollapse: React.Dispatch<React.SetStateAction<boolean>>;
  currentPage: string;
}) {
  //   const [firstname, setFirstname] = useState("");
  //   const [lastname, setLastname] = useState("");
  const [name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [contact, setContact] = useState("");

  // const [toggle1, settoggle1] = useState(false);
  const [pic, setPic] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const logoutDriver = await http.get("/api/v1/driver/logout");
      toast.success(logoutDriver.data.message);
      console.log(logoutDriver);
      navigate("/login");
      dispatch(driverLogout());

      setIsLoading(true);
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
      setIsLoading(false);
    }
  };
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await http.get("/api/v1/driver/profile");
      // setuserdata(response.data.data);
      setName(response.data.data.name);
      setEmail(response.data.data.email);
      setContact(response.data.data.contact);
      console.log(response.data.data);
      // setLoading(false);
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
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleOk = async () => {
    try {
      const updateRecord = await http.patch(`/api/v1/driver/profile`, {
        name: name,
        contact: contact,
      });

      toast.success(updateRecord.data.message);
      setIsModalOpen(false);
      setIsPasswordModalOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{
          status: number;
          message: string;
        }>;
        if (axiosError.response) {
          if (axiosError.response.status === 500) {
            toast.error("Server error occurred. Please try again later.");
          } else {
            toast.error(axiosError.response.data.message);
          }
        } else if (axiosError.request) {
          console.log("Request Error", axiosError.request);
        } else {
          console.log("Error", axiosError.message);
        }
        // resetForm();
      }
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    try {
      const changePassword = await http.patch("api/v1/admin/password", {
        old_password: oldPassword,
        new_password: newPassword,
      });

      toast.success(changePassword.data.message);

      console.log(changePassword);
      console.log(oldPassword);
      console.log(newPassword);
      setIsPasswordModalOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{
          status: number;
          message: string;
        }>;
        if (axiosError.response) {
          if (axiosError.response.status === 500) {
            toast.error("Server error occurred. Please try again later.");
          } else {
            toast.error(axiosError.response.data.message);
          }
        } else if (axiosError.request) {
          console.log("Request Error", axiosError.request);
        } else {
          console.log("Error", axiosError.message);
        }
        // resetForm();
      }
    }
  };

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 2 * 1024 * 1024;

    // check max size and type is valid or note
    const isInvalidFile = fileList.some(
      (file) =>
        file.size &&
        (file.size > maxSize ||
          (file.type && !allowedTypes.includes(file.type)))
    );

    if (isInvalidFile) {
      message.error(
        "Invalid file! Please make sure the file is a JPEG or PNG image and does not exceed 2MB."
      );
    } else {
      //  set the admin profile picture
      setFileList(fileList);
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPic(e.target?.result as string);
        };
        reader.readAsDataURL(fileList[0].originFileObj);
      } else {
        setPic(null);
      }
    }
  };
  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsPasswordModalOpen(false);
  };

  //   const handleFirstName: ChangeEventHandler<HTMLInputElement> = (e) => {
  //     setFirstname(e.target.value);
  //   };
  //   const handleLastName: ChangeEventHandler<HTMLInputElement> = (e) => {
  //     setLastname(e.target.value);
  //   };
  const handleName: ChangeEventHandler<HTMLInputElement> = (e) => {
    setName(e.target.value);
  };
  const handleContact: ChangeEventHandler<HTMLInputElement> = (e) => {
    setContact(e.target.value);
  };
  const handleEmailChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setEmail(e.target.value);
  };
  const handleOldPasswordChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange: ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setConfirmPassword(e.target.value);
  };
  const menu = (
    <Menu className="">
      <Menu.Item key="0" onClick={() => setIsModalOpen(true)}>
        Edit Profile
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1" onClick={() => setIsPasswordModalOpen(true)}>
        Change Password
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  // this const is for handling the toggle of sidebar
  const handletoggle = () => {
    setcollapse(!collapse);
  };
  let logo = null;

  // Assign the logo based on the current page
  switch (currentPage) {
    case "Dashboard":
      logo = <FaHome />;
      break;
    case "Document":
      logo = <GrDocumentImage />;
      break;
    case "Address":
      logo = <FaAddressCard />;
      break;
    default:
      logo = null;
      break;
  }
  return (
    <div className="w-full sticky top-0 z-10 ">
      {/* <Header  className="z-10 w-full bg-white shadow-sm shadow-gray-400 border-2 border-red-500"> */}
      <Flex justify="space-between" className="bg-gray-50  items-center">
        <Flex>
          <div>
            <Button className="text-xl ml-5 rounded-md" onClick={handletoggle}>
              {collapse ? (
                <HiMiniBarsArrowDown className="rotate-[270deg]" />
              ) : (
                <HiMiniBarsArrowDown className="rotate-90" />
              )}
            </Button>
          </div>
          <div className="text-lg font-semibold flex gap-2 justify-center items-center ml-4">
            <div>{logo}</div>
            <div>
              <h1 style={{ color: "black" }}>{currentPage}</h1>
            </div>
          </div>
        </Flex>
        <Flex className="h-16" gap="small" align="center">
          <div className="flex items-center gap-3 mr-2">
            <Tooltip title={<div className="flex  items-center">{name}</div>}>
              <div>
                {fileList.length === 0 ? (
                  <Avatar
                    className=""
                    size="large"
                    icon={<UserOutlined />}
                    alt="avatar"
                  />
                ) : (
                  <Avatar
                    className=""
                    size="large"
                    src={pic || <UserOutlined />}
                    icon={!pic ? <FaUser /> : undefined}
                    alt="avatar"
                    onClick={() => setIsModalOpen(true)}
                  />
                )}
              </div>
            </Tooltip>
            {/* model for edit profile */}
            <Modal
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={null}
            >
              <Flex vertical>
                <ImgCrop rotationSlider aspectSlider>
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture-card"
                    className="avatar-uploader "
                    fileList={fileList}
                    onChange={handleUploadChange}
                    onPreview={onPreview}
                    // beforeUpload={beforeUpload}
                  >
                    {fileList.length < 1 && <div>{<PlusOutlined />}</div>}

                    {/* <img src={imageUrl} alt="avatar" width={100} height={100} /> */}
                  </Upload>
                </ImgCrop>

                <Input
                  size="large"
                  placeholder="Email"
                  // prefix={<UserOutlined />}
                  value={Email}
                  onChange={handleEmailChange}
                />
                <br></br>
                <Input
                  size="large"
                  placeholder="Name"
                  // prefix={<UserOutlined />}
                  value={name}
                  onChange={handleName}
                />
                <br></br>
                <Input
                  size="large"
                  placeholder="Contact"
                  // prefix={<UserOutlined />}
                  value={contact}
                  onChange={handleContact}
                />
                <br></br>
                {/* <Input size="large" placeholder="Password" prefix={<RiLockPasswordLine />} /> */}

                <div className="flex justify-end mt-4 gap-3">
                  <Button onClick={handleCancel}>Cancel</Button>
                  <Button
                    type="primary"
                    onClick={handleOk}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    {isLoading ? <Loader /> : " Save Changes"}
                  </Button>
                </div>
              </Flex>
            </Modal>
            {/* model for password changes */}
            <Modal
              open={isPasswordModalOpen}
              onOk={handleChangePassword}
              onCancel={handleCancel}
              footer={null}
            >
              <Flex vertical>
                <div className="text-xl mb-3 -mt-1 font-semibold ">
                  Change Password
                </div>
                <Input.Password
                  size="large"
                  placeholder="Old Password"
                  // prefix={<UserOutlined />}
                  value={oldPassword}
                  onChange={handleOldPasswordChange}
                />
                <br></br>

                <Input.Password
                  size="large"
                  placeholder="New Password"
                  value={newPassword}
                  // prefix={<UserOutlined />}
                  onChange={handleNewPasswordChange}
                />
                <br></br>
                <Input.Password
                  size="large"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  // prefix={<UserOutlined />}
                  onChange={handleConfirmPasswordChange}
                />
                <br></br>
                {/* <Input size="large" placeholder="Password" prefix={<RiLockPasswordLine />} /> */}

                <div className="flex justify-end mt-4">
                  <Button onClick={handleCancel}>Cancel</Button>
                  <Button
                    type="primary"
                    onClick={handleChangePassword}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    {isLoading ? <Loader /> : "OK"}
                  </Button>
                </div>
              </Flex>
            </Modal>

            <Dropdown
              overlay={menu}
              trigger={["click"]}
              className="text-xl mr-2 "
              placement="bottom"
            >
              <a
                className="ant-dropdown-link "
                onClick={(e) => e.preventDefault()}
              >
                <TiArrowSortedDown />
              </a>
            </Dropdown>
          </div>
        </Flex>
      </Flex>
      {/* </Header> */}
    </div>
  );
}
