<template>
  <div class="container mt-3">
    <div class="row">
      <div class="col-md-4 dp-col">
        <div class="image m-auto">
          <img
            class="img-fluid"
            :src="user && user.photoURL"
            :alt="user && user.displayName"
          />
        </div>
      </div>
      <div class="col-md-8 bg-light p-4">
        <table class="table">
          <tbody>
            <tr>
              <th scope="row">Display Name</th>
              <td>{{ user && user.displayName }}</td>
            </tr>
            <tr>
              <th scope="row">Phone Number</th>
              <td class="text-danger">
                {{ user && user.phoneNumber ? user.phoneNumber : "Null" }}
              </td>
            </tr>
            <tr>
              <th scope="row">Email Address</th>
              <td>{{ user && user.email }}</td>
            </tr>
            <tr>
              <th scope="row">Sign in Method</th>
              <td class="text-capitalize">
                {{ user && user.providerId.split(".")[0] }}
              </td>
            </tr>
            <tr>
              <th scope="row">Static User ID</th>
              <td>{{ user && user.id }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Settings-Page",
  computed: {
    ...mapGetters(["user"]),
  },
};
</script>

<style>
</style>