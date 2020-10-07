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
              <td v-if="show">{{ user && user.displayName }}</td>
              <td v-else>
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    :placeholder="user && user.displayName"
                    v-model="displayName"
                    :class="[
                      {
                        'is-valid': validName === true,
                        'is-invalid': validName === false,
                      },
                    ]"
                    @keyup="checkName"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">Phone Number</th>
              <td v-if="show" class="text-danger">
                {{ user && user.phoneNumber ? user.phoneNumber : "Null" }}
              </td>
              <td v-else>
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    v-model="phoneNumber"
                    :class="[
                      {
                        'is-valid': validPhone === true,
                        'is-invalid': validPhone === false,
                      },
                    ]"
                    @keyup="checkPhone"
                    :placeholder="
                      user && user.phoneNumber ? user.phoneNumber : 'Null'
                    "
                  />
                </div>
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
        <div class="row">
          <router-link
            v-if="show"
            to="/profile/settings"
            class="btn-sm btn-primary m-auto"
          >
            Edit Profile
          </router-link>
          <button
            @click="handleSubmit"
            :disabled="loading"
            v-else
            type="submit"
            class="btn-sm btn-warning m-auto"
          >
            {{ loading ? "Loading ..." : "Update" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import validator from "validator";
import { mapGetters } from "vuex";
export default {
  name: "Profile-Page",
  computed: {
    ...mapGetters(["user"]),
    show() {
      return this.$route.name == "Profile";
    },
  },
  data() {
    return {
      phoneNumber: this.$store.state.user.phoneNumber,
      displayName: this.$store.state.user.displayName,
      validName: null,
      validPhone: null,
      loading: false,
    };
  },
  methods: {
    async handleSubmit() {
      try {
        this.loading = true;
        if (this.checkName() && this.checkPhone()) {
          await this.$store.dispatch("userUpdate", {
            phoneNumber: this.phoneNumber,
            displayName: this.displayName,
          });
          this.validName = null;
          this.validPhone = null;
        }
        this.loading = false;
      } catch (e) {
        console.log(e);
      }
    },
    checkPhone() {
      this.validPhone =
        this.phoneNumber.length >= 10 &&
        validator.isMobilePhone(this.phoneNumber);
      return this.validPhone;
    },
    checkName() {
      let words = this.displayName.split(" ");
      this.validName = true;
      words.forEach((word) => {
        if (word.trim().length === 0 || !validator.isAlpha(word)) {
          this.validName = false;
        }
      });
      return this.validName;
    },
  },
};
</script>

<style scoped>
.dp-col {
  display: contents;
}
.image {
  height: 12rem;
  width: 12rem;
}
table th {
  font-weight: 500;
}
table th,
table td {
  vertical-align: middle;
  border-top: none;
  border-bottom: 1px solid #dee2e6;
}
img {
  border-radius: 50%;
}
input {
  box-shadow: none !important;
}
button,
a {
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
  text-decoration: none !important;
}
</style>