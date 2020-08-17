<template>
  <div class="container d-flex justify-content-center align-items-center">
    <img src="@/assets/backdrop.gif" alt="Loader" />
  </div>
</template>

<script>
export default {
  name: "App-Page-Loader",
};
</script>

<style scoped>
.container {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 99;
  background-color: rgba(255, 255, 255, 0.5);
  max-width: none;
}
</style>