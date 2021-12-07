<template>
  <div class="col-full">
    <h1>not found</h1>
    <p>ooops, we couldnt find what you are looking for,
      <router-link :to="{name:'Home'}">why dont you go home instead?</router-link>
    </p>
  </div>

</template>

<script>
export default {};
</script>

<style scoped>
.col-full{
    text-align: center;
}
h1{
    font-size: 6rem !important;
}
p{
    font-size: 1.5rem !important;
}
</style>