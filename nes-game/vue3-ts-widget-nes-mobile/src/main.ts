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
import { freelogApp, initFreelogApp, widgetApi } from "freelog-runtime";

// import "./font_4224740_t78uykib6qs"
// window.FREELOG_RESOURCENAME = "snnaenu/插件开发演示代码主题";

let pinia: any = null;

// createApp(App).use(store).use(router).mount("#app")
let router: any = null;
let instance: any = null;

function render() {
  instance = createApp(App);
  pinia = createPinia();
  instance.use(pinia);
  router = createRouter({
    history: createWebHistory(
      window.__MICRO_APP_ENVIRONMENT__ ? "/widget" : "/"
    ),
    routes,
  });
  instance.use(router);

  instance.mount(document.querySelector("#app"));
  // instance.config.globalProperties.$message = message;
  if (window.__MICRO_APP_ENVIRONMENT__) {
    // 暴露api给父插件或主题
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const data = widgetApi.getData();
    data.registerApi({
      startGame: (url: string, name: string) => {
        const store = useGameUrlStore();
        store.setUrl(url, name);
      },
    });
  }
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

window.mount = () => {
  initFreelogApp();

  mount();
};

window.unmount = () => {
  unmount();
};
if (!window.__MICRO_APP_ENVIRONMENT__) {
  render();
}
