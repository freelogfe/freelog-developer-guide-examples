import { RouteRecordRaw } from "vue-router";
 

const routes: Array<RouteRecordRaw> = [
  {
    path: "/:id",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
    props: true
  },
];

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes
// })

export default routes;
