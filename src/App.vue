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
};
</script>
