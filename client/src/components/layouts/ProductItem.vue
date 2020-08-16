<template>
  <div class="card" style="width: 18rem;">
    <div class="image">
      <img src="https://i.insider.com/5e625eccfee23d0c3b666de8?width=1136&format=jpeg" alt />
      <button class="btn btn-primary cart-btn">
        <i class="fal fa-cart-arrow-down"></i>
      </button>
    </div>
    <div class="card-body d-flex justify-content-between align-items-center">
      <p class="card-text lead mb-0">Google Pixel- Black</p>
      <p class="card-text lead">$ 10</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Product-Item",
};
</script>

<style scoped>
.image {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 18rem;
  overflow: hidden;
  position: relative;
}
.cart-btn {
  position: absolute;
  z-index: 9;
  bottom: -4rem;
  right: -4rem;
  transition: 0.5s linear all;
  color: white;
  font-size: 1.3rem;
  padding: 2px 5px;
  box-shadow: none !important;
}
.image img {
  height: 100%;
  width: 100%;
  transition: 0.5s linear all;
  margin: auto;
}
.image:hover img {
  transform: scale(1.1);
}
.image:hover .cart-btn {
  bottom: 0;
  right: 0;
}
.card-body {
  padding: 1.25rem 0.8rem;
}
.card-body .lead {
  font-weight: 500;
}
</style>