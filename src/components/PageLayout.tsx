import React, { useState } from "react";
import { Layout, Menu, Avatar, Button, Image } from "antd";
import {
  HomeOutlined,
  UploadOutlined,
  FolderOpenOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;

interface PageLayoutProps {
  showLayout?: boolean;
  children: React.ReactNode;
}

const navLinks = [
  { name: "Home", path: "/home", icon: <HomeOutlined /> },
  { name: "Upload", path: "/upload", icon: <UploadOutlined /> },
  { name: "Archives", path: "/archives", icon: <FolderOpenOutlined /> },
  { name: "Account", path: "/account", icon: <UserOutlined /> },
];

const PageLayout: React.FC<PageLayoutProps> = ({ showLayout, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="w-full">
      {showLayout ? (
        <>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            breakpoint="md"
            collapsedWidth="0"
            className="bg-white border-r border-[#F0F0F0]"
            width="15%"
          >
            <div className="flex px-[19px] py-[15px] h-16 text-xl text-black font-semibold border-b border-[#F0F0F0]">
              <img src="/assets/images/logo.png" alt="interprAIs Logo" />
            </div>
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              className="menu-items font-inter"
            >
              {navLinks.map((link) => {
                const isActive =
                  location.pathname.split("/")[1] === link.path.split("/")[1];
                return (
                  <Menu.Item
                    key={link.path}
                    icon={link.icon}
                    className="text-dark-gray hover:bg-light-blue m-0 w-full"
                    style={{
                      width: "100%",
                      borderRight: isActive ? "5px solid #006A94" : "none",
                      backgroundColor: isActive ? "#CCE1EA" : "transparent",
                    }}
                  >
                    <Link to={link.path} className="text-inherit">
                      {link.name}
                    </Link>
                  </Menu.Item>
                );
              })}
            </Menu>
          </Sider>

          <Layout style={{ flex: 1, width: "85%" }}>
            <Header className="header bg-white p-0 border-b border-[#F0F0F0]">
              <div className="toolbar flex items-center px-4">
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={toggleCollapsed}
                  className="menu-toggle hidden md:inline"
                />
                <Avatar icon={<UserOutlined />} className="ml-auto" />
                <span className="ml-2">Steve Grace</span>
              </div>
            </Header>

            <Content>
              <div className="content bg-white shadow-sm">{children}</div>
            </Content>
          </Layout>
        </>
      ) : (
        <Content>
          <div className="content bg-white shadow-sm">{children}</div>
        </Content>
      )}
    </Layout>
  );
};

export default PageLayout;
