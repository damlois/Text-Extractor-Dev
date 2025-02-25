import { TableColumnsType, Dropdown, Button } from "antd";
import { FaEllipsisVertical } from "react-icons/fa6";
import { UserData } from "../../../../../types";

export const usersListColumns: TableColumnsType<UserData> = [
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
