import { Checkbox, Col, Divider, GetProp, Modal, Row } from "antd";
import AppInput from "../../../../../components/AppInput";
import AppButton from "../../../../../components/AppButton";
import { useState } from "react";

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
  const [roleTitle, setRoleTitle] = useState<string>("");
  const [permissions, setPermissions] = useState<string[]>([]);

  const handleSubmit = () => {
    console.log(roleTitle, "title");
    console.log(permissions, "permissions");
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
      <div>
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
              <Col span={12}>
                <Checkbox value="A">Add New Data Source</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="B">View Data Source</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="C">Update Data Source</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="D">View Extraction History</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="E">Generate Insights</Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox value="E">View Saved Insights</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>

          <AppButton
            children={"Create Role"}
            className="mt-[5px]"
            onClick={handleSubmit}
            disabled={roleTitle.length <= 0 || permissions.length === 0}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CreateRoleModal;
