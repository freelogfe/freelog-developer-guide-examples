/* eslint-disable @typescript-eslint/no-explicit-any */
import "./public-path";
import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import routes from "./router";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import "ant-design-vue/dist/reset.css";
import Antd from "ant-design-vue";
import { message } from "ant-design-vue";
import "@/assets/css/index.scss";
import { initFreelogApp } from "freelog-runtime";
let pinia: any = null;

// window.FREELOG_RESOURCENAME = "snnaenu/插件开发演示代码主题";
// createApp(App).use(store).use(router).mount("#app")
let router: any = null;
let instance: any = null;

/**
 *
 * 渲染方法
 */
function render() {
  router = createRouter({
    history: createWebHistory(window.__MICRO_APP_ENVIRONMENT__ ? "/" : "/"),
    routes,
  });
  instance = createApp(App);
  pinia = createPinia();
  instance.use(router);
  instance.use(pinia);
  instance.use(Antd);
  instance.mount(document.querySelector("#app"));
}

/**
 * 加载阶段
 */
function mount() {
  render();
}

/**
 * 卸载阶段：为了防止内存溢出，必须卸载vue实例 以及将 router与pinina置为null
 */
function unmount() {
  instance.unmount();
  instance._container.innerHTML = "";
  instance = null;
  router = null;
  pinia = null;
}


window.mount = () => {
  initFreelogApp();
  mount();
};

window.unmount = () => {
  unmount();
};
