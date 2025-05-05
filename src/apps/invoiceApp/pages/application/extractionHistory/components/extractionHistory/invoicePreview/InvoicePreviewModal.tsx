import { Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { invoiceProcessorApi } from "../../../../../../../../api/invoice-api";
import { handleError } from "../../../../../../../../utils/notification";
import OriginalDocument from "./OriginalDocument";
import ExtractedConetnt from "./ExtractedContent";
import { ImageDataResponse } from "../../../../../../../../types";

interface InvoicePreviewModalProps {
  open: boolean;
  onCancel: () => void;
  invoiceDetails: any;
}

const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  open,
  onCancel,
  invoiceDetails,
}) => {
  const [loading, setLoading] = useState(false);
  const [documentPages, setDocumentPages] = useState<
    ImageDataResponse[] | undefined
  >();

  useEffect(() => {
    if (invoiceDetails) {
      const fetchInvoiceImageData = async () => {
        try {
          setLoading(true);

          const response = await invoiceProcessorApi.getInvoiceImage(
            invoiceDetails.id
          );
          setDocumentPages(response.data.data.pages);
        } catch (error) {
          handleError(error);
        } finally {
          setLoading(false);
        }
      };

      fetchInvoiceImageData();
    }
  }, [invoiceDetails?.id]);

  if (!invoiceDetails) return null;

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
        Preview of {invoiceDetails.file_name}
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
              extractedContent={invoiceDetails.extracted_content}
              reviewStatus={invoiceDetails.review_status}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default InvoicePreviewModal;
