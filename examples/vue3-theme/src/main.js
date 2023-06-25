import './public-path.js'
import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import routes from './router'
import { createPinia } from 'pinia'

import { createRouter, createWebHistory } from 'vue-router';

let pinia = null;

let router = null;
let instance = null;

function render(props = {}) {
    const { container } = props;
    router = createRouter({
        history: createWebHistory(window.__POWERED_BY_FREELOG__ ? '/vue3' : '/'),
        routes,
    });
    pinia = createPinia()
    instance = createApp(App);
    instance.use(pinia)
    instance.use(router);
    instance.mount(container ? container.querySelector('#app') : '#app');
}

/**
 * 启动阶段：可以在这里准备一些加载时需要的数据
 */
export async function bootstrap() {
    console.log('%c ', 'color: green;', 'vue3.0 app bootstraped');
}

/**
 * 加载阶段
 */
export async function mount(props) {
    console.log(props.onGlobalStateChange)
    storeTest(props);
    render(props);
    instance.config.globalProperties.$onGlobalStateChange = props.onGlobalStateChange;
    instance.config.globalProperties.$setGlobalState = props.setGlobalState;
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

/**
 * 
 * 全局通信 
 */
function storeTest(props) {
    if (props.onGlobalStateChange) {
        props.onGlobalStateChange(
            (value, prev) => console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev),
            true,
        );
    }
    if (props.setGlobalState) {
        props.setGlobalState({
            ignore: props.name,
            user: {
                name: props.name,
            },
        });
    }
}

/**
 * 运行时会注入 __POWERED_BY_FREELOG__ 到window, 用于判断是否运行时环境
 */
if (!window.__POWERED_BY_FREELOG__) {
    render();
}