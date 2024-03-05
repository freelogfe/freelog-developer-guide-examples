/* eslint-disable @typescript-eslint/no-explicit-any */
import "./public-path";
import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import routes from "./router";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import "ant-design-vue/dist/antd.css";
import Antd from "ant-design-vue";
import "@/assets/css/index.scss";
let pinia: any = null;
window.FREELOG_RESOURCENAME = "snnaenu/插件开发演示代码主题";
// createApp(App).use(store).use(router).mount("#app")
let router: any = null;
let instance: any = null;
// 👇 将渲染操作放入 mount 函数，子应用初始化时会自动执行
window.mount = () => {
  router = createRouter({
    history: createWebHistory(window.__MICRO_APP_BASE_ROUTE__ ? "/" : "/"),
    routes,
  });
  instance = createApp(App);
  pinia = createPinia();
  instance.use(router);
  instance.use(pinia);
  instance.use(Antd);
  instance.mount("#app");

  console.log("微应用child-vue3渲染了 -- UMD模式");
};

// 👇 将卸载操作放入 unmount 函数
window.unmount = () => {
  instance.unmount();
  instance._container.innerHTML = "";
  instance = null;
  router = null;
  pinia = null;
  console.log("微应用child-vue3卸载了 -- UMD模式");
};

// 如果不在微前端环境，则直接执行mount渲染
if (!window.__MICRO_APP_ENVIRONMENT__) {
  window.mount();
}
