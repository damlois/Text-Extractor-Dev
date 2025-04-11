import { Spin } from "antd";
import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { usePermission } from "../apps/invoiceApp/context/PermissionContext";
import keycloakService from "../service/keycloakService";

const RouteProtector = ({
  requiredPermission,
}: {
  requiredPermission?: string;
}) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const {
    loadingUserPermissions,
    userHasPermission,
    userPermissions,
    fetchUserPermissions,
  } = usePermission();

  const hasPermission = userHasPermission(requiredPermission || "");

  useEffect(() => {
    keycloakService.initKeycloak(() => {
      const loggedIn = keycloakService.isLoggedIn();
      setIsAuthenticated(loggedIn);
      setAuthChecked(true);

      if (loggedIn && userPermissions === undefined) {
        fetchUserPermissions();
      }
    });
  }, []);

  if (!authChecked || loadingUserPermissions) {
    return (
      <div className="flex w-full mt-20 items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredPermission && !hasPermission) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default RouteProtector;
