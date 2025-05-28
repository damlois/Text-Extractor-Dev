import { Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { processorApi } from "../../../../../api";
import { DynamicObject, ImageDataResponse } from "../../../../../types";
import {
  handleError,
  showNotification,
} from "../../../../../utils/notification";
import OriginalDocument from "../extractionHistory/documentPreview/OriginalDocument";
import { useDocumentProcessor } from "../../../../../context/DocumentProcessorContext";
import { ArrowLeftOutlined } from "@ant-design/icons";
import EditExtractedContent from "./EditExtractedContent";
import { useBlocker, useNavigate } from "react-router-dom";
import ExtractedContent from "../extractionHistory/documentPreview/ExtractedContent";
import { EditedFields, ReviewActionType, ReviewStatus } from "../../types";
import ConfirmLeaveModal from "./ConfirmLeaveModal";
import ActionButtons from "./ActionButtons";

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
  const [showSaveChangesModal, setShowSaveChangesModal] = useState(false);
  const [editedFields, setEditedFields] = useState<EditedFields | undefined>();

  const { reviewDocument } = useDocumentProcessor();
  const navigate = useNavigate();

  const blockerRef = useRef<ReturnType<typeof useBlocker> | null>(null);
  const QAPassedRef = useRef(false);

  const blocker = useBlocker(() => {
    if (!QAPassed || isEditState) {
      setShowLeaveModal(true);
      return true;
    }

    return false;
  });

  useEffect(() => {
    blockerRef.current = blocker;
  }, [blocker]);

  useEffect(() => {
    if (!reviewDocument) {
      navigate("../extraction-history");
    }

    const pageEntryTime = Date.now();

    return () => {
      const timeSpent = Date.now() - pageEntryTime;

      //update review status when user is leaving the page
      if (timeSpent > 200) {
        if (!QAPassedRef.current) {
          updateReviewStatus("pending");
        } else {
          updateReviewStatus("reviewed");
        }
      }

      blockerRef.current?.reset?.();
    };
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      if (!QAPassedRef.current) {
        updateReviewStatus("pending");
      } else {
        updateReviewStatus("reviewed");
      }
    };

    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, [QAPassed]);

  useEffect(() => {
    if (reviewDocument) {
      if (reviewDocument?.review_status === "reviewed") {
        setQAPassed(true);
        QAPassedRef.current = true;
      }

      setExtractedContent(reviewDocument?.extracted_content);

      const fetchDocumentImageData = async () => {
        try {
          setPageLoading(true);

          const response = await processorApi.getDocumentImage(
            reviewDocument.id
          );

          setDocumentPages(response.data.data.pages);
        } catch (error) {
          handleError(error);
        } finally {
          setPageLoading(false);
        }
      };

      updateReviewStatus("in_review");
      fetchDocumentImageData();
    }
  }, [reviewDocument]);

  const updateReviewStatus = async (status: ReviewStatus) => {
    if (reviewDocument) {
      try {
        await processorApi.updateReviewStatusWithFetch(
          reviewDocument.id,
          status
        );
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleSaveChanges = async (type: ReviewActionType) => {
    try {
      if (!reviewDocument) return;

      if (type === "save_edit") {
        setSaveLoading({ type, isLoading: true });

        const response = await processorApi.editDocumentExtraction(
          reviewDocument.id,
          {
            edited_content: {
              ...editedFields,
              confidence: reviewDocument.extracted_content.confidence,
              overall_confidence:
                reviewDocument.extracted_content.overall_confidence,
            },
          }
        );

        setExtractedContent(response.data.data.extracted_content);
        setIsEditState(false);
      }

      setQAPassed(true);
      QAPassedRef.current = true;

      showNotification(
        "success",
        type === "approve_qa"
          ? "Document QA approved successfully"
          : "Changes Saved Successfully"
      );
    } catch (error) {
      handleError(error, "edit-document");
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
            Review Extracted Content for {reviewDocument?.file_name}{" "}
          </p>
          <p>
            Compare the original document with the extracted fields and make any
            necessary corrections by manually editing the fields.
          </p>
        </div>
        {!pageLoading && (
          <ActionButtons
            saveLoading={saveLoading}
            isEditState={isEditState}
            blockerRef={blockerRef}
            isQAApproved={QAPassed}
            showSaveChangesModal={showSaveChangesModal}
            setShowSaveChangesModal={setShowSaveChangesModal}
            setIsEditState={setIsEditState}
            handleSaveChanges={handleSaveChanges}
          />
        )}
      </div>
      {pageLoading ? (
        <div className="w-full h-[80vh] flex justify-center items-center">
          <Spin></Spin>
        </div>
      ) : (
        <>
          <div
            className="text-deep-blue px-[0] cursor-pointer mt-8 mb-4 w-fit"
            onClick={() => {
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
                    reviewStatus={reviewDocument?.review_status}
                    editorName={reviewDocument?.editor?.full_name}
                    editTime={reviewDocument?.updated_at}
                    onEdit={setEditedFields}
                  />
                ) : (
                  <ExtractedContent
                    extractedContent={extractedContent}
                    reviewStatus={reviewDocument?.review_status}
                    extractionStatus={reviewDocument?.processing_status}
                    editorName={reviewDocument?.editor?.full_name}
                    editTime={reviewDocument?.updated_at}
                  />
                )
              ) : (
                <div className="text-center text-gray-500 p-6">
                  No extracted content available to display.
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <ConfirmLeaveModal
        open={showLeaveModal}
        isEditState={isEditState}
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
        onSaveChanges={() => {
          setShowLeaveModal(false);
          setShowSaveChangesModal(true);
        }}
      />
    </>
  );
};

export default ReviewExtractedContent;
