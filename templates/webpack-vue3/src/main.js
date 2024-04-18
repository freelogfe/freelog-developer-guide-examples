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
let history = null;
/**
 * 
 * 渲染方法
 */
function render(props = {}) {
    const { container } = props;
    history = createWebHistory(window.__MICRO_APP_ENVIRONMENT__ ? '/theme' : '/')
    router = createRouter({
        history,
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
    history.destroy();
    instance = null;
    router = null;
    pinia = null;
    history = null;
}

window.mount = () => {
    initFreelogApp();
    mount();
};

window.unmount = () => {
    unmount();
};
