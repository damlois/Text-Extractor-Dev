import { FaAngleDown } from "react-icons/fa";

interface MetricCardProps {
  iconUrl: string;
  status: string;
  count: string;
}

const MetricCard = ({ iconUrl, status, count }: MetricCardProps) => {
  return (
    <div className="px-4 py-3 border border-[#E4E7EC] rounded-[10px]">
      <div className="flex justify-between ">
        <img src={iconUrl} className="mb-6" alt="success icon" />
        <p className="text-[#98A2B3] text-[12px] flex">
          <span>Last 30 days</span> <FaAngleDown className="ml-2" />
        </p>
      </div>
      <p className="text-[#667185] text-[14px] font-normal mb-2">{status}</p>
      <p className="text-[18px] text-[#101928] font-semibold">{count}</p>
    </div>
  );
};

export default MetricCard;
