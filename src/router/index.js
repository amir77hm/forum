import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/pages/PageHome";
import ThreadShow from "@/pages/PageThreadShow";
import ThreadCreate from "@/pages/PageThreadCreate";
import ThreadEdit from "@/pages/PageThreadEdit";
import Category from "@/pages/PageCategory";
import Forum from "@/pages/PageForum";
import Profile from "@/pages/PageProfile";
import NotFound from "@/pages/PageNotFound";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/category/:id",
    name: "Category",
    component: Category,
    props: true,
  },
  {
    path: "/forum/:id",
    name: "Forum",
    component: Forum,
    props: true,
  },
  {
    path: "/thread/create/:forumId",
    name: "ThreadCreate",
    component: ThreadCreate,
    props: true,
  },
  {
    path: "/thread/:id",
    name: "ThreadShow",
    component: ThreadShow,
    props: true,
  },
  {
    path: "/thread/:id/edit",
    name: "ThreadEdit",
    component: ThreadEdit,
    props: true,
  },
  {
    path: "/me",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/me/edit",
    name: "Profile",
    component: Profile,
    props: { edit: true },
  },
  {
    path: "*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
