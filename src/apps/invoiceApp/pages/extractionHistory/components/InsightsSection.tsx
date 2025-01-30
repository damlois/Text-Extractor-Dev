import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useState } from "react";
import { useLocation } from "react-router-dom";
// import PrmoptSuggestionRow from "../../../../../components/PromptSuggestionRow";
import ChatHistorySection from "./ChatHistorySection";
import { invoiceProcessorApi } from "../../../../../api/invoice-api";
import { ChatSession, chatHistoryRecord } from "../../../../../types";

const InsightsSection = () => {
  const [prompt, setPrompt] = useState("");
  const [responseLoading, setResponseLoading] = useState(false);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const location = useLocation();
  const selectedInvoiceIds = location.state?.selectedInvoiceIds || [];

  // const suggestions = [
  //   "What's the difference in payment terms across invoices?",
  //   "How do currency and exchange rates differ between invoices?",
  //   "How do discounts vary across invoices?",
  // ];

  const mapMessagesToHistory = (session: ChatSession): chatHistoryRecord[] => {
    return session.messages.map((msg) => ({
      prompt: msg.prompt,
      response: msg.response,
      session_id: session.session_id,
      type: "chat",
      timestamp: msg.created_at,
    }));
  };

  const handleSendMessage = async (query?: string) => {
    const messageText = query?.trim() || prompt?.trim();
    if (!messageText) return;

    setResponseLoading(true);
    try {
      const response = await invoiceProcessorApi.chatWithInvoices({
        session_id: chatSession?.session_id,
        invoice_ids: selectedInvoiceIds,
        prompt: messageText,
      });

      setChatSession(response.data.data);
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
        chatHistory={chatSession ? mapMessagesToHistory(chatSession) : []}
        handleSendMessage={handleSendMessage}
      />

      <div className="border-t border-[#0000000F] px-6 py-5">
        {/* <PrmoptSuggestionRow
          promptSuggestions={suggestions}
          setPrompt={setPrompt}
        /> */}

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
              disabled={selectedInvoiceIds.length === 0}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<ArrowRightOutlined />}
              className="bg-gradient-to-b from-deep-blue to-[#F25325]"
              onClick={() => handleSendMessage()}
              loading={responseLoading}
              disabled={responseLoading || selectedInvoiceIds.length === 0}
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
