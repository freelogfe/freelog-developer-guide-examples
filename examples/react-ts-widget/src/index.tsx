import "./public-path";

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { increment, decrement } from "./store/features/sample";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { freelogApp } from "freelog-runtime";

import { useAppSelector, useAppDispatch } from "./store/hooks";

console.log(increment, decrement);
//@ts-ignore
__webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_FREELOG__;

let root: any = null;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export async function bootstrap(props?: any) {
  console.log("[react18] react app bootstraped");
}
//     </React.StrictMode>,
const changeMe = ()=>{
  store.dispatch(increment(1))
}
export async function mount() {
  root =
    root ||
    // @ts-ignore
    ReactDOM.createRoot(document.querySelector("#root")
    );
  root.render(
    <Provider store={store}>
      <App changeMe={changeMe}/>
    </Provider>
  );
}

export async function unmount() {
  root.unmount();
}

 
if (window.__POWERED_BY_WUJIE__) {
  window.__WUJIE_MOUNT = () => {
    mount();
  };
  window.__WUJIE_UNMOUNT = () => {
    unmount();
  };
} 
