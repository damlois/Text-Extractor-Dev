import { useNavigate } from "react-router-dom";
import AppButton from "./AppButton";

interface PageHeaderProps {
  previousPage?: string;
  currentPage: string;
  noBorder?: boolean;
  action?: string;
  onActionClick?: () => void;
  noBreadCrumb?: boolean;
}

const PageHeader = ({
  previousPage,
  currentPage,
  noBorder,
  action,
  onActionClick,
  noBreadCrumb,
}: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={`px-[24px] py-[16px] w-full ${
        noBorder ? "" : "border-b border-[#F0F0F0]"
      } text-[14px] flex gap-4 flex-wrap justify-between`}
    >
      <div className="flex gap-2 flex-col">
        {!noBreadCrumb && (
          <div className="flex space-x-2 text-gray-600">
            {previousPage && (
              <>
                <span
                  className="text-gray cursor-pointer"
                  onClick={() => navigate("/home")}
                >
                  {previousPage}
                </span>
                <span className="text-gray">/</span>
              </>
            )}
            <span className="text-dark-grey">{currentPage}</span>
          </div>
        )}

        <div className="flex flex-col items-start w-full">
          <h1 className="text-black font-medium text-xl">{currentPage}</h1>
        </div>
      </div>

      {action && (
        <AppButton
          onClick={onActionClick || (() => {})}
          width="133px"
          className="mr-0"
        >
          {action}
        </AppButton>
      )}
    </div>
  );
};

export default PageHeader;
