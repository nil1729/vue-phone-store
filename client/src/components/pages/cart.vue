<template>
  <div class="container">
    <h1 v-if="isEmpty" class="text-center cart-empty-text mt-5">Your Cart is Currently Empty</h1>
    <div v-else class="mt-3">
      <h1 class="text-center cart-text m-auto">Your Cart</h1>
      <table class="table mt-4">
        <thead>
          <tr class="text-uppercase">
            <th scope="col">products</th>
            <th scope="col">model</th>
            <th scope="col">price</th>
            <th scope="col">quantity</th>
            <th scope="col">remove</th>
            <th scope="col">total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartItems" :key="item.id">
            <th scope="row">
              <div class="image">
                <img :src="item.photoURL" alt="item.id" class="img-thumbnail img-fluid" />
              </div>
            </th>
            <td>{{ item.model }}</td>
            <td class="price">${{item.price}}</td>
            <td>
              <div class="btn-group" role="group" aria-label="Basic example">
                <button
                  :disabled="item.quantity<2"
                  @click="changeQuantity(item.id, -1)"
                  type="button"
                  class="btn btn-outline-info"
                >-</button>
                <button type="button" class="btn btn-outline-info">{{ item.quantity }}</button>
                <button
                  @click="changeQuantity(item.id, 1)"
                  :disabled="item.quantity>9"
                  type="button"
                  class="btn btn-outline-info"
                >+</button>
              </div>
            </td>
            <td>
              <button @click="remove(item.id)" class="btn btn-lg trash">
                <i class="fad fa-trash"></i>
              </button>
            </td>
            <td class="price">${{item.price * item.quantity}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "Cart-Page",
  computed: {
    isEmpty: function () {
      return this.$store.state.cart && this.$store.state.cart.length === 0;
    },
    cartItems: function () {
      return this.$store.state.cart;
    },
  },
  methods: {
    remove(id) {
      this.$store.commit("REMOVE_CART_ITEM", id);
    },
    changeQuantity(id, quantity) {
      this.$store.commit("CHANGE_ITEM_QUANTITY", { id, quantity });
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("saveCartProduct");
    next();
  },
};
</script>

<style scoped>
.cart-empty-text,
cart-text {
  font-weight: 500;
}
.cart-text {
  border-bottom: 1px solid grey;
  width: fit-content;
}
.table th {
  border-top: none;
}
.table th,
.table td {
  vertical-align: middle;
  text-align: center;
}
.image {
  height: 100px;
  width: 100px;
}
img {
  height: 100%;
}
.price {
  font-weight: 700;
  letter-spacing: 0.5px;
  font-size: 1rem;
}
button {
  box-shadow: none !important;
}
.trash {
  color: red;
}
</style>