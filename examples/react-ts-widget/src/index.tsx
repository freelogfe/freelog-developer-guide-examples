import "./public-path";

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { increment, decrement } from "./store/features/sample";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import "./index.scss";

console.log(increment, decrement);
//@ts-ignore
__webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_FREELOG__;

let root: any = null;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVit+als(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export async function bootstrap(props?: any) {
  console.log("[react18] react app bootstraped");
}
//     </React.StrictMode>,
const changeMe = ()=>{
  store.dispatch(increment(1))
}
export async function mount(props: any = {}) {
  const { container } = props;
  root =
    root ||
    ReactDOM.createRoot(
      container
        ? container.querySelector("#root")
        : document.querySelector("#root")
    );
  root.render(
    <Provider store={store}>
      <App changeMe={changeMe}/>
    </Provider>
  );
  // props.registerApi({
  //   // 这个对象会给到父插件
  //   changeMe,
  // });
}

export async function unmount(props: any) {
  const { container } = props;
  root.unmount();
}

if (!window.__POWERED_BY_FREELOG__) {
  bootstrap().then(mount);
}
