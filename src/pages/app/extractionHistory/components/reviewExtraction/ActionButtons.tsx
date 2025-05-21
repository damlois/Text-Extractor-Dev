import { EditOutlined } from "@ant-design/icons";
import AppButton from "../../../../../components/AppButton";
import ApproveQAModal from "./ApproveQAModal";
import { useState } from "react";
import { Blocker } from "react-router-dom";
import { ReviewActionType } from "../../types";
import SaveChangesModal from "./SaveChangesModal";

interface ActionButtonsProps {
  saveLoading: { type: string; isLoading: boolean };
  isEditState: boolean;
  blockerRef: React.MutableRefObject<Blocker | null>;
  isQAApproved: boolean;
  showSaveChangesModal: boolean;
  setShowSaveChangesModal: (show: boolean) => void;
  setIsEditState: (isEditState: boolean) => void;
  handleSaveChanges: (type: ReviewActionType) => void;
}

const ActionButtons = ({
  saveLoading,
  isEditState,
  blockerRef,
  isQAApproved,
  showSaveChangesModal,
  setShowSaveChangesModal,
  setIsEditState,
  handleSaveChanges,
}: ActionButtonsProps) => {
  const [showApproveQAModal, setShowApproveQAModal] = useState(false);

  const saveEditLoading =
    saveLoading.type === "save_edit" && saveLoading.isLoading;

  const handleApproval = () => {
    handleSaveChanges("approve_qa");
    setShowApproveQAModal(false);
  };

  return (
    <div className="flex gap-4 flex-wrap ml-auto">
      <AppButton
        loading={saveLoading.type === "approve_qa" && saveLoading.isLoading}
        children="Approve QA"
        variant="secondary"
        className="!w-fit"
        disabled={isEditState || isQAApproved}
        onClick={() => setShowApproveQAModal(true)}
      />

      <AppButton
        children={
          <>
            {isEditState ? (
              "Save Changes"
            ) : (
              <div>
                <EditOutlined className="mr-2" /> <span>Edit Content</span>
              </div>
            )}
          </>
        }
        className="!w-fit"
        onClick={
          isEditState
            ? () => setShowSaveChangesModal(true)
            : () => setIsEditState(true)
        }
      />
      <ApproveQAModal
        open={showApproveQAModal}
        onCancel={() => {
          blockerRef.current?.reset?.();
          setShowApproveQAModal(false);
        }}
        onApproveQA={handleApproval}
      />
      <SaveChangesModal
        open={showSaveChangesModal || saveEditLoading}
        onCancel={() => {
          blockerRef.current?.reset?.();
          setShowSaveChangesModal(false);
        }}
        onSaveChanges={() => {
          handleSaveChanges("save_edit");
          setShowSaveChangesModal(false);
        }}
        laodingSave={saveEditLoading}
      />
    </div>
  );
};

export default ActionButtons;
