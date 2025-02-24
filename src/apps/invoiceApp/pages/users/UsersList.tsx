import PageHeader from "../../../../components/PageHeader";
import { UserData } from "../../../../types";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { usersListColumns } from "./data";
import CreateUserModal from "./components/CreateUserModal";

const UsersList = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [showModal, setShowModal] = useState(false);

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
        status: "Pending",
      },
    ]);
  }, []);

  const toggleModal = () => setShowModal(!showModal);

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "User" }]}
        pageTitle={"User"}
        action={"+ Add User"}
        onActionClick={toggleModal}
        noBorder
      />
      <div className="overflow-x-auto p-4">
        <Table<UserData>
          rowKey="id"
          columns={usersListColumns}
          dataSource={users}
          className="no-vertical-lines"
          pagination={users.length > 10 ? { pageSize: 10 } : false}
        />
      </div>
      <CreateUserModal open={showModal} onCancel={toggleModal} />
    </>
  );
};

export default UsersList;
