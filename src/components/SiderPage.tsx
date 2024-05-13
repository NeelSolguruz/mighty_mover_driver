import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
// import { SIDE_PANEL } from "../assets/constant/constaint";
import NavLogo from "../assets/Images/icons/NavLogo";
import { FaHome } from "react-icons/fa";

const { Sider } = Layout;

export default function SiderPage({ collapse }: { collapse: boolean }) {
  const SIDE_PANEL = {
    menu: [
      {
        name: "Dashboard",
        navigate: "/",
        icon: <FaHome />,
      },
    ],
  };
  const navigate = useNavigate();
  const location = useLocation();

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
              key={item.navigate}
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
