import React, { useState } from "react";
import { Layout, Menu, Avatar, Button, MenuProps } from "antd";
import {
  HomeOutlined,
  UploadOutlined,
  FolderOpenOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import keycloakService from "../service/keycloakService";

const { Header, Sider, Content } = Layout;

interface PageLayoutProps {
  showLayout?: boolean;
  children: React.ReactNode;
}

type MenuItem = Required<MenuProps>["items"][number];

const PageLayout: React.FC<PageLayoutProps> = ({ showLayout, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const items: MenuItem[] = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "Home",
      onClick: () => navigate("/home"),
    },
    { key: "2", icon: <UploadOutlined />, label: "Upload" },
    { key: "3", icon: <FolderOpenOutlined />, label: "Archives" },
    { key: "4", icon: <UserOutlined />, label: "Account" },
  ];

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="w-full h-screen">
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
            trigger={null}
          >
            <div className="flex px-[19px] py-[15px] h-16 text-xl text-black font-semibold border-b border-[#F0F0F0]">
              <img src="/assets/images/logo.png" alt="interprAIs Logo" />
            </div>
            <Menu
              defaultSelectedKeys={["1"]}
              mode="inline"
              items={items}
            />
          </Sider>

          <Layout style={{ flex: 1, width: "85%" }} className="h-screen">
            <Header className="header bg-white p-0 border-b border-[#F0F0F0]">
              <div className="toolbar flex items-center px-4">
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={toggleCollapsed}
                  className="menu-toggle hidden md:inline"
                />
                <Avatar icon={<UserOutlined />} className="ml-auto" />
                <span className="ml-2">{keycloakService.getFullName()}</span>
              </div>
            </Header>

            <Content
              className="overflow-auto bg-white shadow-sm"
              style={{ height: "calc(100vh - 300px)" }}
            >
              <div>{children}</div>
            </Content>
          </Layout>
        </>
      ) : (
        <Content
          className="overflow-auto bg-white shadow-sm"
          style={{ height: "calc(100vh - 64px)" }}
        >
          <div>{children}</div>
        </Content>
      )}
    </Layout>
  );
};

export default PageLayout;
