import { Spin } from "antd";
import { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { usePermission } from "../context/PermissionContext";
import { handleError } from "../utils/notification";
import { ReactNode } from "react";

const RouteProtector = ({
  requiredPermission,
  children,
}: {
  requiredPermission?: string;
  children?: ReactNode;
}) => {
  const {
    loadingUserPermissions,
    userHasPermission,
    userPermissions,
    fetchUserPermissions,
  } = usePermission();

  const fetchAttempted = useRef(false);

  useEffect(() => {
    if (userPermissions === undefined && !fetchAttempted.current) {
      fetchAttempted.current = true;

      (async () => {
        try {
          await fetchUserPermissions();
        } catch (err) {
          handleError(err);
        }
      })();
    }
  }, [userPermissions, fetchUserPermissions]);

  if (loadingUserPermissions || userPermissions === undefined) {
    return (
      <div className="flex w-full mt-20 items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (requiredPermission && !userHasPermission(requiredPermission)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

export default RouteProtector;
