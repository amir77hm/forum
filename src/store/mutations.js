import Vue from "vue";

const makeAppendChildToParentMutation =
  ({ parent, child }) =>
  (state, { childId, parentId }) => {
    const resource = state[parent][parentId];

    if (!resource[child]) {
      Vue.set(resource, child, {});
    }
    Vue.set(resource[child], childId, childId);
  };

export default {
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

  appendContributorToThread: makeAppendChildToParentMutation({
    parent: "threads",
    child: "contributors",
  }),

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
};
