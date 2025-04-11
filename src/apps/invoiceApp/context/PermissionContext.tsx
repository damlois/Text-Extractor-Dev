import { createContext, ReactNode, useContext, useState } from "react";
import { invoiceProcessorApi } from "../../../api/invoice-api";
import { handleError } from "../../../utils/notification";

interface PermissionContextProps {
  permissionOptions: string[];
  loadingPermissionOptions: boolean;
  userPermissions: string[] | undefined;
  loadingUserPermissions: boolean;
  setUserPermissions: (permissions: string[] | undefined) => void;
  fetchPermissionOptions: () => Promise<void>;
  fetchUserPermissions: () => Promise<void>;
  userHasPermission: (permission: string) => boolean;
}

const PermissionContext = createContext<PermissionContextProps | undefined>(
  undefined
);

export const PermissionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userPermissions, setUserPermissions] = useState<
    string[] | undefined
  >();
  const [permissionOptions, setPermissionOptions] = useState<string[]>([]);
  const [loadingPermissionOptions, setLoadingPermissionOptions] =
    useState(false);
  const [loadingUserPermissions, setLoadingUserPermissions] = useState(false);

  const fetchUserPermissions = async () => {
    try {
      setLoadingUserPermissions(true);
      const response = await invoiceProcessorApi.getUserPermissions();
      setUserPermissions(response.data.data.permissions);
    } catch (error) {
      handleError(error);
    } finally {
      setLoadingUserPermissions(false);
    }
  };

  const fetchPermissionOptions = async () => {
    try {
      setLoadingPermissionOptions(true);
      const response = await invoiceProcessorApi.getAllPermissions();

      setPermissionOptions(
        response.data.data.permissions.flatMap((item) =>
          item.permissions.map((data) => data.name)
        )
      );
    } catch (error) {
      handleError(error);
    } finally {
      setLoadingPermissionOptions(false);
    }
  };

  const userHasPermission = (permission: string) => {
    return (userPermissions || []).includes(permission);
  };

  return (
    <PermissionContext.Provider
      value={{
        permissionOptions,
        loadingPermissionOptions,
        userPermissions,
        loadingUserPermissions,
        setUserPermissions,
        fetchPermissionOptions,
        fetchUserPermissions,
        userHasPermission,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermission must be used within a PermissionProvider");
  }
  return context;
};
