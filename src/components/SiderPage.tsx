import { Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import NavLogo from "../assets/Images/icons/NavLogo";
import { FaAddressCard, FaHome } from "react-icons/fa";
import { GrDocumentImage } from "react-icons/gr";
import { useEffect } from "react";

const { Sider } = Layout;

export default function SiderPage({ collapse }: { collapse: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    window.location.pathname;
  }, []);

  const SIDE_PANEL = {
    menu: [
      {
        key: "/",
        name: "Dashboard",
        navigate: "/",
        icon: <FaHome />,
      },
      {
        key: "/document",
        name: "Document",
        navigate: "/document",
        icon: <GrDocumentImage />,
      },
      {
        key: "/address",
        name: "Address",
        navigate: "/address",
        icon: <FaAddressCard />,
      },
      {
        key: "/order",
        name: "Order",
        navigate: "/order",
        icon: <FaAddressCard />,
      },
    ],
  };

  return (
    <div className="h-screen sticky top-0 shadow-lg">
      <Sider
        theme="light"
        collapsed={collapse}
        collapsedWidth={0}
        style={{
          overflow: "auto",
          height: "100vh",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="flex justify-center mt-5">
          <div className="w-8/12">
            <NavLogo />
          </div>
        </div>
        <Menu
          className="mt-3"
          theme="light"
          triggerSubMenuAction="hover"
          mode="inline"
          selectedKeys={[location.pathname]}
        >
          {SIDE_PANEL.menu.map((item) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              onClick={() => navigate(item.navigate)}
            >
              {item.name}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
    </div>
  );
}
