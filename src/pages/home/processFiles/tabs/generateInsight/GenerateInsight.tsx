import React, { useRef, useEffect, useState } from "react";
import {
  SendOutlined,
  ReloadOutlined,
  CopyOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AppInput from "../../../../../components/AppInput";
import { Image, Spin, Tooltip } from "antd";
import { useFileProcessor } from "../../../../../context/FileProcessorContext";
import { fileProcessorApi } from "../../../../../api/api";
import { PiUserDuotone } from "react-icons/pi";

const GenerateInsight: React.FC = () => {
  const { currentProject, chatHistory, setChatHistory } = useFileProcessor();
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [tooltipText, setTooltipText] = useState<string>("Copy to clipboard");
  const messageListRef = useRef<HTMLDivElement>(null);

  // Fetch initial chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!currentProject) return;
      try {
        const response = await fileProcessorApi.getChatHistory(
          currentProject.project_id,
          "document"
        );
        setChatHistory(response.data.data);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };

    fetchChatHistory();
  }, [currentProject, setChatHistory]);

  const handleSendMessage = async (prompt?: string) => {
    if ((!prompt?.trim() && !input.trim()) || !currentProject) return;

    setLoading(true);
    try {
      // Send message
      await fileProcessorApi.sendMessage(currentProject.project_id, {
        prompt: prompt || input,
        chat_type: "document",
        image_url: "",
        session_id: ""
      });

      // Refresh chat history
      const response = await fileProcessorApi.getChatHistory(
        currentProject.project_id,
        "document"
      );
      setChatHistory(response.data.data);
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  const resendMessage = (prompt: string) => {
    setInput(prompt);
    handleSendMessage(prompt);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);

      setTooltipText("Copied!");
      setTimeout(() => setTooltipText("Copy to clipboard"), 2000); // Reset tooltip text after 2 seconds
    } catch (err) {
      setTooltipText("Failed to copy!");
      setTimeout(() => setTooltipText("Copy to clipboard"), 2000);
    }
  };

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTo(0, messageListRef.current.scrollHeight);
    }
  }, [chatHistory]);

  return (
    <>
      {chatHistory.length === 0 ? (
        <div className="mt-[100px] mx-auto text-center md:w-7/12 sm:w-10/12">
          <h2 className="text-[24px] text-black mb-4">
            Analyze and generate insight with interprAIs
          </h2>
          <AppInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message InterprAIs"
            rightIcon={<SendOutlined />}
            onPressEnter={() => handleSendMessage()}
            loading={loading}
            className="w-full"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center mx-[10%] relative" style={{marginTop: "-24px"}}>
          <div
            className="chat-container flex flex-col w-full overflow-y-auto overflow-hidden"
            style={{
              height: "calc(100vh - 200px)",
              paddingBottom: "110px",
            }}
            ref={messageListRef}
          >
            {chatHistory.map((msg, index) => (
              <div key={index} className={`mt-1`}>
                {/* User Message */}
                <div className="message-bubble py-4 px-4 my-4 rounded-lg text-[14px] bg-[#f5f5f5] text-[#00000073] w-fit ml-auto flex gap-4 max-w-[75%]">
                  {msg.prompt}
                  <div>
                    <PiUserDuotone className="h-6 w-8" />
                  </div>
                </div>

                {/* Assistant Message */}
                <div className="flex gap-4 p-4 mt-2 rounded-md justify-start">
                  <div className="w-6 h-6">
                    <Image
                      src="/assets/icons/blue-circle-icon.svg"
                      preview={false}
                      width={24}
                      height={24}
                      className="mt-1"
                    />
                  </div>
                  <div className="message-bubble pb-2 px-1 rounded-lg text-[14px] bg-gray-300 text-black markdown-body">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, className, children, ...props }) {
                          return (
                            <code className={`${className} `} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {msg.response}
                    </ReactMarkdown>
                    <div className="flex text-deep-blue">
                      <ReloadOutlined
                        onClick={() => resendMessage(msg.prompt)}
                        className="p-2 border border-1 border-gray cursor-pointer border-r-0"
                      />
                      <Tooltip title={tooltipText}>
                        <CopyOutlined
                          onClick={() => handleCopy(msg.response)}
                          className="p-2 border border-1 border-gray cursor-pointer border-r-0"
                        />
                      </Tooltip>
                      <ShareAltOutlined className="p-2 border border-1 border-gray cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="message-input fixed bottom-[0] pb-[60px] bg-white mx-[10%]"
            style={{ width: "-webkit-fill-available" }}
          >
            <AppInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message InterprAIs"
              rightIcon={<SendOutlined />}
              onPressEnter={() => handleSendMessage()}
              loading={loading}
              className="mt-0"
            />
            <div className="flex justify-center items-center text-gray text-sm pt-[10px]">
              InterprAIs can make mistakes. Check important Info
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GenerateInsight;
