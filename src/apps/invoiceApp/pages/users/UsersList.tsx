import { useNavigate } from "react-router-dom";
import PageHeader from "../../../../components/PageHeader";
import { UserData } from "../../../../types";
import { Button, Dropdown, Table, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";

const UsersList = () => {
  const [users, setUsers] = useState<UserData[]>([]);

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
        id: "1",
        first_name: "Mary",
        last_name: "Adams",
        email_address: "maryadams@mail.com",
        role: "Admin",
        status: "Pending",
      },
    ]);
  });

  const navigate = useNavigate();

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
            items: [
              {
                key: "1",
                label: (
                  <button
                    className="w-full text-left text-[#FF4D4F]"
                    onClick={() => alert(`Deactivate ${record.first_name}`)}
                  >
                    Deactivate
                  </button>
                ),
              },
              {
                key: "2",
                label: (
                  <button
                    className="w-full text-left"
                    onClick={() => alert("Activate")}
                  >
                    Activate
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
        breadcrumbs={[{ label: "User" }]}
        pageTitle={"User"}
        action={"+ Add User"}
        onActionClick={() => navigate("/invoice-processing/data-source/create")}
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
    </>
  );
};

export default UsersList;
