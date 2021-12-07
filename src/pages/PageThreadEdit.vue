<template>
  <div class="col-full push-top">
    <h1>
      Editing <i>{{ thread.title }}</i>
    </h1>

    <ThreadEditor
      :text="text"
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
    text() {
      return this.$store.state.posts[this.thread.firstPostId].text;
    },
    // firstPost() {
    //   return this.$store.state.posts[this.thread.firstPostId ];
    // },
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
};
</script>