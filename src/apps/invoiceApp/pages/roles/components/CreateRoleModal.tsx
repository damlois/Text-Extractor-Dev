import { Checkbox, Col, GetProp, Modal, Row } from "antd";
import AppInput from "../../../../../components/AppInput";
import AppButton from "../../../../../components/AppButton";
import { useState } from "react";
import { invoiceProcessorApi } from "../../../../../api/invoice-api";
import {
  handleError,
  showNotification,
} from "../../../../../utils/notification";
import { usePermission } from "../../../context/PermissionContext";

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
  const [loading, setLoading] = useState(false);
  const [roleTitle, setRoleTitle] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const { permissionOptions } = usePermission();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await invoiceProcessorApi.addRole({
        name: roleTitle.toUpperCase(),
        permissions: selectedPermissions.map((name) => ({ name })),
      });

      showNotification("success", "Role has been created successfully");
      onCancel();
      refreshPage();
    } catch (error: any) {
      handleError(error, "Role");
    } finally {
      setLoading(false);
    }
  };

  const onChange: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues
  ) => {
    setSelectedPermissions(checkedValues as string[]);
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      className="app-modal"
      style={{ minWidth: "45%" }}
    >
      <div className="create-role">
        <div className="text-[20px] font-bold p-6 border-b border-0.5 border-[#cfc1c1]">
          Add a Role
        </div>
        <div className="p-6">
          <AppInput
            name="role_title"
            type="text"
            label="Role Title"
            placeholder="Enter a role e.g User"
            onChange={(e) => setRoleTitle(e.target.value)}
            required
          />

          <div className="mb-4 mt-10 border-t border-[#cfc1c1]"></div>

          <div className="mb-4 text-black text-[16px] font-medium">
            Permissions
          </div>
          <Checkbox.Group style={{ width: "100%" }} onChange={onChange}>
            <Row>
              {permissionOptions.map((option) => {
                return (
                  <Col span={12} key={option}>
                    <Checkbox value={option}>{option}</Checkbox>
                  </Col>
                );
              })}
            </Row>
          </Checkbox.Group>

          <AppButton
            children={"Create Role"}
            className="mt-[5px]"
            onClick={handleSubmit}
            loading={loading}
            disabled={roleTitle.length <= 0 || selectedPermissions.length === 0}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CreateRoleModal;
