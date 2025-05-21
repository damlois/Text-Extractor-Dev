import { Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { processorApi } from "../../../../../../api";
import { handleError } from "../../../../../../utils/notification";
import OriginalDocument from "./OriginalDocument";
import ExtractedConetnt from "./ExtractedContent";
import { ImageDataResponse } from "../../../../../../types";

interface DocumentPreviewModalProps {
  open: boolean;
  onCancel: () => void;
  documentDetails: any;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  open,
  onCancel,
  documentDetails,
}) => {
  const [loading, setLoading] = useState(false);
  const [documentPages, setDocumentPages] = useState<
    ImageDataResponse[] | undefined
  >();

  useEffect(() => {
    if (documentDetails) {
      const fetchDocumentImageData = async () => {
        try {
          setLoading(true);

          const response = await processorApi.getDocumentImage(
            documentDetails.id
          );
          setDocumentPages(response.data.data.pages);
        } catch (error) {
          handleError(error);
        } finally {
          setLoading(false);
        }
      };

      fetchDocumentImageData();
    }
  }, [documentDetails?.id]);

  if (!documentDetails) return null;

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={"80%"}
      className="app-modal"
      style={{ top: "24px" }}
    >
      <div className="text-[19px] font-bold p-6 border-b border-0.5 border-[#f0f0f0]">
        Preview of {documentDetails.file_name}
      </div>
      {loading ? (
        <div className="w-full h-[80vh] flex justify-center items-center">
          <Spin></Spin>
        </div>
      ) : (
        <div className="p-6 grid md:grid-cols-2 sm:grid-cols-1 gap-4 items-stretch">
          <div className="border border-[#F1F1F1]">
            <OriginalDocument pages={documentPages || []} />{" "}
          </div>
          <div className="border border-[#F1F1F1]">
            <ExtractedConetnt
              extractedContent={documentDetails.extracted_content}
              extractionStatus={documentDetails.processing_status}
              reviewStatus={documentDetails.review_status}
              editorName={documentDetails.editor?.full_name}
              editTime={documentDetails.editor?.updated_at}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DocumentPreviewModal;
