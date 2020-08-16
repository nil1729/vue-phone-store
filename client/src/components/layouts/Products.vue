<template>
  <div class="container mt-3">
    <h1 class="text-center mb-5">Our Products</h1>
    <div class="row mb-3">
      <div v-for="i in 8" :key="i" class="col-md-3 mb-4">
        <app-product-item />
      </div>
    </div>
  </div>
</template>

<script>
import ProductItem from "./ProductItem";
export default {
  name: "Product",
  components: {
    "app-product-item": ProductItem,
  },
};
</script>

<style scoped>
.container {
  width: 95%;
  max-width: none;
}
</style>