import { Modal } from "antd";
import AppButton from "../../../../../../components/AppButton";
import { DownloadOutlined } from "@ant-design/icons";
import { useImageProcessor } from "../../../../../../context/ImageProcessorContext";
import { downloadImageFromBlobUrl } from "../../../../../../utils";
import { ImageData } from "../../../../../../types";

interface ImageModalProps {
  isModalOpen: boolean;
  imageData: ImageData | null;
  onCancel: () => void;
}

const ImageModal = ({ isModalOpen, imageData, onCancel }: ImageModalProps) => {
  const { setCurrentPage, setSelectedImage } = useImageProcessor();
  return (
    <Modal
      open={isModalOpen}
      onCancel={onCancel}
      footer={null}
      centered
      className="image-modal"
      style={{ minWidth: "60%" }}
    >
      <div className="p-6 pt-10 border-b border-[#f0f0f0] font-inter flex flex-wrap justify-between items-center">
        <div>
          <p className="mb-1 text-dark-gray font-medium">
            Source: {imageData?.file_name}
          </p>
          <p className="text-[14px] text-gray">Page {imageData?.page_number}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <AppButton
            children={
              <div className="flex gap-2 justify-center items-center">
                <DownloadOutlined />
                JPEG
              </div>
            }
            onClick={() =>
              imageData?.image_path_url
                ? downloadImageFromBlobUrl(
                    imageData?.image_path_url,
                    `${imageData.file_name.split(".")[0]}_${
                      imageData.image_name
                    }`
                  )
                : {}
            }
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
              setCurrentPage("InitialQuery");
              setSelectedImage(imageData);
            }}
            variant="secondary"
            width="fit-content"
          />
        </div>
      </div>
      <img
        src={imageData?.image_path_url}
        alt="Preview"
        className="w-full h-auto rounded-sm p-6"
        style={{ maxHeight: "500px", objectFit: "contain" }}
      />
    </Modal>
  );
};

export default ImageModal;
