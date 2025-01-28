import ReactMarkdown from "react-markdown";
import { chatHistoryRecord, Message } from "../../../../../types";
import {
  CopyOutlined,
  ReloadOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import remarkGfm from "remark-gfm";
import { useState } from "react";

const ChatHistorySection = ({
  chatHistory,
  handleSendMessage,
}: {
  chatHistory: chatHistoryRecord[];
  handleSendMessage: (prompt: string) => void;
}) => {
  const [tooltipText, setTooltipText] = useState<string>("Copy to clipboard");

  const resendMessage = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);

      setTooltipText("Copied!");
      setTimeout(() => setTooltipText("Copy to clipboard"), 2000);
    } catch (err) {
      setTooltipText("Failed to copy!");
      setTimeout(() => setTooltipText("Copy to clipboard"), 2000);
    }
  };
  return (
    <div className="w-full text-center">
      <div className="space-y-4">
        {chatHistory.map((record, index) => (
          <div key={index}>
            {record.prompt ? (
              <div className="message-bubble py-4 px-4 rounded-lg text-[14px] bg-[#f5f5f5] text-[#00000073] w-fit ml-auto max-w-[75%]">
                {record.prompt}
              </div>
            ) : (
              <div className="flex gap-4 p-4 mt-2 rounded-md justify-start">
                <div className="w-6 h-6">
                  <img
                    src="/assets/icons/blue-circle-icon.svg"
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
                    {record.response}
                  </ReactMarkdown>
                  <div className="flex text-deep-blue">
                    <ReloadOutlined
                      onClick={() => resendMessage(record.prompt)}
                      className="p-2 border border-1 border-gray cursor-pointer border-r-0"
                    />
                    <Tooltip title={tooltipText}>
                      <CopyOutlined
                        onClick={() => handleCopy(record.response)}
                        className="p-2 border border-1 border-gray cursor-pointer border-r-0"
                      />
                    </Tooltip>
                    <ShareAltOutlined className="p-2 border border-1 border-gray cursor-pointer" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistorySection;
