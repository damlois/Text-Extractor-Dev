import { ArrowLeftOutlined, SendOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import AppInput from "../../../../../../components/AppInput";
import { useFileProcessor } from "../../../../../../context/FileProcessorContext";
import { fileProcessorApi } from "../../../../../../api/api";
import { useImageProcessor } from "../../../../../../context/ImageProcessorContext";
import { generateGUID } from "../../../../../../utils";

const InitialQuery = () => {
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { currentProject } = useFileProcessor();
  const {
    setCurrentPage,
    selectedImage,
    currentSessionId,
    setCurrentSessionId,
  } = useImageProcessor();

  const sessionId = useRef<string>(generateGUID());

  useEffect(() => {
    setCurrentSessionId(sessionId.current);
  }, []);

  const handleSendMessage = async (prompt?: string) => {
    if ((!prompt?.trim() && !input.trim()) || !currentProject) return;

    setLoading(true);
    try {
      await fileProcessorApi.sendMessage(currentProject.project_id, {
        prompt: prompt || input,
        chat_type: "image",
        image_data: selectedImage?.image_path,
        image_url: selectedImage?.image_path_url,
        session_id: currentSessionId as string,
      });
      setCurrentPage("Chat");
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-[20px]">
      <div
        className="mb-[50px] text-deep-blue sm:px-[10%] md:px-[20%] cursor-pointer"
        onClick={() => setCurrentPage("ImagesDisplay")}
      >
        <ArrowLeftOutlined className="mr-1" /> Back
      </div>

      <div className="mx-auto text-center sm:w-9/12 md:w-7/12">
        <img
          src={selectedImage?.image_path_url}
          className="w-[70%] mx-auto max-h-[250px] object-contain mb-6"
        />

        <div>
          <AppInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about the image"
            rightIcon={<SendOutlined />}
            onPressEnter={() => handleSendMessage()}
            loading={loading}
            className="w-full"
          />
          <div className="flex justify-center items-center text-gray text-sm pt-[10px]">
            InterprAIs can make mistakes. Check important Info
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialQuery;
