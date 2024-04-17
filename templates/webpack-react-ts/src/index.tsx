import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { initFreelogApp } from "freelog-runtime";
let root: any = null;
function mount() {
  root =
    root || ReactDOM.createRoot(document.querySelector("#root") as HTMLElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

function unmount() {
  root.unmount();
}

// 👇 将渲染操作放入 mount 函数，子应用初始化时会自动执行
window.mount = () => {
  initFreelogApp();
  mount();
};

// 👇 将卸载操作放入 unmount 函数，就是上面步骤2中的卸载函数
window.unmount = () => {
  unmount();
};
