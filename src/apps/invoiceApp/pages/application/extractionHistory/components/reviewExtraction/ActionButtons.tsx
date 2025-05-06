import { EditOutlined } from "@ant-design/icons";
import AppButton from "../../../../../../../components/AppButton";
import ApproveQAModal from "./ApproveQAModal";
import { useState } from "react";
import { Blocker } from "react-router-dom";
import { ReviewActionType } from "../../types";

interface ActionButtonsProps {
  saveLoading: { type: string; isLoading: boolean };
  isEditState: boolean;
  blockerRef: React.MutableRefObject<Blocker | null>;
  setIsEditState: (isEditState: boolean) => void;
  handleSaveChanges: (type: ReviewActionType) => void;
}

const ActionButtons = ({
  saveLoading,
  isEditState,
  blockerRef,
  setIsEditState,
  handleSaveChanges,
}: ActionButtonsProps) => {
  const [showApproveQAModal, setShowApproveQAModal] = useState(false);

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
        onClick={() => setShowApproveQAModal(true)}
      />

      <AppButton
        loading={saveLoading.type === "save_edit" && saveLoading.isLoading}
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
            ? () => handleSaveChanges("save_edit")
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
    </div>
  );
};

export default ActionButtons;
