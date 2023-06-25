import "./public-path";
// eslint-disable-next-line no-undef
// __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_FREELOG__;
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';



let root = null


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export async function bootstrap(props) {
  console.log('[react18] react app bootstraped');
}
//     </React.StrictMode>,

export async function mount(props = {}) {
  const { container } = props;
  // eslint-disable-next-line no-undef
  console.log(__webpack_public_path__)
  root = root || ReactDOM.createRoot(container ? container.querySelector('#root') : document.querySelector('#root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  props.registerApi({
    // 这个对象会给到父插件
  })
}

export async function unmount(props) {
  // const { container } = props;
  root.unmount()
}

if (!window.__POWERED_BY_FREELOG__) {
  bootstrap().then(mount);
}
