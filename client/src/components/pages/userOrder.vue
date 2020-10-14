<template>
  <div class="container">
    <h1 v-if="isEmpty" class="text-center cart-empty-text mt-5">
      You don't purchase any products yet.
    </h1>
    <div v-else class="mt-3">
      <h1 class="text-center cart-text m-auto">Your Orders</h1>
      <p class="lead mb-0 mt-4 ml-2">OrderID #5fr2398149314h346123f</p>
      <table class="table">
        <thead>
          <tr class="text-uppercase">
            <th scope="col">products</th>
            <th scope="col">model</th>
            <th scope="col">price</th>
            <th scope="col">quantity</th>
            <th scope="col">total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartItems" :key="item._id">
            <th scope="row">
              <div class="image">
                <img
                  :src="item.photoURL"
                  :alt="item._id"
                  class="img-thumbnail img-fluid"
                />
              </div>
            </th>
            <td>{{ item.model }}</td>
            <td class="price">₹ {{ formatPrice(item.price) }}</td>
            <td class="font-weight-bold lead">
              {{ item.quantity }}
            </td>
            <td class="price">
              ₹ {{ formatPrice(item.price * item.quantity) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Cart-Page",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["formatPrice"]),
    isEmpty: function () {
      return this.$store.state.cart && this.$store.state.cart.length === 0;
    },
    cartItems: function () {
      return this.$store.state.cart;
    },
    productTotal() {
      let total = 0;
      this.$store.state.cart.forEach(
        (item) => (total += item.price * item.quantity)
      );
      return parseFloat(total.toFixed(2));
    },
    taxTotal() {
      return parseFloat(((this.productTotal * 5) / 100).toFixed(2));
    },
  },
  methods: {},
};
</script>

<style scoped>
.cart-empty-text,
.cart-text {
  font-weight: 400;
}
.cart-text {
  border-bottom: 1px solid grey;
  width: fit-content;
}
table {
  border-bottom: 1px solid #dee2e6;
}
.table thead th {
  border-top: none;
}
/* .table th,
.table td {
  vertical-align: middle;
  text-align: center;
} */
.image {
  height: 100px;
  width: 100px;
  /* margin: auto; */
}
img {
  height: 100%;
}
.price:last-child {
  font-weight: 700 !important;
}
.price {
  letter-spacing: 0.5px;
  font-size: 1rem;
}
button {
  box-shadow: none !important;
}
.clear-cart-btn {
  font-weight: 500;
  font-size: 1rem;
  letter-spacing: 0.5px;
}
.trash {
  color: red;
}
.lead {
  font-weight: 500;
}
</style>