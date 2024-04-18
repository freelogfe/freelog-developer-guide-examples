import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { initFreelogApp } from "freelog-runtime";
const root = ReactDOM.createRoot(document.getElementById("root"));

window.mount = () => {
  initFreelogApp();
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

window.unmount = () => {
  root.unmount();
};
