import Vue from "vue";
import vuex from "vuex";
import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";

Vue.use(vuex);

export default new vuex.Store({
  state: {
    categories: {},
    forums: {},
    threads: {},
    posts: {},
    users: {},
    authId: "ALXhxjwgY9PinwNGHpfai6OWyDu2",
  },
  getters,
  actions,
  mutations,
});
