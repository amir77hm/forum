<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <textarea
        name=""
        id=""
        cols="30"
        rows="10"
        class="form-input"
        v-model="text"
      ></textarea>
    </div>
    <div class="form-actions">
      <button v-if="isEdited" class="btn btn-ghost" @click.prevent="cancel">
        Cancel
      </button>
      <button class="btn-blue">
        {{ isEdited ? "update" : "submit post" }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: "PostEditor",

  props: {
    threadId: {
      required: false,
    },
    post: {
      type: Object,
      // validator: (obj) => {
      //   const keyIsValid = typeof obj[".key"] === "string";
      //   const textIsValid = typeof obj[this.text] === "string";
      //   if (!keyIsValid && textIsValid) {
      //     console.log("ohh shit, we have error");
      //   }
      // },
    },
  },

  data() {
    return {
      text: this.post ? this.post.text : "",
    };
  },

  computed: {
    isEdited() {
      return !!this.post;
    },
  },

  methods: {
    save() {
      (this.isEdited ? this.update() : this.create()).then((post) =>
        this.$emit("save", { post })
      );
    },

    create() {
      const post = {
        text: this.text,
        threadId: this.threadId,
      };
      this.text = "";
      return this.$store.dispatch("createPost", post);
    },

    update() {
      const payload = {
        id: this.post[".key"],
        text: this.text,
      };
      return this.$store.dispatch("updatePost", payload);
    },

    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped>
textarea {
  resize: none;
  width: 100%;
}
</style>