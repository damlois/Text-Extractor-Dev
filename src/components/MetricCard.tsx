import { FaAngleDown } from "react-icons/fa";

interface MetricCardProps {
  iconUrl: string;
  status: string;
  count: string;
  onClick?: () => void;
}

const MetricCard = ({ iconUrl, status, count, onClick }: MetricCardProps) => {
  return (
    <div className="px-4 py-3 border border-[#E4E7EC] rounded-[10px]">
      <div className="flex justify-between ">
        <img src={iconUrl} className="mb-6" alt="success icon" />
        <p className="text-[#98A2B3] text-[12px] flex">
          <span>Last 30 days</span> <FaAngleDown className="ml-2" />
        </p>
      </div>
      <p className="text-[#667185] text-[14px] font-normal mb-2">{status}</p>
      <div className="flex justify-between">
        <p className="text-[18px] text-[#101928] font-semibold">{count}</p>
        {onClick ? (
          <p
            className="underline text-deep-blue cursor-pointer"
            onClick={onClick}
          >
            Click to view
          </p>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
