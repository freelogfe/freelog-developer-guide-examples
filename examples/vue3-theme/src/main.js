import './public-path.js'
import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import routes from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createRouter, createWebHistory } from 'vue-router';
import { freelogApp } from "freelog-runtime";
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
        history: createWebHistory(window.__POWERED_BY_WUJIE__ ? '/theme' : '/'),
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
export async function mount() {
    render();
}
/**
 * 卸载阶段：为了防止内存溢出，必须卸载vue实例 以及将 router与pinina置为null
 */
export async function unmount() {
    instance.unmount();
    instance._container.innerHTML = '';
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