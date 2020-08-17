import Vue from 'vue';
import Vuex from 'vuex';
import firebase from '@/firebase';
import axios from 'axios';
const createConfig = () => {
	return {
		headers: {
			'Content-Type': 'application/json',
			'x-auth-token': localStorage.getItem('authToken'),
		},
	};
};

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		user: null,
		errors: null,
		products: null,
		cart: null,
		productFetching: true,
	},
	mutations: {
		SET_USER_STATE: function(state, user) {
			state.user = user;
		},
		SET_CART_STATE: function(state, cart) {
			state.cart = cart;
		},
		SET_ERRORS(state, error) {
			state.errors = error;
		},
		SET_PRODUCT_LOADING(state, payload) {
			state.productFetching = payload;
		},
		SET_PRODUCTS: function(state, products) {
			state.products = products;
		},
		ADD_TO_CART: function(state, product) {
			const hasAlready = state.cart.find(item => item.id === product.id);
			if (!hasAlready) {
				product.hasCarted = true;
				state.cart.push(product);
			}
			state.cart.status = 'unsaved';
		},
	},
	getters: {},
	actions: {
		async userAuthenticate(context, { type, data }) {
			let user = { ...data.providerData[0] };
			const idToken = await firebase.auth().currentUser.getIdToken(true);
			localStorage.setItem('authToken', idToken);
			user.id = data.uid;
			if (type === 'register') {
				let res = await axios.get('/api/v1/register', createConfig());
				user = res.data.user;
			} else {
				let res = await axios.get('/api/v1/login', createConfig());
				user = res.data.user;
			}
			context.commit('SET_USER_STATE', user.details);
			context.commit('SET_CART_STATE', user.cart);
			context.dispatch('fetchProducts');
		},
		async userSignOut(context) {
			localStorage.removeItem('authToken');
			await firebase.auth().signOut();
			context.commit('SET_USER_STATE', null);
		},
		async fetchProducts(context) {
			try {
				context.commit('SET_PRODUCT_LOADING', true);
				if (!localStorage.authToken) {
					return;
				}
				const config = {
					headers: {
						'Content-Type': 'application/json',
						'x-auth-token': localStorage.getItem('authToken'),
					},
				};
				const res = await axios.get('/api/v1/products', config);
				context.commit('SET_PRODUCTS', res.data.products);
				context.commit('SET_PRODUCT_LOADING', false);
			} catch (e) {
				console.log(e);
			}
		},
	},
});

export default store;
