import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeftOutlined,
  CopyOutlined,
  ReloadOutlined,
  SendOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AppInput from "../../../../../../components/AppInput";
import { Image, Spin, Tooltip } from "antd";
import { useFileProcessor } from "../../../../../../context/FileProcessorContext";
import { fileProcessorApi } from "../../../../../../api/api";
import { PiUserDuotone } from "react-icons/pi";
import { useImageProcessor } from "../../../../../../context/ImageProcessorContext";

const ImagesChat: React.FC = () => {
  const { currentProject, chatHistory, setChatHistory } = useFileProcessor();
  const [input, setInput] = useState<string>("");
  const [pageLoading, setPageLoading] = useState(false);
  const [responseLoading, setResponseLoading] = useState<boolean>(false);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [tooltipText, setTooltipText] = useState<string>("Copy to clipboard");

  const { selectedImage, currentSessionId, setCurrentPage } =
    useImageProcessor();

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!currentProject) return;
      try {
        setPageLoading(true);
        const response = await fileProcessorApi.getChatHistory(
          currentProject.project_id,
          "image"
        );
        setChatHistory(response.data.data);
        setPageLoading(false);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };

    fetchChatHistory();
  }, []);

  const handleSendMessage = async (prompt?: string) => {
    if ((!prompt?.trim() && !input.trim()) || !currentProject) return;

    setResponseLoading(true);
    try {
      await fileProcessorApi.sendMessage(currentProject.project_id, {
        prompt: prompt || input,
        chat_type: "image",
        image_data: selectedImage?.image_path,
        image_url: selectedImage?.image_path_url,
        session_id: currentSessionId as string,
      });

      const response = await fileProcessorApi.getChatHistory(
        currentProject.project_id,
        "image"
      );
      setChatHistory(response.data.data);
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setResponseLoading(false);
    }
  };

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTo(0, messageListRef.current.scrollHeight);
    }
  }, [chatHistory]);

  const resendMessage = (prompt: string) => {
    setInput(prompt);
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
    <>
      {!pageLoading ? (
        <>
          <div
            className="flex flex-col items-center mx-[10%] relative"
            style={{ marginTop: "-24px" }}
          >
            <div
              className="chat-container flex flex-col w-full overflow-y-auto overflow-hidden"
              style={{
                height: "calc(100vh - 200px)",
                paddingBottom: "150px",
              }}
              ref={messageListRef}
            >
              {chatHistory?.map((msg, index) => {
                const isFirstMessageOfSession =
                  index === 0 ||
                  msg.session_id !== chatHistory[index - 1]?.session_id;
                return (
                  <div key={index} className="mt-1">
                    {/* User Message with Image */}
                    <div>
                      {isFirstMessageOfSession && (
                        <div className="w-full flex justify-end">
                          <Image
                            src={msg.image_url}
                            className="max-h-[250px] object-contain"
                            preview
                          />
                        </div>
                      )}
                      <div className="message-bubble py-4 px-4 my-4 rounded-lg text-[14px] bg-[#f5f5f5] text-[#00000073] w-fit ml-auto text-right flex gap-4 items-center flex-wrap justify-end">
                        {msg.prompt}
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
                );
              })}
            </div>

            <div
              className="message-input fixed bottom-[0] pb-[60px] bg-white mx-[10%]"
              style={{ width: "-webkit-fill-available" }}
            >
              <AppInput
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Generate insight from image"
                rightIcon={<SendOutlined />}
                onPressEnter={() => handleSendMessage()}
                loading={responseLoading}
                className="mt-0"
                maxCount={1}
                fileType="image/*"
              />
              <div className="flex justify-center items-center text-gray text-sm pt-[10px] gap-x-16 gap-y-4 flex-wrap-reverse">
                <div
                  className="text-deep-blue cursor-pointer sm:none w-max top-4"
                  onClick={() => setCurrentPage("ImagesDisplay")}
                >
                  <ArrowLeftOutlined className="mr-1" /> Return to Images
                </div>
                <p>InterprAIs can make mistakes. Check important Info</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full flex justify-center">
          <Spin size="large" className="mt-[80px]"></Spin>
        </div>
      )}
    </>
  );
};

export default ImagesChat;
