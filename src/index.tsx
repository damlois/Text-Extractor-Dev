import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ConfigProvider } from "antd";
import keycloakService from "./service/keycloakService";

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

keycloakService.initKeycloak(() => {
  root.render(
    <React.StrictMode>
      <ConfigProvider theme={theme}>
        <App />
      </ConfigProvider>
    </React.StrictMode>
  );
});
