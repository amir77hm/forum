import Vue from "vue";
import vuex from "vuex";
import { countObjectProperties } from "@/utils";
import { getDatabase, ref, onValue } from "firebase/database";

Vue.use(vuex);

// const makeAppendChildToParentMutaition =
//   ({ parent, child }) =>
//   (state, { parentId, childId }) => {
//     const resource = state[parent][childId];
//     if (!resource[child]) {
//       Vue.set(resource, child, {});
//     }
//     Vue.set(resource[child], parentId, parentId);
//   };

export default new vuex.Store({
  state: {
    categories: {},
    forums: {},
    threads: {},
    posts: {},
    users: {},
    authId: "ALXhxjwgY9PinwNGHpfai6OWyDu2",
  },
  getters: {
    authUser(state) {
      // return state.users[state.authId];
      return {};
    },
    userPostCount: (state) => (id) =>
      countObjectProperties(state.users[id].posts),

    userThreadCount: (state) => (id) =>
      countObjectProperties(state.users[id].threads),
  },

  actions: {
    createPost({ state, commit }, post) {
      const postId = "oooh" + Math.random();
      const threadId = post.threadId;
      post[".key"] = postId;
      post.userId = state.authId;
      post.publishedAt = Math.floor(Date.now() / 1000);

      commit("setPost", { post, postId });
      commit("appendPostToThread", { threadId, postId });
      commit("appendPostToUser", { userId: post.userId, postId });

      return Promise.resolve(state.posts[postId]);
    },

    createThread({ state, commit, dispatch }, { text, title, forumId }) {
      return new Promise((resolve) => {
        const threadId = "greatThread" + Math.random();
        const userId = state.authId;
        const publishedAt = Math.floor(Date.now() / 1000);
        const thread = {
          ".key": threadId,
          userId,
          publishedAt,
          text,
          title,
          forumId,
        };

        commit("setThread", { thread, threadId });
        commit("appendThreadToForum", { forumId, threadId });
        commit("appendThreadToUser", { userId, threadId });

        dispatch("createPost", { text, threadId }).then((post) => {
          commit("setThread", {
            threadId,
            thread: { ...thread, firstPostId: post[".key"] },
          });
        });

        resolve(state.threads[threadId]);
      });
    },

    updatePost({ commit, state }, { id, text }) {
      return new Promise((resolve, reject) => {
        const post = state.posts[id];
        commit("setPost", {
          postId: id,
          post: {
            ...post,
            text,
            edited: {
              at: Math.floor(Date.now() / 1000),
              by: state.authId,
            },
          },
        });
        resolve(post);
      });
    },

    updateUser({ commit }, user) {
      commit("setUser", { userId: user[".key"], user });
    },

    updateThread({ commit, state, dispatch }, { title, text, id }) {
      return new Promise((resolve) => {
        const thread = state.threads[id];

        const newThread = { ...thread, title };

        commit("setThread", { thread: newThread, threadId: id });

        dispatch("updatePost", { id: thread.firstPostId, text }).then(() => {
          resolve(newThread);
        });
      });
    },

    fetchThread({ dispatch }, { id }) {
      return dispatch("fetchItem", { resource: "threads", id });
    },

    fetchUser({ dispatch }, { id }) {
      return dispatch("fetchItem", { resource: "users", id });
    },

    fetchPost({ dispatch }, { id }) {
      return dispatch("fetchItem", { resource: "posts", id });
    },

    fetchPosts({ dispatch }, { ids }) {
      return dispatch("fetchItems", { resource: "posts", ids });
    },

    fetchAllCategories({ state, commit }) {
      const datebase = getDatabase();
      return new Promise((resolve, reject) => {
        const categoriesValue = ref(datebase, "categories");
        onValue(categoriesValue, (snapshot) => {
          const categories = snapshot.val();
          Object.keys(categories).forEach((categoryId) => {
            const category = categories[categoryId];
            commit("setItem", {
              resource: "categories",
              id: categoryId,
              item: category,
            });
          });
          resolve(Object.values(state.categories));
        });
      });
    },

    fetchCategory({ dispatch }, { id }) {
      return dispatch("fetchItem", { resource: "category", id });
    },

    fetchForums({ dispatch }, { ids }) {
      return dispatch("fetchItems", { resource: "forums", ids });
    },

    fetchItem({ state, commit }, { resource, id }) {
      const datebase = getDatabase();
      return new Promise((resolve, reject) => {
        const postValue = ref(datebase, resource + "/" + id);
        onValue(postValue, (snapshot) => {
          console.log(snapshot.key);
          commit("setItem", {
            resource,
            item: snapshot.val(),
            id: snapshot.key,
          });
          resolve(state[resource][id]);
        });
      });
    },

    fetchItems({ dispatch }, { ids, resource }) {
      ids = Array.isArray(ids) ? ids : Object.keys(ids);
      return Promise.all(
        ids.map((id) => dispatch("fetchItem", { resource, id }))
      );
    },
  },

  mutations: {
    setPost(state, { post, postId }) {
      Vue.set(state.posts, postId, post);
    },

    setThread(state, { thread, threadId }) {
      Vue.set(state.threads, threadId, thread);
    },

    setUser(state, { user, userId }) {
      Vue.set(state.users, userId, user);
    },

    setItem(state, { item, id, resource }) {
      item[".key"] = id;
      Vue.set(state[resource], id, item);
    },

    // user ==> thread  //  post =>post
    appendPostToThread(state, { postId, threadId }) {
      const thread = state.threads[threadId];
      if (!thread.posts) {
        Vue.set(thread, "posts", {});
      }
      Vue.set(thread.posts, postId, postId);
    },

    appendPostToUser(state, { userId, postId }) {
      const user = state.users[userId];
      if (!user.posts) {
        Vue.set(user, "posts", {});
      }
      Vue.set(user.posts, postId, postId);
    },

    appendThreadToForum(state, { forumId, threadId }) {
      const forum = state.forums[forumId];
      if (!forum.threads) {
        Vue.set(forum, "threads", {});
      }
      Vue.set(forum.threads, threadId, threadId);
    },

    appendThreadToUser(state, { userId, threadId }) {
      const user = state.users[userId];
      if (!user.threads) {
        Vue.set(user, "threads", {});
      }
      Vue.set(user.threads, threadId, threadId);
    },
  },
});
