import { Button, Modal } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { processorApi } from "../../../../../api";
import {
  handleError,
  showNotification,
} from "../../../../../utils/notification";
import { useState } from "react";
import { useDocumentProcessor } from "../../../../../context/DocumentProcessorContext";

interface ArchiveDuplicatesModalProps {
  open?: boolean;
  onCancel: () => void;
  selectedDocumentIds: Record<string, string[]>;
  pageRefresh: () => void;
  selectedCount: number;
}

const ArchiveDuplicatesModal = ({
  open,
  onCancel,
  selectedDocumentIds,
  pageRefresh,
  selectedCount,
}: ArchiveDuplicatesModalProps) => {
  const [loading, setLoading] = useState(false);
  const { duplicateMapByFileHash } = useDocumentProcessor();

  const selectedIds = Object.values(selectedDocumentIds).flat();

  const selectedDocs: any[] = [];
  Object.values(duplicateMapByFileHash).forEach(({ documents }) => {
    documents.forEach((doc) => {
      if (selectedIds.includes(doc.id)) {
        selectedDocs.push(doc);
      }
    });
  });

  const hasQAPassed = selectedDocs.some(
    (doc) => doc.review_status === "reviewed"
  );

  const handleArchive = async () => {
    try {
      setLoading(true);
      await processorApi.updateDocumentStatus("archive", selectedIds);

      onCancel();
      pageRefresh();
      showNotification(
        "success",
        selectedCount > 1
          ? "Selected documents have been successfully archived"
          : "Selected document has been successfully archived"
      );
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center text-[16px] text-dark-gray font-medium">
          <InfoCircleOutlined className="text-deep-blue mr-4 text-[22px]" />
          {hasQAPassed
            ? "QA Passed document present"
            : `Are you sure you want to archive selected duplicate document${
                selectedCount > 1 ? "s" : ""
              }?`}
        </div>
      }
      open={open}
      closable={false}
      footer={[
        <Button
          key="cancel"
          onClick={onCancel}
          className="h-[32px] px-[15px] rounded-[2px]"
        >
          Cancel
        </Button>,
        <Button
          key="archive"
          type="primary"
          className="h-[32px] px-[15px] rounded-[2px]"
          onClick={handleArchive}
          loading={loading}
        >
          Yes, Archive
        </Button>,
      ]}
      width={471}
      centered
      styles={{
        content: { padding: "16px", borderRadius: "2px" },
      }}
    >
      {hasQAPassed ? (
        <p className="text-dark-gray text-sm font-normal ml-[38px] mb-6">
          QA Passed document present. This action will move a QA passed document
          to archive. Do you want to proceed?
        </p>
      ) : selectedCount > 1 ? (
        <p className="text-dark-gray text-sm font-normal ml-[38px] mb-6">
          This action will move the selected duplicate documents to the archive.
        </p>
      ) : (
        <p className="text-dark-gray text-sm font-normal ml-[38px] mb-6">
          This action will move the selected duplicate document to the archive.
        </p>
      )}
    </Modal>
  );
};

export default ArchiveDuplicatesModal;
