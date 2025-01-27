import ExtractionHistoryTable from "./components/ExtractionHistoryTable";
import SummaryDashboard from "./components/SummaryDashboard";

const ExtractionHistory = () => {
  return (
    <div className="flex flex-col gap-6">
      <SummaryDashboard />
      <ExtractionHistoryTable />
    </div>
  );
};

export default ExtractionHistory;
