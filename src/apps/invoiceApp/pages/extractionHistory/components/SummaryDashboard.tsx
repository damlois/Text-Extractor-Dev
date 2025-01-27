import MetricCard from "../../../../../components/MetricCard";

const SummaryDashboard = () => {
  return (
    <div className="grid gap-4 space-between flex-wrap lg:grid-cols-2 sm:grid-cols-1">
      <MetricCard
        iconUrl="/assets/icons/dashboard-success-icon.svg"
        status="Successful"
        count="5,890"
      />
      <MetricCard
        iconUrl="/assets/icons/dashboard-failed-icon.svg"
        status="Failed"
        count="78990"
      />
    </div>
  );
};

export default SummaryDashboard;
