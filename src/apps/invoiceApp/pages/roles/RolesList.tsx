import PageHeader from "../../../../components/PageHeader";
import { RoleResponse } from "../../../../types";
import { Button, Dropdown, Table, TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";
import { handleError } from "../../../../utils/notification";
import { RoleModalConfig, RoleModalType } from "./types";
import CreateRoleModal from "./components/CreateRoleModal";
import { invoiceProcessorApi } from "../../../../api/invoice-api";
import EditRoleModal from "./components/EditRoleModal";
import { usePermission } from "../../context/PermissionContext";
import { PERMISSIONS } from "../../constants/permissions";

const RolesList = () => {
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [selectedRole, setSelectedRole] = useState<RoleResponse | undefined>();
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [modal, setModal] = useState<RoleModalConfig>({
    type: "create_role",
    open: false,
  });

  const {
    fetchPermissionOptions,
    loadingPermissionOptions,
    userHasPermission,
  } = usePermission();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true);
        const response = await invoiceProcessorApi.getRoles();
        setRoles(response.data.data);
      } catch (error) {
        handleError(error);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
    fetchPermissionOptions();
  }, [refresh]);

  const toggleModal = (type: RoleModalType) => {
    setModal({ type, open: !modal.open });
  };

  const shouldOpenModal = (type: RoleModalType) =>
    modal.type === type && modal.open;

  const handleUpdate = (record: RoleResponse) => {
    setSelectedRole(record);
    toggleModal("edit_role");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    return formatter.format(date);
  };

  const rolesListColumns: TableColumnsType<RoleResponse> = [
    {
      title: "Role Title",
      dataIndex: "name",
      render: (text: string) => (
        <span className="text-dark-gray text-[14px] font-bold">{text}</span>
      ),
    },
    {
      title: "Created On",
      dataIndex: "created_at",
      render: (text: string) => (
        <span className="text-dark-gray text-[14px] font-normal">
          {formatDate(text)}
        </span>
      ),
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      render: (text: string) => (
        <span className="text-dark-gray text-[14px] font-normal">{text}</span>
      ),
    },
    ...(userHasPermission(PERMISSIONS.EDIT_ROLE)
      ? [
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
                          onClick={() => handleUpdate(record)}
                        >
                          Edit
                        </button>
                      ),
                    },
                    {
                      key: "2",
                      label: (
                        <button className="w-full text-left text-[#FF4D4F]">
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
        ]
      : []),
  ];

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Role & Permission" }]}
        pageTitle={"Role & Permission"}
        action={
          userHasPermission(PERMISSIONS.ADD_ROLE) ? "+ Add Role" : undefined
        }
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
          loading={loadingRoles || loadingPermissionOptions}
        />
      </div>
      <CreateRoleModal
        open={shouldOpenModal("create_role")}
        onCancel={() => toggleModal("create_role")}
        refreshPage={() => setRefresh(!refresh)}
      />
      <EditRoleModal
        open={shouldOpenModal("edit_role")}
        onCancel={() => toggleModal("edit_role")}
        refreshPage={() => setRefresh(!refresh)}
        selectedRole={selectedRole}
      />
    </>
  );
};

export default RolesList;
