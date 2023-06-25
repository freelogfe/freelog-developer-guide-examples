import './public-path'
import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import routes from './router'
import store from './store'
import { createRouter, createWebHistory } from 'vue-router';

// createApp(App).use(store).use(router).mount('#app')
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
    instance.use(store);
    instance.mount(container ? container.querySelector('#app') : '#app');
}

export async function bootstrap() {
    console.log('%c ', 'color: green;', 'vue3.0 app bootstraped');
}


export async function mount(props) {
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
}



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


if (!window.__POWERED_BY_FREELOG__) {
    render();
}