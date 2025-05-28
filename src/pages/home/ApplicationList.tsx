import { Image } from "antd";
import ApplicationCard from "../../components/ApplicationCard";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDocumentProcessor } from "../../context/DocumentProcessorContext";
import { FileTextOutlined, FileDoneOutlined } from "@ant-design/icons";
import { useApplication } from "../../context/ApplicationContext";
import { Application } from "../../types";

const ApplicationList = () => {
  const navigate = useNavigate();

  const { fetchDataSource } = useDocumentProcessor();
  const { setAppType } = useApplication();

  useEffect(() => {
    fetchDataSource();
  }, []);

  const handleNavigation = (app: Application) => {
    setAppType(app);
    navigate("/home/document-processing/data-source");
  };

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
              title="Invoice"
              description="Process Invoices here"
              icon={
                <FileTextOutlined style={{ fontSize: "24px", color: "#fff" }} />
              }
              onClick={() => handleNavigation("INVOICE")}
            />
            <ApplicationCard
              title="Purchase Order"
              description="Process Purchase Orders here"
              icon={
                <img
                  src="/assets/icons/purchase-order-icon.svg"
                  style={{ fontSize: "24px", color: "#fff" }}
                />
              }
              onClick={() => handleNavigation("PURCHASE ORDER")}
            />
            <ApplicationCard
              title="Receipt"
              description="Process Receipts here"
              icon={
                <FileDoneOutlined style={{ fontSize: "24px", color: "#fff" }} />
              }
              onClick={() => handleNavigation("RECEIPT")}
            />
          </div>
        </>
      </div>
    </div>
  );
};

export default ApplicationList;
