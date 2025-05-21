import { Modal, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { UserResponse } from "../../../types";
import { ModalType } from "../types";
import { useEffect, useState } from "react";

interface UpdateStatusModalProps {
  user: UserResponse | undefined;
  open: boolean;
  onCancel: () => void;
  toggleModal: (type: ModalType) => void;
}

const UpdateStatusModal = ({
  user,
  open,
  onCancel,
  toggleModal,
}: UpdateStatusModalProps) => {
  const [isUpdateDone, setIsUpdateDone] = useState(false);

  const userIsActive = user?.status.toLowerCase() === "active";

  const handleUpdate = () => {
    setIsUpdateDone(true);
    onCancel();
  };

  useEffect(() => {
    if (isUpdateDone) {
      toggleModal("update_successful");
      setIsUpdateDone(false);
    }
  }, [isUpdateDone]);

  return (
    <Modal
      title={
        <div className="flex items-center text-[16px] text-dark-gray font-medium">
          <ExclamationCircleOutlined className="text-yellow-500 mr-4 text-[22px]" />
          {`Are you sure you want to ${
            userIsActive ? "deactivate" : "activate"
          } user?`}
        </div>
      }
      open={open}
      onOk={handleUpdate}
      closeIcon={false}
      width={416}
      footer={[
        <Button
          key="cancel"
          onClick={onCancel}
          className="h-[32px] px-[15px] rounded-[2px]"
        >
          No
        </Button>,
        <Button
          key="signout"
          type="primary"
          onClick={handleUpdate}
          className={`h-[32px] px-[15px] rounded-[2px]`}
          style={{ backgroundColor: userIsActive ? "#FF4D4F" : "#006A94" }}
        >
          {userIsActive ? "Deactivate" : "Activate"}
        </Button>,
      ]}
      centered
      styles={{
        content: { padding: "32px" },
      }}
    >
      <p className="text-dark-gray text-sm font-normal ml-[38px] mb-6">
        {userIsActive
          ? "The user will lose all rights to the platform."
          : "The users right will be restored immediately "}
      </p>
    </Modal>
  );
};

export default UpdateStatusModal;
