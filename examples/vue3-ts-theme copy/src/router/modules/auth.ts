import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "auth-info",
    name: "authInfo",
    component: () => import("@/views/auth/AuthInfo.vue"),
  },
  {
    path: "auth-process",
    name: "authProcess",
    component: () => import("@/views/auth/AuthProcess.vue"),
  },
];

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes
// })

export default routes;
