import React, { useState, useRef, useEffect } from "react";
import { LoadingOutlined, SendOutlined } from "@ant-design/icons";
import AppInput from "../../../../components/AppInput";
import { Image, Spin } from "antd";
import { useFileProcessor } from "../../../../context/FileProcessorContext";


type Message = {
  text: string;
  from: "user" | "model" | "loader";
};


const GenerateInsight: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // State to track loading status
  const messageListRef = useRef<HTMLDivElement>(null);

  const { currentProject } = useFileProcessor();

  console.log(currentProject);


  const handleSendMessage = () => {
    if (input.trim()) {
      const userMessage: Message = { text: input, from: "user" };
      const loaderMessage: Message = { text: "", from: "loader" };
      setMessages((prevMessages) => [
        ...prevMessages,
        userMessage,
        loaderMessage,
      ]);
      setInput("");
      setLoading(true);


      // Simulate API call
      setTimeout(() => {
        const modelMessage: Message = { text: "Model response", from: "model" };
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.from === "loader" ? modelMessage : msg
          )
        );
        setLoading(false);
      }, 2000);
    }
  };


  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTo(0, messageListRef.current.scrollHeight);
    }
  }, [messages]);


  return (
      <div className="flex flex-col items-center mx-[11%] relative">
          <div className="text-[24px] text-black my-6">
              Analyze and generate insights from your documents with interprAIs
          </div>
          <div
              className="chat-container flex flex-col w-full overflow-y-auto"
              style={{ height: "calc(100vh - 80px)", paddingBottom: "80px" }}
              ref={messageListRef}
          >
              {messages.map((msg, index) => (
                  <div
                      key={index}
                      className={`mt-1 ${
                          msg.from === "model" || msg.from === "loader"
                              ? "flex items-center gap-6"
                              : ""
                      }`}
                  >
                      {(msg.from === "model" || msg.from === "loader") && (
                          <Image
                              src="/assets/icons/blue-circle-icon.svg"
                              preview={false}
                          />
                      )}
                      <div
                          className={`message-bubble ${
                              msg.from === "user" ? "py-2 px-4" : "py-[1px]"
                          } rounded-lg text-[14px] ${
                              msg.from === "user"
                                  ? "bg-[#f5f5f5] text-[#00000073] w-fit ml-auto text-right"
                                  : msg.from === "loader"
                                  ? "bg-transparent flex items-center"
                                  : "bg-gray-300 text-black self-start"
                          }`}
                      >
                          {msg.from === "loader" ? (
                              <Spin
                                  indicator={
                                      <LoadingOutlined
                                          style={{ fontSize: 24 }}
                                          spin
                                      />
                                  }
                              />
                          ) : (
                              msg.text
                          )}
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
  );
};


export default GenerateInsight;


