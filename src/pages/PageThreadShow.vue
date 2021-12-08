<template>
  <div v-if="thread && posts" class="col-large push-top">
    <h1>
      {{ thread.title }}
      <router-link
        style="float: right"
        :to="{ name: 'ThreadEdit', id: this.id }"
        class="btn-green btn-small"
        tag="button"
        >Edit Thread</router-link
      >
    </h1>
    <p>
      By
      <a href="#" class="link-unstyled">Robin</a>,
      <AppDate :timestamp="thread.publishedAt" />.
      <span
        style="float: right; margin-top: 2px"
        class="hide-mobile text-faded text-small"
      >
        {{ repliceCount }} replies by {{ contributorsCount }} contributors
      </span>
    </p>
    <PostList :posts="posts" />
    <PostEditor :threadId="id" />
  </div>
</template>

<script>
import PostList from "@/components/PostList";
import PostEditor from "@/components/PostEditor";
import { countObjectProperties } from "@/utils";

export default {
  name: "ThreadShow",
  components: {
    PostList,
    PostEditor,
  },

  props: {
    id: {
      required: true,
    },
  },

  computed: {
    thread() {
      return this.$store.state.threads[this.id];
    },
    posts() {
      const postIds = Object.values(this.thread.posts);
      return Object.values(this.$store.state.posts).filter((post) =>
        postIds.includes(post[".key"])
      );
    },
    contributorsCount() {
      return countObjectProperties(this.thread.contributors);
    },
    repliceCount() {
      return countObjectProperties(this.thread.posts) - 1;
    },
  },

  methods: {
    addPost(post) {
      this.$store.dispatch("createPost", post);
    },
  },

  created() {
    // fetch thread
    this.$store.dispatch("fetchThread", { id: this.id }).then((thread) => {
      // fetch user
      this.$store.dispatch("fetchUser", { id: thread.userId });
      this.$store
        .dispatch("fetchPosts", { ids: Object.keys(thread.posts) })
        .then((posts) => {
          posts.forEach((post) => {
            this.$store.dispatch("fetchUser", { id: post.userId });
          });
        });
    });
  },
};
</script>
