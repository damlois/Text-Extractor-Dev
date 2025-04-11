import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Input, Spin } from "antd";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import PrmoptSuggestionRow from "../../../../../../../components/PromptSuggestionRow";
import { invoiceProcessorApi } from "../../../../../../../api/invoice-api";
import { ChatSession, chatHistoryRecord } from "../../../../../../../types";
import ChatHistorySection from "./ChatHistorySection";
import { handleError } from "../../../../../../../utils/notification";
import { PERMISSIONS } from "../../../../../constants";
import { usePermission } from "../../../../../context/PermissionContext";

const InsightsSection = () => {
  const [prompt, setPrompt] = useState("");
  const [responseLoading, setResponseLoading] = useState(false);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const location = useLocation();
  const { userHasPermission } = usePermission();
  const canUpdateInsights = userHasPermission(
    PERMISSIONS.UPDATE_SAVED_INSIGHTS
  );

  const selectedInvoiceIds = useMemo(
    () => location.state?.selectedInvoiceIds || [],
    [location.state?.selectedInvoiceIds]
  );

  const sessionId = useMemo(
    () => location.state?.sessionId,
    [location.state?.sessionId]
  );

  // Load existing chat session if sessionId is provided
  useEffect(() => {
    const loadExistingSession = async () => {
      if (!sessionId) return;

      setResponseLoading(true);
      try {
        const response = await invoiceProcessorApi.getChatSession(sessionId);
        setChatSession(response.data.data);
      } catch (error) {
        handleError(error);
      } finally {
        setResponseLoading(false);
      }
    };

    loadExistingSession();
  }, [sessionId]);

  const fetchSuggestedPrompts = useCallback(async () => {
    setLoadingSuggestions(true);
    try {
      const response = await invoiceProcessorApi.getSuggestedPrompts(
        selectedInvoiceIds,
        chatSession?.session_id
      );
      // Extract just the prompt text values from the prompts object
      const promptValues = Object.values(response.data.data.prompts || {});
      setSuggestedPrompts(promptValues);
    } catch (error) {
      handleError(error);
      setSuggestedPrompts([]);
    } finally {
      setLoadingSuggestions(false);
    }
  }, [selectedInvoiceIds, chatSession?.session_id]);

  // Fetch initial suggestions when component mounts
  useEffect(() => {
    if (selectedInvoiceIds.length > 0) {
      fetchSuggestedPrompts();
    }
  }, [selectedInvoiceIds, fetchSuggestedPrompts]);

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

      // Fetch new suggestions after each message
      await fetchSuggestedPrompts();
    } catch (error) {
      handleError(error);
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

      {(!sessionId || (sessionId && canUpdateInsights)) && (
        <div
          className={`${
            loadingSuggestions || suggestedPrompts.length > 0
              ? "border-t border-[#0000000F] "
              : ""
          } px-6 py-5 ${loadingSuggestions ? "mt-9" : ""}`}
        >
          {loadingSuggestions ? (
            <Spin
              spinning={loadingSuggestions}
              className="w-full mx-auto"
            ></Spin>
          ) : (
            <PrmoptSuggestionRow
              promptSuggestions={suggestedPrompts}
              setPrompt={setPrompt}
            />
          )}

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
      )}
    </div>
  );
};

export default InsightsSection;
