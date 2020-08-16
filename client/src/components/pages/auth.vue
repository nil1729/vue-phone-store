<template>
  <div class="container bg-light py-4 px-5 my-3">
    <h2 class="text-info text-center">{{ mode === 'login' ? 'Login' : 'Register' }}</h2>
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
          :class="[{'border-danger': emailValid!=='valid' && emailValid}, {'border-success': emailValid}]"
        />
        <small
          id="emailHelp"
          class="form-text"
          :class="[{'text-danger': emailValid!=='valid'}, {'text-success': emailValid} ,{'text-muted': emailValid===null}]"
        >{{emailValid===null ? emailValidDialog['initial'] : emailValidDialog[emailValid]}}</small>
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
          :disabled="submitted"
          class="btn btn-sm btn-primary"
        >{{ submitted ? 'Loading ...' : mode === 'login' ? 'Login' : 'Register' }}</button>
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
import firebase from "@/firebase";
export default {
  name: "Authentication",
  data() {
    return {
      mode: "login",
      email: "",
      password: "",
      emailValid: null,
      emailValidDialog: {
        initial: `We'll never share your email with anyone else`,
        gmail: `Please don't use Gmail account`,
        valid: "Your Email Address is valid",
        invalid: "Your Email Address is not valid",
      },
      submitted: false,
    };
  },
  methods: {
    async handleSubmit() {
      if (this.emailValid !== "valid" || this.password.trim().length === 0) {
        return;
      }
      this.submitted = true;
      let res;
      try {
        if (this.mode === "register") {
          res = await firebase
            .auth()
            .createUserWithEmailAndPassword(this.email, this.password);
        } else {
          res = await firebase
            .auth()
            .signInWithEmailAndPassword(this.email, this.password);
        }
        this.$store.dispatch("userAuthenticate", res);
      } catch (error) {
        console.error(error);
      }
      this.emailValid = null;
      this.email = "";
      this.password = "";
      this.submitted = false;
    },
    changeMode() {
      this.mode = this.mode === "login" ? "register" : "login";
    },
    checkEmail() {
      let validTest = validator.isEmail(this.email);
      if (!validTest) {
        return (this.emailValid = "invalid");
      }
      const domain = this.email.split("@")[1];
      if (domain === "gmail.com") {
        return (this.emailValid = "gmail");
      }
      this.emailValid = "valid";
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