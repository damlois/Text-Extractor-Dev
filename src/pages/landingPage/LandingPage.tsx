import AppButton from "../../components/AppButton";
import { Image } from "antd";
import { FiArrowUpRight } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <main className="flex flex-col items-center justify-center text-center font-montserrat min-h-screen p-6 sm:p-16 md:px-48 md:py-3 lg:px-64">
      <Image width={32} height={32} src="/assets/images/logo.png" alt="logo" />
      <h1 className="text-white text-[32px] pt-8 font-medium leading-tight md:text-[48px] lg:text-[64px]">
        Effortless Data Extraction, Maximum Efficiency.
      </h1>
      <p className="text-light-gray text-[12px] pt-4 pb-16 font-normal leading-normal md:text-[16px]">
        Extract text, images, and tables with precision, speed, and accuracy.
      </p>
      <AppButton width="182px">
        <span className="!inline-flex items-center">
          Try it out
          <FiArrowUpRight size={24} className="ml-2" />
        </span>
      </AppButton>
    </main>
  );
};

export default LandingPage;
