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
import { initFreelogApp, freelogApp } from "freelog-runtime";
let pinia: any = null;
// window.FREELOG_RESOURCENAME = "snnaenu/插件开发演示代码主题";
// createApp(App).use(store).use(router).mount("#app")
let router: any = null;
let app: any = null;
import * as Vue from "vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.Vue = Vue;

const mount = async () => {
  router = createRouter({
    history: createWebHistory(window.__MICRO_APP_BASE_ROUTE__ ? "/" : "/"),
    routes,
  });
  app = createApp(App);
  pinia = createPinia();
  app.use(router);
  app.use(pinia);
  app.use(Antd);
  app.mount("#app");
  // 获取实例
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const instance = window.FreelogLibrary;
  const getUrlsv = await instance.getLibraryEntryUrls("snnaenu/测试软件库");
  const resb = await instance.loadLibraryJs(
    getUrlsv.jsEntryUrl,
    getUrlsv.metaJson
  );
  console.log("主题中 cumins/vue-component-002", getUrlsv.version, resb);
  instance.loadLibraryCss(getUrlsv.cssEntryUrl);
  app.component("MittleComp", resb.default);
  app.mount("#app");
};

// 👇 将卸载操作放入 unmount 函数
const unmount = () => {
  app.unmount();
  app._container.innerHTML = "";
  app = null;
  router = null;
  pinia = null;
  console.log("child-vue3卸载了 -- UMD模式");
};

window.mount = () => {
  initFreelogApp();
  freelogApp.mapShareUrl({
    content: (exhibitId: string) => {
      return `/user-share/${exhibitId}`;
    },
  });
  mount();
};

window.unmount = () => {
  unmount();
};
