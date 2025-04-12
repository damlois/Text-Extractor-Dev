import PageHeader from "../../../../components/PageHeader";
import { UserResponse } from "../../../../types";
import { Button, Dropdown, Table, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import CreateUserModal from "./components/CreateUserModal";
import { FaEllipsisVertical } from "react-icons/fa6";
import UpdateStatusModal from "./components/UpdateStatusModal";
import UpdateSuccessfulModal from "./components/UpdateSuccessfulModal";
import { ModalConfig, ModalType } from "./types";
import { invoiceProcessorApi } from "../../../../api/invoice-api";
import { handleError } from "../../../../utils/notification";

const UsersList = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserResponse | undefined>();
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [modal, setModal] = useState<ModalConfig>({
    type: "create_user",
    open: false,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await invoiceProcessorApi.getUsers();
        setUsers(response.data.data);
      } catch (error: any) {
        handleError(error)
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refresh]);

  const usersListColumns: TableColumnsType<UserResponse> = [
    {
      title: "First Name",
      dataIndex: "first_name",
      render: (text: string) => (
        <span className="text-dark-gray text-[14px] font-normal">{text}</span>
      ),
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      render: (text: string) => (
        <span className="text-dark-gray text-[14px] font-normal">{text}</span>
      ),
    },
    {
      title: "Email Address",
      dataIndex: "email",
      render: (text: string) => text,
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (text: string) => (
        <span className="text-dark-gray text-[14px] font-normal">{text}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <span
          className={`${text.toLowerCase()} text-[12px] px-2 py-[2px] rounded-[100px]`}
        >
          {text.toLowerCase()}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      align: "center" as const,
      render: (_: any, record: UserResponse) => (
        <Dropdown
          menu={{
            items:
              record.status.toLowerCase() === "pending"
                ? []
                : [
                    {
                      key: "1",
                      label: (
                        <button
                          className={`w-full text-left ${
                            record.status.toLowerCase() === "active"
                              ? "text-[#FF4D4F]"
                              : "text-dark-gray"
                          }`}
                          onClick={() => handleUpdate(record)}
                        >
                          {record.status.toLowerCase() === "active"
                            ? "Deactivate"
                            : "Activate"}
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

  const toggleModal = (type: ModalType) => {
    setModal({ type, open: !modal.open });
  };

  const shouldOpenModal = (type: ModalType) =>
    modal.type === type && modal.open;

  const handleUpdate = (record: UserResponse) => {
    setSelectedUser(record);
    toggleModal("update_status");
  };

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "User" }]}
        pageTitle={"User"}
        action={"+ Add User"}
        onActionClick={() => toggleModal("create_user")}
        noBorder
      />
      <div className="overflow-x-auto py-4 px-6">
        <Table<UserResponse>
          rowKey="id"
          columns={usersListColumns}
          dataSource={users}
          className="no-vertical-lines"
          pagination={users.length > 7 ? { pageSize: 7 } : false}
          loading={loading}
        />
      </div>
      <CreateUserModal
        open={shouldOpenModal("create_user")}
        onCancel={() => toggleModal("create_user")}
        refreshPage={() => setRefresh(!refresh)}
      />
      <UpdateStatusModal
        user={selectedUser}
        open={shouldOpenModal("update_status")}
        onCancel={() => toggleModal("update_status")}
        toggleModal={toggleModal}
      />
      <UpdateSuccessfulModal
        user={selectedUser}
        open={shouldOpenModal("update_successful")}
        onCancel={() => toggleModal("update_successful")}
      />
    </>
  );
};

export default UsersList;
