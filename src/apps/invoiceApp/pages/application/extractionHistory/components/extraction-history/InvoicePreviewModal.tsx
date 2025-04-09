import { Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { invoiceProcessorApi } from "../../../../../../../api/invoice-api";
import { handleError } from "../../../../../../../utils/notification";
import { error } from "console";

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
  const [imageString, setImageString] = useState<string | undefined>();

  useEffect(() => {
    if (invoiceDetails) {
      const fetchInvoiceImageData = async () => {
        try {
          setLoading(true);

          const response = await invoiceProcessorApi.getInvoiceImage(
            invoiceDetails.id
          );
          setImageString(response.data.data.image_data);
        } catch {
          handleError(error)
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
      width={600}
      className="app-modal"
      style={{ top: "24px" }}
    >
      <div className="text-[20px] font-bold p-6 border-b border-0.5 border-[#cfc1c1]">
        Preview of {invoiceDetails.file_name}
      </div>
      {loading ? (
        <div className="w-full h-[80vh] flex justify-center items-center">
          <Spin></Spin>
        </div>
      ) : (
        <div className="p-6">
          {imageString && (
            <div>
              <img
                src={`data:image/jpeg;base64,${imageString}`}
                alt="Invoice Preview"
                className="w-full rounded"
              />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default InvoicePreviewModal;
