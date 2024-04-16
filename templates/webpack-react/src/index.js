import "./public-path";
// eslint-disable-next-line no-undef
// __webpack_public_path__ = window.__MICRO_APP_PUBLIC_PATH__;
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initFreelogApp } from "freelog-runtime";
let root = null
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
//     </React.StrictMode>,

function mount() {
  // eslint-disable-next-line no-undef
  console.log(__webpack_public_path__)
  root = root || ReactDOM.createRoot(document.querySelector('#root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

function unmount() {
  root.unmount()
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