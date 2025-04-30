import { Spin } from "antd";
import { useEffect, useState } from "react";
import { invoiceProcessorApi } from "../../../../../../../api/invoice-api";
import { DynamicObject, ImageDataResponse } from "../../../../../../../types";
import {
  handleError,
  showNotification,
} from "../../../../../../../utils/notification";
import OriginalDocument from "../extractionHistory/invoicePreview/OriginalDocument";
import AppButton from "../../../../../../../components/AppButton";
import { useInvoiceProcessor } from "../../../../../context/InvoiceProcessorContext";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import EditExtractedContent from "./EditExtractedContent";
import { useNavigate } from "react-router-dom";
import ExtractedContent from "../extractionHistory/invoicePreview/ExtractedContent";

const ReviewExtractedContent = () => {
  const [pageLoading, setPageLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isEditState, setIsEditState] = useState(false);
  const [extractedContent, setExtractedContent] = useState<DynamicObject>();
  const [documentPages, setDocumentPages] = useState<
    ImageDataResponse[] | undefined
  >();
  const [editedFields, setEditedFields] = useState<{
    regular: Record<string, string>;
    items: Record<number, any>;
  }>({
    regular: {},
    items: {},
  });

  const { reviewInvoice } = useInvoiceProcessor();
  const navigate = useNavigate();

  useEffect(() => {
    if (reviewInvoice) {
      setExtractedContent(reviewInvoice?.extracted_content);

      const fetchInvoiceImageData = async () => {
        try {
          setPageLoading(true);

          const response = await invoiceProcessorApi.getInvoiceImage(
            reviewInvoice.id
          );

          setDocumentPages(response.data.data.pages);
        } catch (error) {
          handleError(error);
        } finally {
          setPageLoading(false);
        }
      };

      fetchInvoiceImageData();
    }
  }, [reviewInvoice]);

  if (!reviewInvoice) {
    return null;
  }

  const handleSaveChanges = async () => {
    try {
      setSaveLoading(true);
      const response = await invoiceProcessorApi.editInvoiceExtraction(
        reviewInvoice.id,
        { edited_content: editedFields }
      );

      setExtractedContent(response.data.data.extracted_content);
      showNotification("success", "Your changes have been successfully svaed");
      setIsEditState(false);
    } catch (error) {
      handleError(error);
    } finally {
      setSaveLoading(false);
    }
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
        {!pageLoading && (
          <div className="flex gap-4 flex-wrap ml-auto">
            <AppButton
              children="Approve QA"
              variant="secondary"
              className="!w-fit"
            />

            <AppButton
              loading={saveLoading}
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
      {pageLoading ? (
        <div className="w-full h-[80vh] flex justify-center items-center">
          <Spin></Spin>
        </div>
      ) : (
        <>
          <div
            className="text-deep-blue px-[0] cursor-pointer mt-8 mb-4"
            onClick={() =>
              isEditState
                ? setIsEditState(false)
                : navigate("../extraction-history", {
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
              {extractedContent ? (
                isEditState ? (
                  <EditExtractedContent
                    extractedContent={extractedContent}
                    onEdit={setEditedFields}
                  />
                ) : (
                  <ExtractedContent extractedContent={extractedContent} />
                )
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No extracted content available to display.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ReviewExtractedContent;
