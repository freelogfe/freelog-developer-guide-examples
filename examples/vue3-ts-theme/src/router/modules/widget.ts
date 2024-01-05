import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/widget-dep",
    name: "widgetDep",
    component: () => import("@/views/widget/WidgetDep.vue"),
  },
  {
    path: "/widget-config",
    name: "widgetConfig",
    component: () => import("@/views/widget/WidgetConfig.vue"),
  },
  {
    path: "/widget-mount",
    name: "widgetMount",
    component: () => import("@/views/widget/WidgetMount.vue"),
  },
  {
    path: "/widget-control",
    name: "widgetControl",
    component: () => import("@/views/widget/WidgetControl.vue"),
  },
  {
    path: "/widget-static",
    name: "widgetStatic",
    component: () => import("@/views/widget/WidgetStatic.vue"),
  },
  {
    path: "/widget-viewport",
    name: "widgetViewport",
    component: () => import("@/views/widget/WidgetViewport.vue"),
  },
];

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes
// })

export default routes;
