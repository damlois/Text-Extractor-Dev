import React, { useState } from "react";
import { Layout, Menu, Avatar, Button, Dropdown } from "antd";
import {
  UserOutlined,
  MenuOutlined,
  HomeOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import keycloakService from "../service/keycloakService";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import SignOutModal from "./SignOutModal";

const { Sider, Content } = Layout;

interface PageLayoutProps {
  hideLayout?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ hideLayout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleCollapsed = () => setCollapsed(!collapsed);
  const toggleSignOutModal = () => setShowSignOutModal(!showSignOutModal);

  const navBarItems = [
    {
      key: "/home",
      icon: <HomeOutlined />,
      label: "Home",
      onClick: () => navigate("/home"),
    },
    {
      key: "/users",
      icon: <TeamOutlined />,
      label: "User",
      onClick: () => navigate("/users"),
    },
    {
      key: "/roles",
      icon: <UserOutlined />,
      label: "Role & Permission",
      onClick: () => navigate("/roles"),
    },
  ];

  const toolbarDropdownMenu = {
    items: [
      {
        key: "1",
        label: "Profile",
        icon: <UserOutlined />,
      },
      {
        key: "2",
        label: "Settings",
        icon: <SettingOutlined />,
      },
      {
        key: "3",
        label: "Help Center",
        icon: <QuestionCircleOutlined />,
      },
      {
        key: "4",
        label: "Sign Out",
        onClick: toggleSignOutModal,
        icon: <LogoutOutlined />,
        danger: true,
      },
    ],
  };

  return (
    <Layout className="w-full h-screen">
      {!hideLayout ? (
        <>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            breakpoint="md"
            collapsedWidth="0"
            className="bg-white border-r border-[#F0F0F0]"
            width="15%"
            trigger={null}
          >
            <div className="flex px-[19px] py-[15px] h-16 text-xl text-black font-semibold border-b border-[#F0F0F0]">
              <img src="/assets/images/logo.png" alt="interprAIs Logo" />
            </div>
            <Menu
              selectedKeys={[location.pathname]}
              mode="inline"
              items={navBarItems}
            />
          </Sider>

          <Layout style={{ flex: 1, width: "85%" }} className="h-screen">
            <div className="header bg-white p-0 border-b border-[#F0F0F0] py-4">
              <div className="toolbar flex justify-between items-center px-4">
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={toggleCollapsed}
                  className="menu-toggle hidden md:inline"
                />
                <Dropdown menu={toolbarDropdownMenu} trigger={["click"]}>
                  <div className="cursor-pointer flex gap-2 items-center">
                    <Avatar icon={<UserOutlined />} />
                    <div>{keycloakService.getFullName()}</div>
                  </div>
                </Dropdown>
              </div>
            </div>

            <Content
              className="overflow-auto bg-white shadow-sm"
              style={{ height: "calc(100vh - 300px)" }}
            >
              <Outlet />
            </Content>
          </Layout>

          <SignOutModal
            isOpen={showSignOutModal}
            onCancel={toggleSignOutModal}
          />
        </>
      ) : (
        <Content
          className="overflow-auto bg-white shadow-sm"
          style={{ height: "calc(100vh - 64px)" }}
        >
          <Outlet />
        </Content>
      )}
    </Layout>
  );
};

export default PageLayout;
