<template>
  <div v-if="thread && firstPost" class="col-full push-top">
    <h1>
      Editing <i>{{ thread.title }}</i>
    </h1>

    <ThreadEditor
      :text="firstPost.text"
      :title="thread.title"
      @save="save"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import ThreadEditor from "@/components/ThreadEditor";

export default {
  components: {
    ThreadEditor,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },

  computed: {
    thread() {
      return this.$store.state.threads[this.id];
    },
    firstPost() {
      return this.$store.state.posts[this.thread.firstPostId];
    },
  },
  methods: {
    save({ title, text }) {
      this.$store
        .dispatch("updateThread", {
          text,
          title,
          id: this.id,
        })
        .then((newThread) =>
          this.$router.push({
            name: "ThreadShow",
            params: { id: this.id },
          })
        );
    },
    cancel() {
      this.$router.push({
        name: "ThreadShow",
        params: {
          id: this.id,
        },
      });
    },
  },

  created() {
    this.$store.dispatch("fetchThread", { id: this.id }).then((thread) => {
      this.$store.dispatch("fetchPost", { id: thread.firstPostId });
    });
  },
};
</script>