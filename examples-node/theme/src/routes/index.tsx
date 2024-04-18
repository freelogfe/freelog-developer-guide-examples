import { exhibitRoutes } from "./modules/exhibit";
import { userRoutes } from "./modules/user";
import { widgetRoutes } from "./modules/widget";
import ExhibitIndex from "@/views/exhibit";

import App from "@/App";
export default {
  routes: [
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "",
          element: <ExhibitIndex />,
        },
        exhibitRoutes,
        userRoutes,
        widgetRoutes,
      ],
    },
  ],
};
