import { Image } from "antd";
import ApplicationCard from "./components/ApplicationCard";
import { useNavigate } from "react-router-dom";

const ApplicationList = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-start font-inter">
      <div className="flex flex-col items-center w-full p-6">
        <Image
          src="/assets/icons/hero-bg.png"
          preview={false}
          alt="hero image"
          width={"100%"}
        />

        <>
          <div className="mt-5 mb-5 flex gap-4 flex-wrap w-full justify-between text-[16px] font-medium">
            <h5>List of all applications</h5>
          </div>

          <div className="border-b-[0.5px] border-[#0000000F] mb-5 w-full"></div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4
              w-full`}
          >
            <ApplicationCard
              title="Invoice Processing Application"
              description="Process invoice here"
              onClick={() => navigate("/invoice-processing/data-source")}
            />
          </div>
        </>
      </div>
    </div>
  );
};

export default ApplicationList;
