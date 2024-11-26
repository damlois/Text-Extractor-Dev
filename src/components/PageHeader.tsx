import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  previousPage: string;
  currentPage: string;
  noBorder?: boolean;
}

const PageHeader = ({
  previousPage,
  currentPage,
  noBorder,
}: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={`px-[24px] py-[16px] space-y-4  w-full ${
        noBorder ? "" : "border-b border-[#F0F0F0]"
      } text-[14px]`}
    >
      <div className="flex space-x-2 text-gray-600">
        <span
          className="text-gray cursor-pointer"
          onClick={() => navigate("/home")}
        >
          {previousPage}
        </span>
        <span className="text-gray">/</span>
        <span className="text-dark-grey">{currentPage}</span>
      </div>

      <div className="flex flex-col items-start w-full">
        <h1 className="text-black font-medium text-xl">{currentPage}</h1>
      </div>
    </div>
  );
};

export default PageHeader;
