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


window.mount = () => {
  initFreelogApp();
  mount();
};

window.unmount = () => {
  unmount();
};
