<template>
  <div class="conatiner">
    <app-navbar />
    <app-products />
  </div>
</template>

<script>
import Navbar from "../layouts/Navbar";
import Products from "../layouts/Products";
export default {
  name: "Home",
  components: {
    "app-navbar": Navbar,
    "app-products": Products,
  },
};
</script>

<style>
</style>