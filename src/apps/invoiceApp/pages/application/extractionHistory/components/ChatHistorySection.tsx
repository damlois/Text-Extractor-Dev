import ReactMarkdown from "react-markdown";
import { chatHistoryRecord } from "../../../../../../types";
import {
  CopyOutlined,
  ReloadOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import remarkGfm from "remark-gfm";
import { useState, ReactNode } from "react";
import type { Components } from "react-markdown";

interface MarkdownProps {
  children?: ReactNode;
  className?: string;
  inline?: boolean;
}

const ChatHistorySection = ({
  chatHistory,
  handleSendMessage,
}: {
  chatHistory: chatHistoryRecord[];
  handleSendMessage: (prompt: string) => void;
}) => {
  const [tooltipText, setTooltipText] = useState<string>("Copy to clipboard");

  const markdownComponents: Components = {
    p: ({ children, ...props }: MarkdownProps) => (
      <p className="mb-4 last:mb-0" {...props}>
        {children}
      </p>
    ),
    code: ({ inline, className, children }: MarkdownProps) => (
      <code
        className={`${className || ""} ${
          inline ? "bg-[#f5f5f5] px-1 py-0.5 rounded" : ""
        }`}
      >
        {children}
      </code>
    ),
  };

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
          <div key={index} className="mb-6">
            {/* User Message */}
            <div className="message-bubble py-4 px-6 rounded-lg text-[14px] bg-[#f5f5f5] text-[#00000073] w-fit ml-auto max-w-[75%] mb-4">
              {record.prompt}
            </div>

            {/* AI Response */}
            <div className="flex gap-4 p-4 rounded-md justify-start">
              <div className="w-6 h-6">
                <img
                  src="/assets/icons/blue-circle-icon.svg"
                  width={24}
                  height={24}
                  className="mt-1"
                  alt="InterprAIs"
                />
              </div>
              <div className="flex-1 text-left">
                <div className="message-bubble pb-2 px-4 py-4 rounded-lg text-[14px] bg-[#F8F9FC] text-black markdown-body whitespace-pre-wrap">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {record.response}
                  </ReactMarkdown>
                </div>
                <div className="flex text-deep-blue mt-2 border border-[#E4E7EC] rounded-lg overflow-hidden w-fit">
                  <ReloadOutlined
                    onClick={() => resendMessage(record.prompt)}
                    className="p-2 hover:bg-[#F8F9FC] cursor-pointer border-r border-[#E4E7EC]"
                  />
                  <Tooltip title={tooltipText}>
                    <CopyOutlined
                      onClick={() => handleCopy(record.response)}
                      className="p-2 hover:bg-[#F8F9FC] cursor-pointer border-r border-[#E4E7EC]"
                    />
                  </Tooltip>
                  <ShareAltOutlined className="p-2 hover:bg-[#F8F9FC] cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistorySection;
