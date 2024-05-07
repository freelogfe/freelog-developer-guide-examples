import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { initFreelogApp } from "freelog-runtime";

let app: any = null;

window.mount = () => {
  initFreelogApp();
  app = createApp(App);
  app.mount("#app");
};

window.unmount = () => {
  app.unmount();
  app = null;
};
// 如果不在微前端环境，则直接执行mount渲染
if (!window.__MICRO_APP_ENVIRONMENT__) {
  app = createApp(App);
  app.mount("#app");
}