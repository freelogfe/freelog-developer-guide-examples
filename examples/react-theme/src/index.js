import "./public-path";
// eslint-disable-next-line no-undef
// __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_FREELOG__;
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { freelogApp } from "freelog-runtime";



let root = null


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export async function bootstrap(props) {
  console.log('[react18] react app bootstraped');
}
//     </React.StrictMode>,

export async function mount() {
  // eslint-disable-next-line no-undef
  console.log(__webpack_public_path__)
  root = root || ReactDOM.createRoot(document.querySelector('#root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

}

export async function unmount() {
  root.unmount()
}


if (window.__POWERED_BY_WUJIE__) {
  window.__WUJIE_MOUNT = () => {
    mount();
  };
  window.__WUJIE_UNMOUNT = () => {
    unmount();
  };
} 
