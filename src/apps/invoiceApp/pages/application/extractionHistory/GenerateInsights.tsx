import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import InsightsSection from "./components/insights/InsightsSection";
import ExtractionDetailsTable from "./components/insights/ExtractionDetailsTable";

const GenerateInsights = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-hidden">
      <div
        className="mt-2 text-deep-blue px-[0] cursor-pointer mb-8"
        onClick={() =>
          navigate("../extraction-history", {
            state: { fromInsightsPage: true },
          })
        }
      >
        <ArrowLeftOutlined className="mr-6" /> Back
      </div>
      <ExtractionDetailsTable />
      <InsightsSection />
    </div>
  );
};

export default GenerateInsights;
