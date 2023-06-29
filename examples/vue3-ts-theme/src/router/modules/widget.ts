import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    redirect: "/widget-dep",
  },
  {
    path: "",
    redirect: "/widget-dep",
  },
  {
    path: "widget-dep",
    name: "widgetDep",
    component: () => import("@/views/widget/WidgetDep.vue"),
  },
  {
    path: "widget-config",
    name: "widgetConfig",
    component: () => import("@/views/widget/WidgetConfig.vue"),
  },
  {
    path: "widget-mount",
    name: "widgetMount",
    component: () => import("@/views/widget/WidgetMount.vue"),
  },
  {
    path: "widget-control",
    name: "widgetControl",
    component: () => import("@/views/widget/WidgetControl.vue"),
  },
  {
    path: "widget-static",
    name: "widgetStatic",
    component: () => import("@/views/widget/WidgetStatic.vue"),
  },
];

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes
// })

export default routes;
