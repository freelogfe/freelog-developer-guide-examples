import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import { useGameUrlStore } from "./stores/game";
import { exit } from "./utils"
import { widgetApi, initFreelogApp } from "freelog-runtime";
let pinia: any = null;

let app: any = null;

window.mount = () => {
  initFreelogApp();
  app = createApp(App);
  pinia = createPinia();
  app.use(pinia);
  app.mount("#app");
   // 暴露api给父插件或主题

  const data = widgetApi.getData()
  data.registerApi({
    startGame: (url: string, name: string, gameCore: string) => {
      const store = useGameUrlStore();
      store.setUrl(url, name, gameCore);
    },
    exit: (callback: Function) => {
      exit(callback);
    },
  });
};

window.unmount = () => {
  app.unmount();
  app = null;
};
