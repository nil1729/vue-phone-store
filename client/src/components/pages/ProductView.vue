<template>
  <div class="container mt-4">
    <div v-if="loading" class="loader text-center">
      <img src="@/assets/view.gif" alt />
    </div>
    <app-not-found v-else-if="!product" />
    <div v-else-if="product">
      <h2 class="text-center text-warning mb-5">{{product.model}}</h2>
      <div class="row">
        <div class="col-xl-4 col-md-12 text-center">
          <img :src="product.photoURL" alt />
        </div>
        <div class="col-xl-8 col-md-12">
          <h3 class="text-dark">Model: {{product.model}}</h3>
          <h5 class="text-muted">
            Made By
            <span class="text-dark">{{product.brand}}</span>
          </h5>
          <h5 class="text-primary">
            <span class="text-muted">Price:</span>
            ₹ {{formatPrice(product.price)}}
          </h5>
          <h6 class="text-dark border-bottom border-dark">Some info about the Product</h6>
          <p class="text-dark">{{product.description}}</p>
          <router-link to="/" class="btn btn-outline-primary btn-sm mr-3">Back to Products</router-link>
          <button
            class="btn btn-sm btn-outline-warning"
          >In Cart {{ hasCarted(product._id) ? 't' : 'f'}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import NotFound from "@/components/pages/NotFound.vue";
export default {
  name: "App-Product-View",
  components: {
    "app-not-found": NotFound,
  },
  computed: {
    ...mapGetters(["formatPrice", "hasCarted"]),
    loading() {
      return this.$store.state.viewProductFetching;
    },
    product() {
      return this.$store.state.viewSingleProduct;
    },
  },
  async created() {
    await this.$store.dispatch("fetchSingleProduct", this.$route.params.id);
  },
};
</script>

<style scoped>
img {
  height: 100%;
}
h2,
h6,
h5 {
  font-weight: 500;
}
h6 {
  width: fit-content;
  padding-bottom: 2px;
  margin-bottom: 5px;
}
.btn {
  box-shadow: none !important;
  border-radius: 5px;
  font-size: 0.9em;
}
</style>