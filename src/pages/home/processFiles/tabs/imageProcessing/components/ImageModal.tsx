import { Button, Modal } from "antd";
import AppButton from "../../../../../../components/AppButton";
import { DownloadOutlined } from "@ant-design/icons";
import { PageT } from "../types";
import { useImageProcessor } from "../../../../../../context/ImageProcessorContext";

interface ImageModalProps {
  isModalOpen: boolean;
  imgSrc: string;
  onCancel: () => void;
}

const ImageModal = ({ isModalOpen, imgSrc, onCancel }: ImageModalProps) => {
  const { setCurrentPage } = useImageProcessor();
  return (
    <Modal
      open={isModalOpen}
      onCancel={onCancel}
      footer={null}
      centered
      width="60%"
      className="image-modal"
    >
      <div className="p-6 pt-10 border-b border-[#f0f0f0] font-inter flex flex-wrap justify-between items-center">
        <div>
          <p className="mb-1 text-dark-gray font-medium">
            Source: Consumer Credit
          </p>
          <p className="text-[14px] text-gray">Page 35</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <AppButton
            children={
              <div className="flex gap-2 justify-center items-center">
                <DownloadOutlined />
                JPEG
              </div>
            }
            onClick={() => {}}
            variant="secondary"
            width="fit-content"
          />
          <AppButton
            children={
              <div className="flex gap-2 justify-center items-center">
                <img src="/assets/icons/insight.svg" />
                Generate Insight
              </div>
            }
            onClick={() => {
              onCancel();
              setCurrentPage("Chat");
            }}
            variant="secondary"
            width="fit-content"
          />
        </div>
      </div>
      <img
        src={imgSrc}
        alt="Preview"
        className="w-full h-auto rounded-sm p-6"
      />
    </Modal>
  );
};

export default ImageModal;
