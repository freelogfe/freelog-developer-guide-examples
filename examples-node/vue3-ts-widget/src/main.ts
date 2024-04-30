/* eslint-disable @typescript-eslint/no-explicit-any */
import "./public-path";
import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import routes from "./router";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import { useCounterStore } from "./stores/counter";
import "./assets/css/index.scss";
import { freelogApp, initFreelogApp, widgetApi } from "freelog-runtime";

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
  // 暴露api给父插件或主题
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const data = widgetApi.getData()
  data.registerApi({
    changeMe: () => {
      const store = useCounterStore();
      store.increment();
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

window.mount = () => {
  initFreelogApp();
  mount();
};

window.unmount = () => {
  unmount();
};
