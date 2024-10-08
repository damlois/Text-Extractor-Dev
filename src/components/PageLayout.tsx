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
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <Header
        className={`font-montserratAlternates w-full bg-transparent flex gap-8 items-center px-4 sm:px-6 md:px-10 lg:px-14 sm:my-8 md:my-6`}
      >
        <div className="flex gap-2 items-center">
          <Image
            width={25}
            height={24}
            src="/assets/images/logo.png"
            alt="logo"
          />
          <h2 className="text-white text-lg font-bold">Vorlux</h2>
        </div>

        <div className="flex-grow" />

        {showNavBar && (
          <nav>
            <ul className="flex flex-wrap space-x-2 sm:space-x-3 md:space-x-10 lg:space-x-16">
              {navLinks.map((link) => (
                <li className="inline-block p-0 m-0 leading-normal" key={link.path}>
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
