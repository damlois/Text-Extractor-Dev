import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useState } from "react";
import PrmoptSuggestionRow from "../../../../../components/PromptSuggestionRow";
import ChatHistorySection from "./ChatHistorySection";

const InsightsSection = () => {
  const [prompt, setPrompt] = useState("");
  const [responseLoading, setResponseLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const suggestions = [
    "What’s the difference in payment terms across invoices?",
    "How do currency and exchange rates differ between invoices?",
    "How do discounts vary across invoices?",
  ];

  const handleSendMessage = async (query?: string) => {
    if (!prompt?.trim() && !query?.trim()) return;

    setChatHistory((prevMessages) => [
      ...prevMessages,
      { prompt: prompt, from: "user" },
    ]);

    setResponseLoading(true);
    try {
      const apiResponse = "Here is the API's response to your prompt.";

      setChatHistory((prevMessages) => [
        ...prevMessages,
        { response: apiResponse, from: "model" },
      ]);

      setPrompt("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setResponseLoading(false);
    }
  };

  return (
    <div>
      <ChatHistorySection
        chatHistory={chatHistory}
        handleSendMessage={handleSendMessage}
      />

      <div className="border-t border-[#0000000F] px-6 py-5">
        <PrmoptSuggestionRow
          promptSuggestions={suggestions}
          setPrompt={setPrompt}
        />

        <div className="w-full text-center">
          <div className="flex items-center border border-[#D9D9D9] rounded-full px-4 py-2 shadow-sm mt-5">
            <Input
              placeholder="Ask interprAIs"
              variant="borderless"
              className="flex-1 text-base outline-none focus:ring-0 focus:border-none border-none"
              value={prompt}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPrompt(e.target.value)
              }
              onPressEnter={() => handleSendMessage()}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<ArrowRightOutlined />}
              className="bg-gradient-to-b from-deep-blue to-[#F25325]"
              onClick={() => handleSendMessage()}
              loading={responseLoading}
              disabled={responseLoading}
            />
          </div>

          <p className="text-[12px] text-dark-gray font-normal mt-2">
            InterprAIs can make mistakes. Check important info
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsightsSection;
