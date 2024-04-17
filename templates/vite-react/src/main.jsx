import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { initFreelogApp } from "freelog-runtime";
const root = ReactDOM.createRoot(document.getElementById("root"));
// 👇 将渲染操作放入 mount 函数，子应用初始化时会自动执行
window.mount = () => {
  initFreelogApp();
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// 👇 将卸载操作放入 unmount 函数，就是上面步骤2中的卸载函数
window.unmount = () => {
  root.unmount();
};
