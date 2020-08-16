<template>
  <div class="conatiner">
    <app-navbar />
  </div>
</template>

<script>
import Navbar from "../layouts/Navbar";
export default {
  name: "Home",
  components: {
    "app-navbar": Navbar,
  },
};
</script>

<style>
</style>