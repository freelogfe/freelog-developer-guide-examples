/* eslint-disable @typescript-eslint/no-explicit-any */
import "./public-path";
import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import routes from "./router";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import { useGameUrlStore } from "./stores/game";
import "./assets/css/index.scss";
import "./nes.css";
// import "./bootstrap-min.css"
import "./play-mobile.css";
import { freelogApp, initFreelogApp } from "freelog-runtime";

// import "./font_4224740_t78uykib6qs"
// window.FREELOG_RESOURCENAME = "snnaenu/插件开发演示代码主题";

let pinia: any = null;

// createApp(App).use(store).use(router).mount("#app")
let router: any = null;
let instance: any = null;

function render() {
  router = createRouter({
    history: createWebHistory(
      window.__MICRO_APP_ENVIRONMENT__ ? "/widget" : "/"
    ),
    routes,
  });
  instance = createApp(App);
  pinia = createPinia();
  instance.use(router);
  instance.use(pinia);

  instance.mount(document.querySelector("#app"));
  // instance.config.globalProperties.$message = message;

  // 暴露api给父插件或主题
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  freelogApp.registerApi({
    startGame: (url: string, name: string) => {
      const store = useGameUrlStore();
      store.setUrl(url, name);
    },
  });
}

function mount() {
  render();
}
function unmount() {
  instance.unmount();
  instance._container.innerHTML = "";
  instance = null;
  router = null;
  pinia = null;
}
// 👇 将渲染操作放入 mount 函数，子应用初始化时会自动执行
window.mount = () => {
  initFreelogApp();
  mount();
};

// 👇 将卸载操作放入 unmount 函数，就是上面步骤2中的卸载函数
window.unmount = () => {
  unmount();
};
