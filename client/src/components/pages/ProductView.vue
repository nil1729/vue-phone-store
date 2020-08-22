<template>
  <div class="container mt-4">
    <div v-if="loading" class="loader text-center">
      <img src="@/assets/view.gif" alt />
    </div>
    <app-not-found v-else-if="!product" />
    <div v-else-if="product">
      <h2 class="text-center text-danger mb-5">{{product.model}}</h2>
      <div class="row">
        <div class="col-xl-4 col-md-12 text-center">
          <div class="image">
            <img :src="product.photoURL" alt />
          </div>
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
          <h6 class="text-danger border-bottom border-dark">Some info about the Product</h6>
          <p class="text-dark">{{product.description}}</p>
          <router-link to="/" class="btn btn-outline-primary btn-sm mr-3">
            <p class="mb-0">Back to Products</p>
          </router-link>
          <button @click="addToCart(product)" class="btn btn-sm btn-outline-warning">
            <i v-if="!hasCarted(product._id)" class="fa-2x fal fa-cart-arrow-down"></i>
            <p v-else class="mb-0">In Cart</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
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
  async mounted() {
    await this.$store.dispatch("fetchSingleProduct", this.$route.params.id);
  },
  methods: {
    ...mapActions(["addToCart"]),
  },
};
</script>

<style scoped>
.image {
  height: 20rem;
}
img {
  height: 100%;
}
h2,
h6,
h5 {
  font-weight: 400;
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
  font-weight: 500;
}
p {
  line-height: 1.5rem;
  letter-spacing: 0.3px;
}
</style>