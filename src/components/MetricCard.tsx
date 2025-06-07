interface MetricCardProps {
  iconUrl: string;
  status: string;
  count: string;
  onClick?: () => void;
  alt?: string; // Adding alt text prop for better accessibility
}

const MetricCard = ({
  iconUrl,
  status,
  count,
  onClick,
  alt = "status icon"
}: MetricCardProps) => {
  return (
    <div className="px-4 py-3 border border-[#E4E7EC] rounded-[10px] transition-shadow hover:shadow-sm">
      <div className="flex justify-between">
        <img src={iconUrl} className="mb-6" alt={alt} />
      </div>
      <p className="text-[#667185] text-[14px] font-normal mb-2">{status}</p>
      <div className="flex justify-between items-center">
        <p className="text-[18px] text-[#101928] font-semibold">{count}</p>
        {onClick && (
          <button
            className="underline text-deep-blue cursor-pointer text-sm"
            onClick={onClick}
            aria-label={`View details for ${status}`}
          >
            Click to view
          </button>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
