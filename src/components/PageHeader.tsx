import { useNavigate } from "react-router-dom";
import AppButton from "./AppButton";
import { BreadCrumb } from "../types";

interface PageHeaderProps {
  breadcrumbs: BreadCrumb[];
  noBorder?: boolean;
  action?: string;
  onActionClick?: () => void;
  noBreadCrumb?: boolean;
  pageTitle?: string;
}

const PageHeader = ({
  breadcrumbs = [],
  noBorder,
  action,
  onActionClick,
  noBreadCrumb,
  pageTitle,
}: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={`px-[24px] py-[16px] w-full ${
        noBorder ? "" : "border-b border-[#F0F0F0]"
      } text-[14px] flex gap-4 flex-wrap justify-between items-center`}
    >
      <div className="flex gap-2 flex-col">
        {!noBreadCrumb && (
          <div className="flex space-x-2 text-gray-600">
            {breadcrumbs.map((breadcrumb, index) => (
              <span key={index} className="flex items-center space-x-2">
                {breadcrumb.path ? (
                  <span
                    className="cursor-pointer hover:underline text-gray"
                    onClick={() => navigate(breadcrumb.path || "/")}
                  >
                    {breadcrumb.label}
                  </span>
                ) : (
                  <span className="text-dark-grey">{breadcrumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && <span>/</span>}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col items-start w-full">
          <h1 className="text-black font-medium text-xl">
            {pageTitle || breadcrumbs[breadcrumbs.length - 1]?.label || ""}
          </h1>
        </div>
      </div>

      {action && (
        <AppButton
          onClick={onActionClick || (() => {})}
          width="fit-content"
          className="mr-0"
        >
          {action}
        </AppButton>
      )}
    </div>
  );
};

export default PageHeader;
