import { Image } from "antd";
import AppButton from "../../components/AppButton";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <main className="flex flex-col items-center justify-center text-center font-inter min-h-screen">
      <Image src="/assets/images/logo.png" alt="logo" />
      <h1 className="text-black text-[32px] font-medium leading-tight md:text-[48px] lg:text-[64px] mb-8">
        Sign in!
      </h1>
      <AppButton width="40%" children="Sign In" onClick={() => navigate("/home")} />
    </main>
  );
};

export default LandingPage;
