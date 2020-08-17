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
		pageLoading: true,
		user: null,
		errors: null,
		products: null,
		cart: null,
		productFetching: true,
	},
	mutations: {
		SET_PAGE_LOADING(state, payload) {
			state.pageLoading = payload;
		},
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
				product.quantity = 1;
				state.cart.push(product);
			}
			state.cart.status = 'unsaved';
		},
		REMOVE_CART_ITEM: function(state, id) {
			state.cart = state.cart.filter(item => item.id !== id);
			state.cart.status = 'unsaved';
		},
		CHANGE_ITEM_QUANTITY: function(state, { id, quantity }) {
			state.cart = state.cart.filter(item => {
				if (item.id === id) return (item.quantity += quantity);
				else return item;
			});
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
			await context.dispatch('fetchProducts');
			context.commit('SET_PAGE_LOADING', false);
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
				const res = await axios.get('/api/v1/products', createConfig());
				context.commit('SET_PRODUCTS', res.data.products);
				context.commit('SET_PRODUCT_LOADING', false);
			} catch (e) {
				console.log(e);
			}
		},
		async addToCart(context, product) {
			try {
				context.commit('ADD_TO_CART', product);
				await context.dispatch('saveCartProduct');
			} catch (e) {
				console.log(e);
			}
		},
		async saveCartProduct(context) {
			try {
				await axios.post(
					'/api/v1/save-cart',
					{ cart: context.state.cart },
					createConfig()
				);
			} catch (e) {
				console.log(e);
			}
		},
	},
});

export default store;
