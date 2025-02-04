import { Modal } from "antd";
import { useEffect } from "react";

interface SuccessModalProps {
  open: boolean;
  onCancel: () => void;
  title: string;
  subtitle: string;
  refresh?: boolean;
}

const SuccessModal = ({
  open,
  onCancel,
  title,
  subtitle,
  refresh,
}: SuccessModalProps) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onCancel();
      }, 1000);

      refresh && window.location.reload(); // Refresh to show updates
      return () => clearTimeout(timer);
    }
  }, [open, onCancel]);
  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      className="app-modal"
      centered
      style={{ minWidth: "50%" }}
    >
      <div className="lg:h-[470px] h-auto flex justify-center items-center text-center mx-auto p-8">
        <div>
          <img src="/assets/icons/success.svg" className="pb-6 mx-auto" />
          <p className="pb-2 font-medium text-[24px]">{title}</p>
          <p className="text-[16px] font-normal">{subtitle}</p>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;
