import { RouteRecordRaw } from "vue-router";
import widgetRoutes from "./modules/widget";
import userRoutes from "./modules/user";
import authRoutes from "./modules/auth";
import exhibitRoutes from "./modules/exhibit";
import widgetDep from "@/views/widget/WidgetDep.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/widget-dep",
    name: "widgetDep",
    component: widgetDep, //() => import(/* webpackChunkName: "widgetDep" */ "@/views/widget/WidgetDep.vue"),
  },
  {
    path: "/",
    name: "home",
    redirect: "/widget-dep",
  },
  ...widgetRoutes,
  ...userRoutes,
  ...authRoutes,
  ...exhibitRoutes,
];

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes
// })

export default routes;
