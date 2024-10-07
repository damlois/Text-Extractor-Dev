import React from "react";
import { Layout, Image } from "antd";
import { Link } from "react-router-dom";

const { Header, Content } = Layout;

interface PageLayoutProps {
  showNavBar?: boolean;
  showBgImage?: boolean;
  children: React.ReactNode;
}

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Team", path: "/team" },
  { name: "Pricing", path: "/pricing" },
  { name: "Documentation", path: "/documentation" },
  { name: "Sign in", path: "/sign-in" },
];

const PageLayout: React.FC<PageLayoutProps> = ({
  showNavBar,
  showBgImage,
  children,
}) => {
  return (
    <Layout
      style={{
        backgroundImage: showBgImage
          ? "url('/assets/images/page-bg.png')"
          : "none",
        backgroundSize: "cover",
        backgroundColor: "#1D1E18",
      }}
    >
      <Header
        className={`font-montserratAlternates mt-[22px] mx-[56px] bg-transparent flex justify-${
          showNavBar ? "between" : "center"
        } items-center flex-wrap h-[64px]`}
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
            <ul className="flex space-x-3 md:space-x-16">
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
      </Header>

      <Content>{children}</Content>
    </Layout>
  );
};

export default PageLayout;
