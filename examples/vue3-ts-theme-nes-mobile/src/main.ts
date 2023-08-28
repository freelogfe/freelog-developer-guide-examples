/* eslint-disable @typescript-eslint/no-explicit-any */
import "./public-path";
import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import routes from "./router";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import { useGameUrlStore } from "./stores/game";
import "./assets/css/index.scss"
 
let pinia: any = null;

// createApp(App).use(store).use(router).mount("#app")
let router: any = null;
let instance: any = null;

function render(props: any = {}) {
  const { container } = props;
  router = createRouter({
    history: createWebHistory(window.__POWERED_BY_FREELOG__ ? "/widget" : "/"),
    routes,
  });
  instance = createApp(App);
  pinia = createPinia();
  instance.use(router);
  instance.use(pinia);

  instance.mount(container ? container.querySelector("#app") : "#app");
  // instance.config.globalProperties.$message = message;

  if (props?.registerApi) {
    // 暴露api给父插件或主题
    props.registerApi({
      startGame: (url:string, name: string) => {
        const store = useGameUrlStore();
        store.setUrl(url, name);
      },
    });
  }
}

if (!window.__POWERED_BY_FREELOG__) {
  render();
}

export async function bootstrap() {
  console.log("%c ", "color: green;", "vue3.0 app bootstraped");
}

function storeTest(props: any) {
  if (props.onGlobalStateChange) {
    props.onGlobalStateChange(
      (value: any, prev: any) =>
        console.log(`[插件 - ${props.name}]:`, value, prev),
      true
    );
  }
  setTimeout(() => {
    props.setGlobalState({
      ignore: props.name + "111",
      user: {
        name: props.name + "111",
      },
    });
  }, 2500);
  if (props.setGlobalState) {
    props.setGlobalState({
      ignore: props.name,
      user: {
        name: props.name,
      },
    });
  }
}

export async function mount(props: any) {
  storeTest(props);
  render(props);
  instance.config.globalProperties.$onGlobalStateChange =
    props.onGlobalStateChange;
  instance.config.globalProperties.$setGlobalState = props.setGlobalState;
}

export async function unmount() {
  instance.unmount();
  instance._container.innerHTML = "";
  instance = null;
  router = null;
  pinia = null;
}
