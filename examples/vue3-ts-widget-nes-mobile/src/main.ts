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
import { freelogApp } from "freelog-runtime";

// import "./font_4224740_t78uykib6qs"
window.FREELOG_RESOURCENAME = "snnaenu/插件开发演示代码主题";

let pinia: any = null;

// createApp(App).use(store).use(router).mount("#app")
let router: any = null;
let instance: any = null;

function render(props: any = {}) {
  const { container } = props;
  router = createRouter({
    history: createWebHistory(window.__POWERED_BY_WUJIE__ ? "/widget" : "/"),
    routes,
  });
  instance = createApp(App);
  pinia = createPinia();
  instance.use(router);
  instance.use(pinia);

  instance.mount(container ? container.querySelector("#app") : "#app");
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

export async function mount() {
  render();
}

export async function unmount() {
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
