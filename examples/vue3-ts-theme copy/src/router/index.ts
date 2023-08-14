import { RouteRecordRaw } from "vue-router";
import widgetRoutes from "./modules/widget";
import userRoutes from "./modules/user";
import authRoutes from "./modules/auth";
import exhibitRoutes from "./modules/exhibit";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    redirect: "/widget-dep",
    children: [...widgetRoutes, ...userRoutes, ...authRoutes, ...exhibitRoutes],
  },
];

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes
// })

export default routes;
