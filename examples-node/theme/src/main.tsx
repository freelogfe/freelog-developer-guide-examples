import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "@/routes";
import { StyleProvider } from "@ant-design/cssinjs";
import "./index.css";

import "antd/dist/reset.css";

// import { initFreelogApp } from "freelog-runtime";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const router = createBrowserRouter([...routes.routes]);
window.mount = () => {
  // initFreelogApp();
  root.render(
    <React.StrictMode>
      <StyleProvider hashPriority="high">
        <RouterProvider router={router} />
      </StyleProvider>
    </React.StrictMode>
  );
};

window.unmount = () => {
  root.unmount();
};

if (!window.__MICRO_APP_ENVIRONMENT__) {
  window.mount();
}
