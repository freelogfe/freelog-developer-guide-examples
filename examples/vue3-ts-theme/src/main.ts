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
import { message } from "ant-design-vue";
import "@/assets/css/index.scss";
import { freelogApp } from "freelog-runtime";

let pinia: any = null;

window.FREELOG_RESOURCENAME = "snnaenu/插件开发演示代码主题";
// createApp(App).use(store).use(router).mount("#app")
let router: any = null;
let instance: any = null;

/**
 *
 * 渲染方法
 */
function render(props: any = {}) {
  const { container } = props;
  router = createRouter({
    history: createWebHistory(window.__POWERED_BY_WUJIE__ ? "/" : "/"),
    routes,
  });
  instance = createApp(App);
  pinia = createPinia();
  instance.use(router);
  instance.use(pinia);
  instance.use(Antd);
  instance.mount(container ? container.querySelector("#app") : "#app");
}

/**
 * 加载阶段
 */
export function mount() {
  render();
}

/**
 * 卸载阶段：为了防止内存溢出，必须卸载vue实例 以及将 router与pinina置为null
 */
export function unmount() {
  instance.unmount();
  instance._container.innerHTML = "";
  instance = null;
  router = null;
  pinia = null;
}

if (window.__POWERED_BY_WUJIE__) {
  window.__WUJIE_MOUNT = () => {
    mount();
  };
  window.__WUJIE_UNMOUNT = () => {
    unmount();
  };
} else {
  render();
}
