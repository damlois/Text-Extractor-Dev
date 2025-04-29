import { Spin } from "antd";
import { useEffect, useState } from "react";
import { invoiceProcessorApi } from "../../../../../../../api/invoice-api";
import { ImageDataResponse } from "../../../../../../../types";
import { handleError } from "../../../../../../../utils/notification";
import OriginalDocument from "../extractionHistory/invoicePreview/OriginalDocument";
import AppButton from "../../../../../../../components/AppButton";
import { useInvoiceProcessor } from "../../../../../context/InvoiceProcessorContext";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import EditExtractedContent from "./EditExtractedContent";
import { useNavigate } from "react-router-dom";
import ExtractedContent from "../extractionHistory/invoicePreview/ExtractedContent";

const ReviewExtractedContent = () => {
  const [loading, setLoading] = useState(false);
  const [isEditState, setIsEditState] = useState(false);
  const [documentPages, setDocumentPages] = useState<
    ImageDataResponse[] | undefined
  >();

  const { reviewInvoice } = useInvoiceProcessor();
  const navigate = useNavigate();

  useEffect(() => {
    if (reviewInvoice) {
      const fetchInvoiceImageData = async () => {
        try {
          setLoading(true);

          const response = await invoiceProcessorApi.getInvoiceImage(
            reviewInvoice.id
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
  }, [reviewInvoice?.id]);

  if (!reviewInvoice) return null;

  const handleSaveChanges = () => {
    console.log("save changes");
  };

  return (
    <>
      <div
        className="flex flex-wrap mb-5 justify-between  items-center gap-5 border-[#f0f0f0] border-b"
        style={{
          margin: "-20px -24px 0",
          padding: "0 24px 12px",
        }}
      >
        <div className="flex flex-col gap-1">
          <p className="font-medium text-[16px]">
            Review Extracted Content for {reviewInvoice.file_name}{" "}
          </p>
          <p>
            Compare the original document with the extracted fields and make any
            necessary corrections by manually editing the fields.
          </p>
        </div>
        {!loading && (
          <div className="flex gap-4 flex-wrap ml-auto">
            <AppButton
              children="Approve QA"
              variant="secondary"
              className="!w-fit"
            />

            <AppButton
              children={
                <>
                  {isEditState ? (
                    "Save Changes"
                  ) : (
                    <div>
                      <EditOutlined className="mr-2" />{" "}
                      <span>Edit Content</span>
                    </div>
                  )}
                </>
              }
              className="!w-fit"
              onClick={
                isEditState
                  ? () => handleSaveChanges()
                  : () => setIsEditState(true)
              }
            />
          </div>
        )}
      </div>
      {loading ? (
        <div className="w-full h-[80vh] flex justify-center items-center">
          <Spin></Spin>
        </div>
      ) : (
        <>
          <div
            className="text-deep-blue px-[0] cursor-pointer mt-8 mb-4"
            onClick={() =>
              navigate("../extraction-history", {
                state: { fromDuplicatesPage: true },
              })
            }
          >
            <ArrowLeftOutlined className="mr-6" /> Back
          </div>
          <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 items-stretch">
            <div className="border border-[#F1F1F1]">
              <OriginalDocument pages={documentPages || []} />{" "}
            </div>
            <div className="border border-[#F1F1F1]">
              {isEditState ? (
                <EditExtractedContent
                  extractedContent={reviewInvoice.extracted_content}
                />
              ) : (
                <ExtractedContent
                  extractedContent={reviewInvoice.extracted_content}
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ReviewExtractedContent;
