<template>
  <div class="container bg-light py-4 px-5 my-3">
    <h2 class="text-danger text-center">{{ mode === 'login' ? 'Login' : 'Register' }}</h2>
    <hr class="mt-2 mb-4" id="line" />
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="exampleInputEmail1">Email Address</label>
        <input
          required
          type="email"
          class="form-control"
          aria-describedby="emailHelp"
          placeholder="Enter email"
          v-model="email"
          @keyup="checkEmail"
          :class="[{'border-danger': emailValid===false}, {'border-success': emailValid}]"
        />
        <small
          id="emailHelp"
          class="form-text"
          :class="[{'text-danger': emailValid===false}, {'text-success': emailValid} ,{'text-muted': emailValid===null}]"
        >{{emailValid===null ? `We'll never share your email with anyone else` : !emailValid ? 'Email Address is Not Valid': 'Valid Email Address'}}</small>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input
          required
          type="password"
          class="form-control"
          placeholder="Password"
          v-model="password"
        />
      </div>
      <div class="form-group">
        <button
          type="submit"
          class="btn btn-sm btn-primary"
        >{{ mode === 'login' ? 'Login' : 'Register' }}</button>
        <button
          @click="changeMode"
          type="button"
          class="btn btn-sm btn-info mx-2"
        >Switch to {{ mode === 'login' ? 'Register' : 'Login' }}</button>
      </div>
    </form>
  </div>
</template>

<script>
import validator from "validator";
export default {
  name: "Authentication",
  data() {
    return {
      mode: "login",
      email: "",
      password: "",
      emailValid: null,
    };
  },
  methods: {
    handleSubmit() {
      console.log(this.email, this.password);
    },
    changeMode() {
      this.mode = this.mode === "login" ? "register" : "login";
    },
    checkEmail() {
      this.emailValid = validator.isEmail(this.email);
    },
  },
};
</script>

<style scoped>
@media screen and (min-width: 800px) {
  .container {
    width: 50%;
  }
}
input {
  box-shadow: none !important;
}
#line {
  width: 50%;
  background-color: rgba(75, 73, 73, 0.342);
}
.btn.btn-sm {
  font-weight: 100;
  font-size: 1em;
  letter-spacing: 0.5px;
  box-shadow: none !important;
}
</style>