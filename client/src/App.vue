<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App-Phone-Store",
  watch: {
    "$store.state.user": function () {
      if (!this.$store.state.user) {
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style>
::-webkit-scrollbar {
  width: 0;
}
</style>