
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





export async function mount() {
  render();
}

export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
}
if (window.__POWERED_BY_WUJIE__) {
  window.__WUJIE_MOUNT = () => {
    mount();
  };
  window.__WUJIE_UNMOUNT = () => {
    unmount();
  };
} 
