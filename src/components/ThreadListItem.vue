<template>
  <div v-if="user" class="thread">
    <div>
      <p>
        <router-link :to="`/thread/${thread['.key']}`">{{
          thread.title
        }}</router-link>
      </p>
      <p class="text-faded text-xsmall">
        By <a href="#">{{ user.name }}</a
        >, <AppDate :timestamp="thread.publishedAt" />.
      </p>
    </div>
    <div class="activity">
      <p class="replies-count">
        <span>{{ repliceCount }}</span>
        replies
      </p>
    </div>
  </div>
</template>

<script>
import { countObjectProperties } from "@/utils";

export default {
  props: {
    thread: {
      required: true,
      type: Object,
    },
  },
  computed: {
    repliceCount() {
      return countObjectProperties(this.thread.posts) - 1;
    },
    user() {
      return this.$store.state.users[this.thread.userId];
    },
  },
};
</script>