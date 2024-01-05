import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/exhibit-info",
    name: "exhibitInfo",
    component: () => import("@/views/exhibit/ExhibitInfo.vue"),
  },
  {
    path: "/exhibit-data",
    name: "exhibitData",
    component: () => import("@/views/exhibit/ExhibitData.vue"),
  },
  {
    path: "/exhibit-sub",
    name: "exhibitSub",
    component: () => import("@/views/exhibit/ExhibitSub.vue"),
  },
];

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes
// })

export default routes;
