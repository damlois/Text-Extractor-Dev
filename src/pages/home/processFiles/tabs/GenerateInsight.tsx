import React, { useRef, useEffect, useState } from "react";
import { SendOutlined } from "@ant-design/icons";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AppInput from "../../../../components/AppInput";
import { Image, Spin } from "antd";
import { useFileProcessor } from "../../../../context/FileProcessorContext";
import { fileProcessorApi } from "../../../../api/api";
import { PiUserDuotone } from "react-icons/pi";


const GenerateInsight: React.FC = () => {
  const { currentProject, chatHistory, setChatHistory } = useFileProcessor();
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  // Fetch initial chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!currentProject) return;
      try {
        const response = await fileProcessorApi.getChatHistory(currentProject.id, 'document');
        setChatHistory(response.data.history);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };

    fetchChatHistory();
  }, [currentProject, setChatHistory]);

  const handleSendMessage = async () => {
    if (!input.trim() || !currentProject) return;

    setLoading(true);
    try {
      // Send message
      await fileProcessorApi.sendMessage(currentProject.id, {
        prompt: input,
        chat_type: 'document'
      });

      // Refresh chat history
      const response = await fileProcessorApi.getChatHistory(currentProject.id, 'document');
      setChatHistory(response.data.history);
      setInput("");
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
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
              <div className="mt-[100px] mx-auto text-center w-7/12">
                  <h2 className="text-[24px] text-black mb-[-16px]">
                      Analyze and generate insight with interprAIs
                  </h2>
                  <AppInput
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Message InterprAIs"
                      rightIcon={<SendOutlined />}
                      onPressEnter={handleSendMessage}
                      loading={loading}
                      className="w-full"
                  />
              </div>
          ) : (
              <div className="flex flex-col items-center mx-[10%] relative">
                  <div
                      className="chat-container flex flex-col w-full overflow-y-auto"
                      style={{
                          height: "calc(100vh - 80px)",
                          paddingBottom: "80px",
                      }}
                      ref={messageListRef}
                  >
                      {chatHistory.map((msg, index) => (
                          <div key={index} className={`mt-1`}>
                              {/* User Message */}
                              <div className="message-bubble py-4 px-4 my-4 rounded-lg text-[14px] bg-[#f5f5f5] text-[#00000073] w-fit ml-auto text-right flex gap-4 items-center">
                                  {msg.prompt}
                                  <PiUserDuotone className="h-6 w-8" />
                              </div>

                              {/* Assistant Message */}
                              <div className="flex gap-4 p-4 mt-2 bg-[#f5f5f554] rounded-md">
                                  <Image
                                      src="/assets/icons/blue-circle-icon.svg"
                                      preview={false}
                                      width={36}
                                  />
                                  <div className="message-bubble py-2 px-1 rounded-lg text-[14px] bg-gray-300 text-black self-start markdown-body">
                                      <ReactMarkdown
                                          remarkPlugins={[remarkGfm]}
                                          components={{
                                              code({
                                                  node,
                                                  className,
                                                  children,
                                                  ...props
                                              }) {
                                                  return (
                                                      <code
                                                          className={`${className} `}
                                                          {...props}
                                                      >
                                                          {children}
                                                      </code>
                                                  );
                                              },
                                          }}
                                      >
                                          {msg.response}
                                      </ReactMarkdown>
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
                          onPressEnter={handleSendMessage}
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
