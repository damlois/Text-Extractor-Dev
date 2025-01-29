import { useNavigate, Outlet } from "react-router-dom";
import { Tabs } from "antd";
import PageHeader from "../../../components/PageHeader";
import { routeConfig } from "../constants";

const InvoiceAppTabSelector = () => {
  const navigate = useNavigate();

  const dataSourceExists = localStorage.getItem("data_source_id");

  const handleTabChange = (key: string) => {
    navigate(`/invoice-processing/${key}`);
  };

  const splittedPathName = window.location.pathname.split("/");
  const activeTabKey = splittedPathName[2];
  const currentPageData = routeConfig.find((tab) => tab.key === activeTabKey);
  const currentNestedRoute = currentPageData?.nestedRoutes?.find(
    (nestedRoute) => nestedRoute.key === splittedPathName[3]
  );

  const currentTabLabel = currentNestedRoute?.label || currentPageData?.label || "";

  return (
    <div className="flex flex-col items-start font-inter">
      <PageHeader
        breadcrumbs={
          currentNestedRoute?.breadcrumbs || currentPageData?.breadcrumbs || []
        }
        pageTitle={currentTabLabel}
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
            activeKey={activeTabKey}
            onChange={handleTabChange}
            items={routeConfig.map((tab) => ({
              key: tab.key,
              label: tab.label,
            }))}
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
