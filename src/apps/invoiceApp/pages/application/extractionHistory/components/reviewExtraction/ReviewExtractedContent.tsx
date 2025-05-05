import { Spin } from "antd";
import { useEffect, useRef, useState } from "react";
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
import { useBlocker, useNavigate } from "react-router-dom";
import ExtractedContent from "../extractionHistory/invoicePreview/ExtractedContent";
import { ReviewStatus } from "../../types";
import ConfirmLeaveModal from "./ConfirmLeaveModal";

const ReviewExtractedContent = () => {
  const [pageLoading, setPageLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState({
    type: "save_edit",
    isLoading: false,
  });
  const [isEditState, setIsEditState] = useState(false);
  const [extractedContent, setExtractedContent] = useState<DynamicObject>();
  const [QAPassed, setQAPassed] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

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

  const blockerRef = useRef<ReturnType<typeof useBlocker> | null>(null);
  const QAPassedRef = useRef(false);

  const blocker = useBlocker(() => {
    if (!QAPassed) {
      setShowLeaveModal(true);
      return true;
    }

    return false;
  });

  useEffect(() => {
    blockerRef.current = blocker;
  }, [blocker]);

  useEffect(() => {
    if (!reviewInvoice) {
      navigate("../extraction-history");
    }

    return () => {
      console.log("lets update");
      console.log(QAPassedRef.current, "QA PAssed");
      if (!QAPassedRef.current) {
        updateReviewStatus("pending");
      } else {
        updateReviewStatus("reviewed");
      }
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!QAPassed) {
        e.preventDefault();
      }
    };

    const handleUnload = () => {
      if (!QAPassed) {
        updateReviewStatus("pending");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [QAPassed]);

  useEffect(() => {
    if (reviewInvoice) {
      if (reviewInvoice?.review_status === "reviewed") {
        setQAPassed(true);
        QAPassedRef.current = true;
      }

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

      updateReviewStatus("in_review");
      fetchInvoiceImageData();
    }
  }, [reviewInvoice]);

  const updateReviewStatus = async (status: ReviewStatus) => {
    if (reviewInvoice) {
      try {
        await invoiceProcessorApi.updateReviewStatus(reviewInvoice.id, {
          status,
        });
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleSaveChanges = async (type: string) => {
    try {
      if (!reviewInvoice) return;

      setSaveLoading({ type, isLoading: true });
      const response = await invoiceProcessorApi.editInvoiceExtraction(
        reviewInvoice.id,
        { edited_content: editedFields }
      );

      setIsEditState(false);
      setQAPassed(true);
      QAPassedRef.current = true;

      setExtractedContent(response.data.data.extracted_content);
      showNotification(
        "success",
        type === "approve_qa"
          ? "Invoice QA approved successfully"
          : "Your changes have been successfully saved"
      );
    } catch (error) {
      handleError(error);
    } finally {
      setSaveLoading({ type, isLoading: false });
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
            Review Extracted Content for {reviewInvoice?.file_name}{" "}
          </p>
          <p>
            Compare the original document with the extracted fields and make any
            necessary corrections by manually editing the fields.
          </p>
        </div>
        {!pageLoading && (
          <div className="flex gap-4 flex-wrap ml-auto">
            <AppButton
              loading={
                saveLoading.type === "approve_qa" && saveLoading.isLoading
              }
              children="Approve QA"
              variant="secondary"
              className="!w-fit"
              onClick={() => handleSaveChanges("approve_qa")}
            />

            <AppButton
              loading={
                saveLoading.type === "save_edit" && saveLoading.isLoading
              }
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
                  ? () => handleSaveChanges("save_edit")
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
            onClick={() => {
              if (isEditState) {
                setIsEditState(false);
                return;
              }

              navigate("../extraction-history", {
                state: { fromReviewPage: true },
              });
            }}
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
                  <ExtractedContent
                    extractedContent={extractedContent}
                    reviewStatus={reviewInvoice?.review_status}
                  />
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
      <ConfirmLeaveModal
        open={showLeaveModal}
        onCancel={() => {
          blockerRef.current?.reset?.();
          setShowLeaveModal(false);
        }}
        onConfirmLeave={() => {
          blockerRef.current?.proceed?.();
          setShowLeaveModal(false);
        }}
        onApproveQA={() => {
          handleSaveChanges("approve_qa");
          setShowLeaveModal(false);
        }}
      />
    </>
  );
};

export default ReviewExtractedContent;
