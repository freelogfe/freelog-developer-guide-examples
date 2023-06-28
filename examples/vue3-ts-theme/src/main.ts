/* eslint-disable @typescript-eslint/no-explicit-any */
import "./public-path";
import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import routes from "./router";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import { useCounterStore } from "./stores/counter";
// import "./assets/css/index.scss";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const freelogApp = window.freelogApp;

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
  instance.use(ElementPlus);
  instance.mount(container ? container.querySelector("#app") : "#app");
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    instance.component(key, component);
  }
}

if (!window.__POWERED_BY_FREELOG__) {
  render();
}

export async function bootstrap() {
  console.log("%c ", "color: green;", "vue3.0 app bootstraped");
}

function storeTest(props: any) {
  /**
   * 测试一下主题插件的全局通信
   */
  // 初始化可以跟插件通信的全局数据,仅主题可以用，但主题可以通过config传递给插件使用
  freelogApp.initGlobalState({
    ignore: props.name,
    user: {
      name: props.name,
    },
  });
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
