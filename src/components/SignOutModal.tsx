import { Modal, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import keycloakService from "../service/keycloakService";

interface SignOutModalProps {
  isOpen: boolean;
  onCancel: () => void;
}

const SignOutModal = ({ isOpen, onCancel }: SignOutModalProps) => {
  const handleSignOut = () => {
    keycloakService.doLogout();
  };

  return (
    <Modal
      title={
        <div className="flex items-center text-[16px] text-dark-gray font-medium">
          <ExclamationCircleOutlined className="text-yellow-500 mr-4 text-[22px]" />
          Are you sure you want to sign out?
        </div>
      }
      open={isOpen}
      onOk={handleSignOut}
      closeIcon={false}
      width={416}
      footer={[
        <Button
          key="cancel"
          onClick={onCancel}
          className="h-[32px] px-[15px] rounded-[2px]"
        >
          Cancel
        </Button>,
        <Button
          key="signout"
          type="primary"
          danger
          onClick={handleSignOut}
          className="h-[32px] px-[15px] rounded-[2px]"
        >
          Sign Out
        </Button>,
      ]}
      centered
      styles={{
        content: { padding: "32px" },
      }}
    >
      <p className="text-dark-gray text-sm font-normal ml-[38px] mb-6">
        The user will lose all rights to the platform.
      </p>
    </Modal>
  );
};

export default SignOutModal;
