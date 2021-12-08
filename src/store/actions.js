import {
  getDatabase,
  ref,
  onValue,
  update,
  push,
  child,
} from "firebase/database";

export default {
  createPost: ({ state, commit }, post) => {
    const db = getDatabase();
    const postId = push(child(ref(db), "posts")).key;
    const threadId = post.threadId;
    post.userId = state.authId;
    post.publishedAt = Math.floor(Date.now() / 1000);

    const updates = {};
    updates["posts/" + postId] = post;
    updates["threads/" + post.threadId + "posts/" + postId] = postId;
    updates["threads/" + post.threadId + "contributors/" + post.userId] =
      post.userId;
    updates["users/" + post.userId + "posts/" + postId] = postId;

    return update(ref(db), updates).then(() => {
      commit("setItem", { resource: "posts", item: post, id: postId });
      commit("appendPostToThread", { threadId, postId });
      commit("appendContributorToThread", {
        parentId: post.threadId,
        childId: post.userId,
      });
      commit("appendPostToUser", { userId: post.userId, postId });
      return Promise.resolve(state.posts[postId]);
    });
  },

  createThread: ({ state, commit, dispatch }, { text, title, forumId }) => {
    const db = getDatabase();
    return new Promise((resolve) => {
      const threadId = push(child(ref(db), "threads")).key;
      const postId = push(child(ref(db), "posts")).key;
      const userId = state.authId;
      const publishedAt = Math.floor(Date.now() / 1000);

      const thread = {
        firstPostId: postId,
        userId,
        publishedAt,
        text,
        title,
        forumId,
        posts: {},
      };
      thread.posts[postId] = postId;

      const post = {
        text,
        publishedAt,
        threadId,
        userId,
      };

      const updates = {};
      updates["threads/" + threadId] = thread;
      updates["forums/" + forumId + "threads/" + threadId] = threadId;
      updates["users/" + userId + "threads/" + threadId] = threadId;

      updates["posts/" + postId] = post;
      updates["threads/" + post.threadId + "posts/" + postId] = postId;
      updates["users/" + post.userId + "posts/" + postId] = postId;

      return update(ref(db), updates).then(() => {
        // thread
        commit("setItem", { resource: "threads", item: thread, id: threadId });
        commit("appendThreadToForum", { forumId, threadId });
        commit("appendThreadToUser", { userId, threadId });

        // post
        commit("setItem", { resource: "posts", item: post, id: postId });
        commit("appendPostToThread", { threadId, postId });
        commit("appendPostToUser", { userId: post.userId, postId });

        resolve(state.threads[threadId]);
      });
    });
  },

  updatePost: ({ commit, state }, { id, text }) => {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
      const post = state.posts[id];
      const edited = {
        at: Math.floor(Date.now() / 1000),
        by: state.authId,
      };

      const updates = {};
      updates["posts/" + postId] = post;
      commit("setPost", {
        postId: id,
        post: {
          ...post,
          text,
          edited,
        },
      });
      resolve(post);
    });
  },

  updateUser: ({ commit }, user) => {
    commit("setUser", { userId: user[".key"], user });
  },

  updateThread: ({ commit, state, dispatch }, { title, text, id }) => {
    return new Promise((resolve) => {
      const thread = state.threads[id];

      const newThread = { ...thread, title };

      commit("setThread", { thread: newThread, threadId: id });

      dispatch("updatePost", { id: thread.firstPostId, text }).then(() => {
        resolve(newThread);
      });
    });
  },

  fetchForum: ({ dispatch }, { id }) =>
    dispatch("fetchItem", { resource: "forums", id }),
  fetchForums: ({ dispatch }, { ids }) =>
    dispatch("fetchItems", { resource: "forums", ids }),
  fetchThread: ({ dispatch }, { id }) =>
    dispatch("fetchItem", { resource: "threads", id }),
  fetchThreads: ({ dispatch }, { ids }) =>
    dispatch("fetchItems", { resource: "threads", ids }),
  fetchUser: ({ dispatch }, { id }) =>
    dispatch("fetchItem", { resource: "users", id }),
  fetchUsers: ({ dispatch }, { ids }) =>
    dispatch("fetchItems", { resource: "users", ids }),
  fetchPost: ({ dispatch }, { id }) =>
    dispatch("fetchItem", { resource: "posts", id }),
  fetchPosts: ({ dispatch }, { ids }) =>
    dispatch("fetchItems", { resource: "posts", ids }),
  fetchCategory: ({ dispatch }, { id }) =>
    dispatch("fetchItem", { resource: "categories", id }),

  fetchAllCategories: ({ state, commit }) => {
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

  fetchItem: ({ state, commit }, { resource, id }) => {
    const datebase = getDatabase();
    return new Promise((resolve, reject) => {
      const postValue = ref(datebase, resource + "/" + id);
      onValue(postValue, (snapshot) => {
        commit("setItem", {
          resource,
          item: snapshot.val(),
          id: snapshot.key,
        });
        resolve(state[resource][id]);
      });
    });
  },

  fetchItems: ({ dispatch }, { ids, resource }) => {
    ids = Array.isArray(ids) ? ids : Object.keys(ids);
    return Promise.all(
      ids.map((id) => dispatch("fetchItem", { resource, id }))
    );
  },
};
