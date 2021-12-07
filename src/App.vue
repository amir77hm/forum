<template>
  <div class="app">
    <TheNavbar />
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import TheNavbar from "@/components/TheNavbar";

export default {
  components: {
    TheNavbar,
  },
  created() {
    // getDatabase()
    //   .ref("threads")
    //   .child("-KvgjI6bfbWYlbYV5ndr")
    //   .once("value", (snapshot) => {
    //     const thread = snapshot.val();
    //     console.log(thread);
    //     // this.$store.commit("setThread", {
    //     //   threadId: snapshot.key,
    //     //   thread: { ...thread, ".key": snapshot.key },
    //     // });
    //   });
  },
};
</script>
