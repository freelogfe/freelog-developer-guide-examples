import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/user-login",
    name: "userLogin",
    component: () => import("@/views/user/UserLogin.vue"),
  },
  {
    path: "/user-info",
    name: "userInfo",
    component: () => import("@/views/user/UserInfo.vue"),
  },
];

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes
// })

export default routes;
