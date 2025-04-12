import { Checkbox, Col, Divider, GetProp, Modal, Row } from "antd";
import AppInput from "../../../../../components/AppInput";
import AppButton from "../../../../../components/AppButton";
import { useEffect, useState } from "react";
import { invoiceProcessorApi } from "../../../../../api/invoice-api";
import { handleError, showNotification } from "../../../../../utils/notification";
import { RoleResponse } from "../../../../../types";
import { permissionOptions } from "../data";

interface EditRoleModalProps {
  open: boolean;
  selectedRole: RoleResponse | undefined;
  onCancel: () => void;
  refreshPage: () => void;
}

const EditRoleModal = ({
  open,
  selectedRole,
  onCancel,
  refreshPage,
}: EditRoleModalProps) => {
  const [loading, setLoading] = useState(false);
  const [roleTitle, setRoleTitle] = useState<string>("");
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (selectedRole) {
      setRoleTitle(selectedRole.name);
      setPermissions(selectedRole.permissions.map((p) => p.name.trim()));
    }
  }, [selectedRole]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await invoiceProcessorApi.updateRole(String(selectedRole?.id), {
        name: roleTitle,
        permissions: permissions.map((name) => ({ name })),
      });

      showNotification("success", "Role has been edited successfully");
      onCancel();
      refreshPage();
    } catch (error: any) {
      handleError(error, 'Role')
    } finally {
      setLoading(false);
    }
  };

  const onChange: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues
  ) => {
    setPermissions(checkedValues as string[]);
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      className="app-modal"
      style={{ minWidth: "30%" }}
    >
      <div className="create-role">
        <div className="text-[20px] font-bold p-6 border-b border-0.5 border-[#cfc1c1]">
          Edit Role
        </div>
        <div className="p-6">
          <AppInput
            name="role_title"
            type="text"
            label="Role Title"
            value={roleTitle}
            placeholder="Enter a role e.g User"
            onChange={(e) => setRoleTitle(e.target.value)}
            required
          />

          <div className="mb-4 mt-10 border-t border-[#cfc1c1]"></div>

          <div className="mb-4 text-black text-[16px] font-medium">
            Permissions
          </div>
          <Checkbox.Group
            style={{ width: "100%" }}
            onChange={onChange}
            defaultValue={[...permissions]}
            key={permissions.join(",")}
          >
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
            children={"Save"}
            className="mt-[5px]"
            onClick={handleSubmit}
            loading={loading}
            disabled={roleTitle.length <= 0 || permissions.length === 0}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditRoleModal;
