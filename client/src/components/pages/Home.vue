<template>
  <div class="conatiner">
    <app-product-modal />
    <app-navbar />
    <router-view />
  </div>
</template>

<script>
import ProductModal from "../layouts/ProductModal";
import Navbar from "../layouts/Navbar";
export default {
  name: "Home",
  components: {
    "app-navbar": Navbar,
    "app-product-modal": ProductModal,
  },
};
</script>

<style scoped>
</style>