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
import { freelogApp } from "@/utils";
let pinia: any = null;

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
    history: createWebHistory(window.__POWERED_BY_FREELOG__ ? "/" : "/"),
    routes,
  });
  instance = createApp(App);
  pinia = createPinia();
  instance.use(router);
  instance.use(pinia);
  instance.use(Antd);
  instance.mount(container ? container.querySelector("#app") : "#app");
}

if (!window.__POWERED_BY_FREELOG__) {
  render();
}

/**
 * 启动阶段：可以在这里准备一些加载时需要的数据
 */
export async function bootstrap() {
  console.log("%c ", "color: green;", "vue3.0 app bootstraped");
}

/**
 * 加载阶段
 */
export async function mount(props: any) {
  storeTest(props);
  render(props);
  instance.config.globalProperties.$onGlobalStateChange =
    props.onGlobalStateChange;
  instance.config.globalProperties.$setGlobalState = props.setGlobalState;
  instance.config.globalProperties.$message = message;
}

/**
 * 卸载阶段：为了防止内存溢出，必须卸载vue实例 以及将 router与pinina置为null
 */
export async function unmount() {
  instance.unmount();
  instance._container.innerHTML = "";
  instance = null;
  router = null;
  pinia = null;
}

/**
 *
 * 全局通信测试
 */
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
