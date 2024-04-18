import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "@/routes";
import "./index.css"
import { initFreelogApp } from "freelog-runtime";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const router = createBrowserRouter([...routes.routes]);
window.mount = () => {
  initFreelogApp();
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
};

window.unmount = () => {
  root.unmount();
};
