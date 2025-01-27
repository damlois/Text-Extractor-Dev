import { useNavigate, Outlet } from "react-router-dom";
import { Tabs } from "antd";
import PageHeader from "../../../components/PageHeader";

const InvoiceAppTabSelector = () => {
  const navigate = useNavigate();

  const dataSourceExists = false;

  const tabItems = [
    { key: "data-source", label: "Data Source Configuration" },
    { key: "extraction-history", label: "Extraction History" },
    { key: "saved-insights", label: "Saved Insights" },
  ];

  const handleTabChange = (key: string) => {
    navigate(`/invoice-processing/${key}`);
  };

  const splittedPathName = window.location.pathname.split("/");

  return (
    <div className="flex flex-col items-start font-inter">
      <PageHeader
        currentPage="Data Source Configuration"
        previousPage="Home"
        pageTitle="Invoice Processing"
        action={
          splittedPathName[2] === "data-source" &&
          !splittedPathName[3] &&
          !dataSourceExists
            ? "+ New Data Source"
            : undefined
        }
        onActionClick={() => navigate("/invoice-processing/data-source/create")}
        noBorder
      />

      <div className="flex flex-col items-center w-full py-2">
        <div className="w-full border-b border-[#F0F0F0]">
          <Tabs
            activeKey={splittedPathName[2]}
            onChange={handleTabChange}
            items={tabItems}
            className="custom-tabs font-inter text-dark-gray px-6 bo"
          />
        </div>
      </div>

      <div className="p-6 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default InvoiceAppTabSelector;
