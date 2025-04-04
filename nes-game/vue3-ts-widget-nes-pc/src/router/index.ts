import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: "/:pathMatch(.*)", // 捕获所有未知路径
    redirect: "/", // 重定向到首页
  },
]

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes
// })

export default routes
