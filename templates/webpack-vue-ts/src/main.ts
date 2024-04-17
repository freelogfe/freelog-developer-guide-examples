import { createApp } from "vue";
import * as VueRouter from "vue-router";

import routes from "./router";
import App from "./App.vue";
import { initFreelogApp } from "freelog-runtime";

let app:any = null;
let router = null;
let history:any = null;
// 👇 将渲染操作放入 mount 函数，子应用初始化时会自动执行
window.mount = () => {
  initFreelogApp();
  history = VueRouter.createWebHistory();
  router = VueRouter.createRouter({
    history,
    routes,
  });

  app = createApp(App);
  app.use(router);
  app.mount("#app");
};

// 👇 将卸载操作放入 unmount 函数，就是上面步骤2中的卸载函数
window.unmount = () => {
  app.unmount();
  history.destroy();
  app = null;
  router = null;
  history = null;
};
