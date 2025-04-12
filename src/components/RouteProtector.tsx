import { Spin } from "antd";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { usePermission } from "../apps/invoiceApp/context/PermissionContext";

const RouteProtector = ({
  requiredPermission,
}: {
  requiredPermission?: string;
}) => {
  const {
    loadingUserPermissions,
    userHasPermission,
    userPermissions,
    fetchUserPermissions,
  } = usePermission();

  useEffect(() => {
    if (userPermissions === undefined) {
      fetchUserPermissions();
    }
  }, [userPermissions, fetchUserPermissions]);

  if (loadingUserPermissions || userPermissions === undefined) {
    return (
      <div className="flex w-full mt-20 items-center justify-center">
        <Spin size="large" />
      </div>
    );
  } else if (requiredPermission && !userHasPermission(requiredPermission)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default RouteProtector;
