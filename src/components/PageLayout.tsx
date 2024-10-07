import React from "react";
import { Layout, Image } from "antd";
import { Link } from "react-router-dom";

const { Header, Content } = Layout;

interface PageLayoutProps {
  showNavBar?: boolean;
  children: React.ReactNode;
}

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Team", path: "/team" },
  { name: "Pricing", path: "/pricing" },
  { name: "Documentation", path: "/documentation" },
  { name: "Sign in", path: "/sign-in" },
];

const PageLayout: React.FC<PageLayoutProps> = ({ showNavBar, children }) => {
  return (
    <Layout
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundImage: "url('/assets/images/page-bg.png')",
        backgroundSize: "cover",
        backgroundColor: "#1D1E18",
        padding: showNavBar ? "22px 56px 40px 56px" : "40px 56px",
      }}
    >
      <Header
        className="font-montserratAlternates"
        style={{ background: "none", padding: "0" }}
      >
        <div
          className={`flex justify-${
            showNavBar ? "between" : "center"
          } items-center flex-wrap`}
        >
          <div className="flex items-center">
            <Image
              width={25}
              height={24}
              src="/assets/images/logo.png"
              alt="logo"
            />
            <h2 className="ml-2 text-white text-lg font-bold">Vorlux</h2>
          </div>
          {showNavBar && (
            <nav className="flex ml-auto">
              <ul className="flex space-x-8 md:space-x-16">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-light-gray hover:text-white transition duration-300 ease-in-out"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </Header>

      <Content className="flex-grow p-4 md:p-8 lg:p-16">{children}</Content>
    </Layout>
  );
};

export default PageLayout;
