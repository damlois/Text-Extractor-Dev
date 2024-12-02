import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ConfigProvider } from "antd";
import keycloakService from "./service/keycloakService";


keycloakService.initkeycloak(() => {
  console.log("Keycloak initialized successfully");
});

const theme = {
  token: {
    colorPrimary: "#006A94",
    colorLinkHover: "#006A94",
    colorInputBorderHover: "#006A94",
  },
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ConfigProvider theme={theme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);

// keycloakService.initkeycloak(root)

// http://localhost:8180/realms/fileprocessor/protocol/openid-connect/login-status-iframe.html/init?client_id=fileextraction-web&origin=http%3A%2F%2Flocalhost%3A3000
// 