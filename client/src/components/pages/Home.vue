<template>
  <div class="conatiner">
    <app-file-loader />
    <app-product-modal />
    <app-navbar />
    <router-view />
  </div>
</template>

<script>
import ProductModal from "../layouts/ProductModal";
import Navbar from "../layouts/Navbar";
import FileLoader from "../utils/BackDrop";
export default {
  name: "Home",
  components: {
    "app-navbar": Navbar,
    "app-product-modal": ProductModal,
    "app-file-loader": FileLoader,
  },
};
</script>

<style scoped>
</style>