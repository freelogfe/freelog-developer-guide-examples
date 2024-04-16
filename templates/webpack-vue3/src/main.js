import './public-path.js'
import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker.js'
import routes from './router/index.js'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createRouter, createWebHistory } from 'vue-router';
import { initFreelogApp } from "freelog-runtime";
let pinia = null;
let router = null;
let instance = null;

/**
 * 
 * 渲染方法
 */
function render(props = {}) {
    const { container } = props;
    router = createRouter({
        history: createWebHistory(window.__MICRO_APP_ENVIRONMENT__ ? '/theme' : '/'),
        routes,
    });
    pinia = createPinia()
    instance = createApp(App)
    instance.use(pinia)
    instance.use(router)
    instance.use(ElementPlus)
    instance.mount(container ? container.querySelector('#app') : '#app')
}


/**
 * 加载阶段
 */
function mount() {
    render();
}
/**
 * 卸载阶段：为了防止内存溢出，必须卸载vue实例 以及将 router与pinina置为null
 */
function unmount() {
    instance.unmount();
    instance._container.innerHTML = '';
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
