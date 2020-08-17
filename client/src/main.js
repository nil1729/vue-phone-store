import Vue from 'vue';
import App from './App.vue';
import router from './routes';
import store from './store';
import firebase from './firebase';
Vue.config.productionTip = false;

let app;

firebase.auth().onAuthStateChanged(function(user) {
	if (!app) {
		app = new Vue({
			router,
			store,
			mounted() {
				if (user) {
					this.$store.dispatch('userAuthenticate', {
						type: 'loadUser',
						data: user,
					});
				} else {
					this.$store.commit('SET_PAGE_LOADING', false);
				}
			},
			render: h => h(App),
		}).$mount('#app');
	}
});
