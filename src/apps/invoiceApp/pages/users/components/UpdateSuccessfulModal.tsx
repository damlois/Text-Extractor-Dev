import { Modal, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { UserResponse } from "../../../../../types";

interface UpdateSuccessfulModalProps {
  user: UserResponse | undefined;
  open: boolean;
  onCancel: () => void;
}

const UpdateSuccessfulModal = ({
  user,
  open,
  onCancel,
}: UpdateSuccessfulModalProps) => {
  const userIsActive = user?.status.toLowerCase() === "active";

  return (
    <Modal
      title={
        <div className="flex items-center text-[16px] text-dark-gray font-medium">
          <CheckCircleOutlined className="text-[#52C41A] mr-4 text-[22px]" />
          {`User has been ${userIsActive ? "deactivated" : "activated"}`}
        </div>
      }
      open={open}
      onOk={onCancel}
      closeIcon={false}
      width={416}
      footer={[
        <Button
          key="done"
          type="primary"
          onClick={onCancel}
          className="h-[32px] px-[15px] rounded-[2px]"
          style={{ backgroundColor: "#006A94" }}
        >
          Done
        </Button>,
      ]}
      centered
      styles={{
        content: { padding: "32px" },
      }}
    >
      <p className="text-dark-gray text-sm font-normal ml-[38px] mb-6">
        See more users
      </p>
    </Modal>
  );
};

export default UpdateSuccessfulModal;
