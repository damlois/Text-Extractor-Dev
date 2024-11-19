import React, { useState, useRef, useEffect } from "react";
import { SendOutlined } from "@ant-design/icons";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AppInput from "../../../../components/AppInput";
import { Image, Spin } from "antd";
import { useFileProcessor } from "../../../../context/FileProcessorContext";
import { fileProcessorApi } from "../../../../api/api";
import { PiUserDuotone } from "react-icons/pi";

const ImageProcessing: React.FC = () => {
  const { currentProject, chatHistory, setChatHistory } = useFileProcessor();
  const [input, setInput] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch initial chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!currentProject) return;
      try {
        const response = await fileProcessorApi.getChatHistory(currentProject.id, 'image');
        setChatHistory(response.data.history);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };

    fetchChatHistory();
  }, [currentProject, setChatHistory]);

  const handleSendMessage = async () => {
    if ((!input.trim() && !image) || !currentProject) return;

    setLoading(true);
    try {
      let imageData;
      if (image) {
        // Convert image to base64
        const reader = new FileReader();
        reader.readAsDataURL(image);
        imageData = await new Promise((resolve) => {
          reader.onloadend = () => {
        const base64Image = reader.result?.toString().split(",")[1];
        resolve(base64Image);
          };
        });
      }

      // Send message with image
      await fileProcessorApi.sendMessage(currentProject.id, {
        prompt: input,
        chat_type: 'image',
        image_data: imageData?.toString()
      });

      // Refresh chat history
      const response = await fileProcessorApi.getChatHistory(currentProject.id, 'image');
      setChatHistory(response.data.history);
      setInput("");
      setImage(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  // Cleanup preview URL when component unmounts
  // useEffect(() => {
  //   return () => {
  //     if (previewUrl) {
  //       URL.revokeObjectURL(previewUrl);
  //     }
  //   };
  // }, [previewUrl]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTo(0, messageListRef.current.scrollHeight);
    }
  }, [chatHistory]);

  return (
    <>
      {chatHistory.length === 0 ? (
        <div className="mt-[100px] mx-auto text-center w-7/12">
          <h2 className="text-[24px] text-black mb-6">
            Image Analysis with InterprAIs
          </h2>
          <AppInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Upload an image and ask questions"
            rightIcon={<SendOutlined />}
            onPressEnter={handleSendMessage}
            loading={loading}
            fileUpload
            onFileChange={handleImageChange}
            className="w-full"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center mx-[10%] relative">
          {/* Image Preview Section */}
          {(previewUrl || image) && (
            <div className="w-full mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-2">Current Image</h3>
              <div className="relative w-fit mx-auto">
                <Image
                  src={previewUrl || ''}
                  alt="Preview"
                  className="max-h-[200px] object-contain rounded-lg"
                />
                <button
                  onClick={() => {
                    setImage(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Chat Container */}
          <div
            className="chat-container flex flex-col w-full overflow-y-auto"
            style={{ height: "calc(100vh - 80px)", paddingBottom: "80px" }}
            ref={messageListRef}
          >
            {chatHistory.map((msg, index) => (
              <div key={index} className="mt-1">
                {/* User Message with Image */}
                <div className="message-bubble py-4 px-4 my-4 rounded-lg text-[14px] bg-[#f5f5f5] text-[#00000073] w-fit ml-auto text-right flex gap-4 items-center flex-wrap justify-end">
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
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
              fileUpload
              onFileChange={handleImageChange}
                className="mt-0"
                maxCount={1}
                fileType="image/*"
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

export default ImageProcessing;
