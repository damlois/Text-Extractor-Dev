import { useNavigate, Outlet } from "react-router-dom";
import { Tabs } from "antd";
import PageHeader from "../../components/PageHeader";
import { useDocumentProcessor } from "./context/DocumentProcessorContext";
import { useRouteConfig } from "../../hooks/useRouteConfig";

const TabSelector = () => {
  const navigate = useNavigate();

  const { currentDataSource, loadingDataSource } = useDocumentProcessor();

  const routeConfig = useRouteConfig();

  const handleTabChange = (key: string) => {
    navigate(`/home/document-processing/${key}`);
  };

  const splittedPathName = window.location.pathname.split("/");

  const activeTabKey = splittedPathName[3];

  const activeNestedRouteKey = splittedPathName[4];

  const currentPageData = routeConfig.find((tab) => tab.key === activeTabKey);

  const currentNestedRoute = currentPageData?.nestedRoutes?.find(
    (nestedRoute) => nestedRoute.key === activeNestedRouteKey
  );

  const breadcrumbs =
    currentNestedRoute?.breadcrumbs || currentPageData?.breadcrumbs || [];

  const currentTabLabel =
    currentNestedRoute?.label || currentPageData?.label || "";

  const showOnlyBreadCrumb =
    currentNestedRoute && currentNestedRoute?.hideTabAndTitle;

  return (
    <div className="flex flex-col items-start font-inter">
      <PageHeader
        breadcrumbs={breadcrumbs}
        pageTitle={currentTabLabel}
        action={
          activeTabKey === "data-source" &&
          !activeNestedRouteKey &&
          !currentDataSource &&
          !loadingDataSource
            ? "+ New Data Source"
            : undefined
        }
        onActionClick={() =>
          navigate("/home/document-processing/data-source/create")
        }
        showOnlyBreadCrumb={showOnlyBreadCrumb}
        noBorder
      />

      {!showOnlyBreadCrumb && (
        <div className="flex flex-col items-center w-full py-3">
          <div className="w-full border-b border-[#F0F0F0]">
            <Tabs
              activeKey={activeTabKey}
              onChange={handleTabChange}
              items={routeConfig.map((tab) => ({
                key: tab.key,
                label: tab.label,
              }))}
              className="custom-tabs font-inter text-dark-gray px-6"
            />
          </div>
        </div>
      )}
      <div className="p-6 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default TabSelector;
