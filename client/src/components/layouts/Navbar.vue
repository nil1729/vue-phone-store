<template>
  <nav class="navbar navbar-expand-lg navbar-dark">
    <router-link to="/" class="navbar-brand">
      <i class="fas fa-2x fa-phone-office"></i>
    </router-link>
    <button class="navbar-toggler" type="button">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto ml-5">
        <router-link tag="li" to="/" exact class="nav-item" active-class="active">
          <a class="nav-link lead">Products</a>
        </router-link>
      </ul>
    </div>
    <button type="button" class="btn" id="cart-btn">
      <i class="fas fa-cart-plus"></i>
      My Cart
      <span class="badge badge-light">{{''}}</span>
    </button>
  </nav>
</template>

<script>
export default {
  name: "App-Navbar",
};
</script>

<style scoped>
nav {
  background-color: #3f99ff;
}
#cart-btn {
  border: 1.5px solid rgb(218, 208, 208);
  color: rgb(250, 250, 250);
}
#cart-btn i {
  font-size: 1.2rem;
}
#cart-btn {
  font-size: 1.1rem;
}
</style>