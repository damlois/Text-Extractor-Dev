import PageHeader from "../../../../components/PageHeader";
import { RoleResponse } from "../../../../types";
import { Button, Dropdown, Table, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";
import { showNotification } from "../../../../utils/notification";
import { RoleModalConfig, RoleModalType } from "./types";
import CreateRoleModal from "./components/CreateRoleModal";

const RolesList = () => {
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [selectedRole, setSelectedRole] = useState<RoleResponse | undefined>();
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [modal, setModal] = useState<RoleModalConfig>({
    type: "create_role",
    open: false,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setRoles([
          {
            id: "1",
            title: "Admin",
            created_at: "09:00AM, 12/17/2024",
            created_by: "Lois Adex",
          },
        ]);
      } catch (e) {
        showNotification(
          "error",
          "Something went wrong. Please check your internet connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refresh]);

  const toggleModal = (type: RoleModalType) => {
    setModal({ type, open: !modal.open });
  };

  const shouldOpenModal = (type: RoleModalType) =>
    modal.type === type && modal.open;

  //   const handleUpdate = (record: RoleResponse) => {
  //     setSelectedUser(record);
  //     toggleModal("update_status");
  //   };

  const rolesListColumns: TableColumnsType<RoleResponse> = [
    {
      title: "Role Title",
      dataIndex: "title",
      render: (text: string) => (
        <span className="text-dark-gray text-[14px] font-bold">{text}</span>
      ),
    },
    {
      title: "Created On",
      dataIndex: "created_at",
      render: (text: string) => (
        <span className="text-dark-gray text-[14px] font-normal">{text}</span>
      ),
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      render: (text: string) => (
        <span className="text-dark-gray text-[14px] font-normal">{text}</span>
      ),
    },
    {
      title: "",
      key: "actions",
      align: "center" as const,
      render: (_: any, record: RoleResponse) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                label: (
                  <button
                    className="w-full text-left text-dark-gray"
                    // onClick={() => handleUpdate(record)}
                  >
                    Edit
                  </button>
                ),
              },
              {
                key: "2",
                label: (
                  <button
                    className="w-full text-left text-[#FF4D4F]"
                    // onClick={() => handleUpdate(record)}
                  >
                    Delete
                  </button>
                ),
              },
            ],
          }}
        >
          <Button
            icon={<FaEllipsisVertical className="text-black" />}
            type="link"
            className="py-2 px-3 border border-[#E4E7EC] rounded-lg"
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Role & Permission" }]}
        pageTitle={"Role & Permission"}
        action={"+ Add Role"}
        onActionClick={() => toggleModal("create_role")}
        noBorder
      />
      <div className="overflow-x-auto py-4 px-6">
        <Table<RoleResponse>
          rowKey="id"
          columns={rolesListColumns}
          dataSource={roles}
          className="no-vertical-lines"
          pagination={roles.length > 7 ? { pageSize: 7 } : false}
          loading={loading}
        />
      </div>
      <CreateRoleModal
        open={shouldOpenModal("create_role")}
        onCancel={() => toggleModal("create_role")}
        refreshPage={() => setRefresh(!refresh)}
      />
    </>
  );
};

export default RolesList;
