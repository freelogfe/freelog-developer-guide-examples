
import store from "./store";

Vue.config.productionTip = false;
import './public-path';
// import routes from './router';
import './assets/css/index.scss'
// let router = null;

import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

/**
 * 期望功能：
 * 1. 响应式布局
 * 2. 左侧栏-文件目录
 * 3. markdown(.md格式)文件渲染
 * 4. 右侧栏-markdown文件标题定位
 * 5. 向后滚动一段距离，头部隐藏
 * 6. 左右侧栏滚动悬浮
 */
Vue.use(VueRouter)

let instance = null;

function storeTest(props) {
    props.onGlobalStateChange &&
      props.onGlobalStateChange(
        (value, prev) =>
          console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev),
        true
      );
    props.setGlobalState &&
      props.setGlobalState({
        ignore: props.name,
        user: {
          name: props.name,
        },
      });
}


function render(props = {}) {
    const { container } = props;
  
    // router = new VueRouter({
    //     base: window.__POWERED_BY_FREELOG__ ? '/vue' : '/',
    //     mode: 'history',
    //     routes,
    // });
    instance = new Vue({
        store,
        render: h => h(App),
    }).$mount(container ? container.querySelector('#app') : '#app');
}

if (!window.__POWERED_BY_FREELOG__) {
    render();
}

export async function bootstrap() {
    console.log('[vue] vue app bootstraped');
}

export async function mount(props) {
    console.log('[vue] props from main framework', props);
    storeTest(props)
    render(props);
}

export async function unmount() {
    instance.$destroy();
    instance.$el.innerHTML = '';
    instance = null;
}