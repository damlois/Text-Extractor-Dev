import { Modal } from "antd";

interface CreateRoleModalProps {
  open: boolean;
  onCancel: () => void;
  refreshPage: () => void;
}

const CreateRoleModal = ({
  open,
  onCancel,
  refreshPage,
}: CreateRoleModalProps) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      className="app-modal"
      style={{ minWidth: "30%" }}
    >
      <div>
        <div className="text-[20px] font-bold p-6 border-b border-0.5 border-[#cfc1c1]">
          Add a Role
        </div>
        <div className="p-6"></div>
      </div>
    </Modal>
  );
};

export default CreateRoleModal;
