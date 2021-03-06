<template>
  <div class="container">
    <h1 v-if="isEmpty" class="text-center cart-empty-text mt-5">
      Your Cart is Currently Empty.
    </h1>
    <div v-else class="mt-3">
      <h1 class="text-center cart-text m-auto">Checkout Products</h1>
      <div class="row">
        <div class="col-md-8">
          <table class="table mt-4">
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
                <td>
                  <router-link :to="'/view/' + item._id">{{
                    item.model
                  }}</router-link>
                </td>
                <td class="price">₹ {{ formatPrice(item.price) }}</td>
                <td class="font-weight-bold">{{ item.quantity }}</td>
                <td class="price">
                  ₹ {{ formatPrice(item.price * item.quantity) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-md-4">
          <div class="container flex-column mx-auto text-center mt-5">
            <p class="lead text-primary">
              Products Total :
              <span class="ml-2 font-weight-normal text-dark"
                >₹ {{ formatPrice(productTotal) }}</span
              >
            </p>
            <p class="lead text-primary">
              Tax (GST 5%) :
              <span class="ml-2 font-weight-normal text-dark"
                >₹ {{ formatPrice(taxTotal) }}</span
              >
            </p>
            <p class="lead text-primary">
              Grand Total :
              <span class="ml-2 font-weight-normal text-dark"
                >₹ {{ formatPrice((taxTotal + productTotal).toFixed(2)) }}</span
              >
            </p>
            <div v-if="!isPaid">
              <div v-if="!scriptLoaded" class='script__loader mx-auto my-3'>
                <img src="@/assets/script-loader.gif" alt="">
              </div>
              <div ref="paypal"></div>
            </div>
            <div v-else class="mt-4">
              <h3 class="text-success">
                <i class="fa-2x fal fa-check-circle"></i>
              </h3>
              <h3 v-if="processing" class="text-success">
                Processing your Order ...
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    <app-checkout-loader v-if="processing" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CheckoutLoader from "../utils/FullPageLoad";

export default {
  name: "Cart-Page",
  data() {
    return {
      scriptLoaded: false,
      orderStaticID: null,
      processing: false,
      isPaid: false,
    };
  },
  components: {
    "app-checkout-loader": CheckoutLoader,
  },
  mounted() {
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?currency=INR&client-id=Afg-PbD8I3s39a9wzNpv_K6Ek-vzpyPYC_P_j98Lg4HaX1SPnH_hBSK3jkX7NL1Vqwjoa-oKKmOy8sql";
    script.addEventListener("load", this.setLoaded);
    document.body.appendChild(script);
  },
  methods: {
    async setLoaded() {
      this.scriptLoaded = true;
      const vm = this;
      window.paypal
        .Buttons({
          async createOrder(data, actions) {
            const checkoutDesc = await vm.$store.dispatch("fetchCheckoutItems");
            vm.orderStaticID = checkoutDesc.description.split("--")[2];
            return actions.order.create({
              purchase_units: [checkoutDesc],
            });
          },
          async onApprove(data) {
            vm.processing = true;
            vm.isPaid = true;

            await vm.$store.dispatch("verifyPurchase", {
              orderStaticID: vm.orderStaticID,
              orderID: data.orderID,
            });

            vm.handleEmptyCart();

            vm.processing = false;
            vm.isPaid = false;

            vm.$router.push("/profile/orders"); // Redirect to Orders page TODO
          },
        })
        .render(this.$refs.paypal);
    },
    async handleEmptyCart() {
      this.$store.commit("CLEAR_CART");
      await this.$store.dispatch("saveCartProduct");
    },
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === "Shipping-Address") next();
    else {
      next({ name: "Cart" });
    }
  },
  computed: {
    ...mapGetters(["formatPrice"]),
    isEmpty: function() {
      return this.$store.state.cart && this.$store.state.cart.length === 0;
    },
    cartItems: function() {
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
};
</script>

<style scoped>
.script__loader {
  height: 120px;
  width: 120px;
}
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
.table th,
.table td {
  vertical-align: middle;
  text-align: center;
}
.image {
  height: 100px;
  width: 100px;
  margin: auto;
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
