import "./public-path";

import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { increment, decrement } from "./store/features/sample";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { initFreelogApp } from "freelog-runtime";

console.log(increment, decrement);
//@ts-ignore
__webpack_public_path__ = window.__MICRO_APP_PUBLIC_PATH__;

let root: any = null;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

const changeMe = () => {
  store.dispatch(increment(1));
};
root = ReactDOM.createRoot(document.querySelector("#root") as any);
function mount() {
  root.render(
    <Provider store={store}>
      <App changeMe={changeMe} />
    </Provider>
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
