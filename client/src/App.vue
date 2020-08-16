<template>
  <div>
    <app-alert />
    <router-view />
  </div>
</template>

<script>
import Alert from "./components/utils/Alerts";
export default {
  name: "App-Phone-Store",
  watch: {
    "$store.state.user": function () {
      if (!this.$store.state.user) {
        this.$router.push("/login");
      }
    },
  },
  components: {
    "app-alert": Alert,
  },
};
</script>

<style>
::-webkit-scrollbar {
  width: 0;
}
</style>