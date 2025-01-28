import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import InsightSuggestionRow from "../../../../../components/InsightSuggestionRow";
import { useState } from "react";

const InsightsSection = () => {
  const [insightQuery, setInsightQuery] = useState("");

  const suggestions = [
    "What’s the difference in payment terms across invoices?",
    "How do currency and exchange rates differ between invoices?",
    "How do discounts vary across invoices?",
  ];

  return (
    <div className="border-t border-[#0000000F] px-6 py-5">
      <InsightSuggestionRow
        suggestions={suggestions}
        setInsightQuery={setInsightQuery}
      />
      <div className="w-full text-center mt-5">
        <div className="flex items-center border border-[#D9D9D9] rounded-full px-4 py-2 shadow-sm">
          <Input
            placeholder="Ask interPrAIs"
            variant="borderless"
            className="flex-1 text-base focus:outline-none focus:ring-0 focus:border-none border-none"
            value={insightQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInsightQuery(e.target.value)
            }
          />
          <Button
            type="primary"
            shape="circle"
            icon={<ArrowRightOutlined />}
            className="bg-gradient-to-r from-[#F47A7A] to-[#2563EB] border-none shadow-md"
          />
        </div>

        <p className="text-[12px] text-dark-gray font-normal">
          InterprAIs can make mistakes. Check important info
        </p>
      </div>
    </div>
  );
};

export default InsightsSection;
