import PageHeader from "../../../../components/PageHeader";
import { UserData } from "../../../../types";
import { Button, Dropdown, Table, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import CreateUserModal from "./components/CreateUserModal";
import { FaEllipsisVertical } from "react-icons/fa6";
import UpdateStatusModal from "./components/UpdateStatusModal";
import UpdateSuccessfulModal from "./components/UpdateSuccessfulModal";
import { ModalConfig, ModalType } from "./types";

const UsersList = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | undefined>();
  const [modal, setModal] = useState<ModalConfig>({
    type: "create_user",
    open: false,
  });

  console.log(modal)

  useEffect(() => {
    setUsers([
      {
        id: "1",
        first_name: "John",
        last_name: "Doe",
        email_address: "johndoe@mail.com",
        role: "Admin",
        status: "Active",
      },
      {
        id: "2",
        first_name: "Mary",
        last_name: "Adams",
        email_address: "maryadams@mail.com",
        role: "Admin",
        status: "Inactive",
      },
    ]);
  }, []);

  const usersListColumns: TableColumnsType<UserData> = [
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
      dataIndex: "email_address",
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
      render: (_: any, record: UserData) => (
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

  const toggleModal = (type: ModalType) =>
    setModal({ type, open: !modal.open });

  const shouldOpenModal = (type: ModalType) =>
    modal.type === type && modal.open;

  const handleUpdate = (record: UserData) => {
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
        <Table<UserData>
          rowKey="id"
          columns={usersListColumns}
          dataSource={users}
          className="no-vertical-lines"
          pagination={users.length > 10 ? { pageSize: 10 } : false}
        />
      </div>
      <CreateUserModal
        open={shouldOpenModal("create_user")}
        onCancel={() => toggleModal("create_user")}
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
