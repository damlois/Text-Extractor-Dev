import { Image } from "antd";

const LandingPage = () => {
  return (
    <main className="flex flex-col items-center justify-center text-center font-inter min-h-screen">
      <Image src="/assets/images/logo.png" alt="logo" />
      <h1 className="text-black text-[32px] font-medium leading-tight md:text-[48px] lg:text-[64px]">
        Sign in!
      </h1>
    </main>
  );
};

export default LandingPage;
