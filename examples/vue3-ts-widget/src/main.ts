import './public-path';
import { createApp } from "vue"
import App from "./App.vue"
import "./registerServiceWorker"
import routes from "./router"
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router';
import { useCounterStore } from "./stores/counter";

let pinia:any = null;

// createApp(App).use(store).use(router).mount("#app")
let router:any = null;
let instance:any = null;

function render(props:any = {}) {
  const { container } = props;
  router = createRouter({
    history: createWebHistory(window.__POWERED_BY_FREELOG__ ? '/vue3' : '/'),
    routes,
  });
  instance = createApp(App);
  pinia = createPinia()
  instance.use(router);
  instance.use(pinia)
  instance.mount(container ? container.querySelector('#app') : '#app');
  props.registerApi({
    // 这个对象会给到父插件
    changeMe:()=>{
      const store = useCounterStore();
      store.increment()
    },
  });
}

if (!window.__POWERED_BY_FREELOG__) {
  render();
}

export async function bootstrap() {
  console.log('%c ', 'color: green;', 'vue3.0 app bootstraped');
}

function storeTest(props:any) {
  props.onGlobalStateChange &&
    props.onGlobalStateChange(
      (value:any, prev:any) => console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev),
      true,
    );
  props.setGlobalState &&
    props.setGlobalState({
      ignore: props.name,
      user: {
        name: props.name,
      },
    });
}

export async function mount(props:any) {
  storeTest(props);
  render(props);
  instance.config.globalProperties.$onGlobalStateChange = props.onGlobalStateChange;
  instance.config.globalProperties.$setGlobalState = props.setGlobalState;
}

export async function unmount() {
  instance.unmount();
  instance._container.innerHTML = '';
  instance = null;
  router = null;
  pinia = null
}
