import Vue from 'vue';
import Vuex from 'vuex';
import crypto from 'crypto';
import path from 'path';
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
		isAdmin: false,
		user: null,
		errors: null,
		products: null,
		cart: null,
		productAddAlert: null,
		productFetching: true,
		productUploading: false,
	},
	mutations: {
		SET_ADMIN(state, status) {
			state.isAdmin = status;
		},
		SET_PAGE_LOADING(state, payload) {
			state.pageLoading = payload;
		},
		SET_USER_STATE: function(state, user) {
			state.user = user;
			if (!user) {
				state.isAdmin = false;
			}
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
			product.quantity = 1;
			state.cart.push(product);
		},
		CART_NOTIFICATION: function(state, product) {
			state.productAddAlert = product;
		},
		REMOVE_CART_ITEM: function(state, id) {
			state.cart = state.cart.filter(item => item.id !== id);
		},
		CHANGE_ITEM_QUANTITY: function(state, { id, quantity }) {
			state.cart = state.cart.filter(item => {
				if (item.id === id) return (item.quantity += quantity);
				else return item;
			});
		},
		CLEAR_CART: function(state) {
			state.cart = [];
		},
		SET_PRODUCT_UPLOADING(state, payload) {
			state.productUploading = payload;
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
			context.commit('SET_ADMIN', user.siteAdmin);
			context.commit('SET_USER_STATE', user.details);
			context.commit('SET_CART_STATE', user.cart);
			context.commit('SET_PAGE_LOADING', false);
			await context.dispatch('fetchProducts', 1);
		},
		async userSignOut(context) {
			localStorage.removeItem('authToken');
			await firebase.auth().signOut();
			context.commit('SET_USER_STATE', null);
		},
		async fetchProducts(context, page) {
			try {
				if (context.state.products && context.state.products.current === page) {
					return;
				}
				context.commit('SET_PRODUCT_LOADING', true);
				if (!localStorage.authToken) {
					return;
				}
				const res = await axios.get(
					`/api/v1/products?page=${page}`,
					createConfig()
				);
				context.commit('SET_PRODUCTS', res.data.products);
				context.commit('SET_PRODUCT_LOADING', false);
			} catch (e) {
				console.log(e);
			}
		},
		async addToCart(context, product) {
			try {
				const hasAlready = context.state.cart.find(
					item => item.id === product.id
				);
				if (!hasAlready) {
					context.commit('ADD_TO_CART', product);
					await context.dispatch('saveCartProduct');
					context.commit('CART_NOTIFICATION', product);
				}
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
		async addAdminProducts(context, product) {
			try {
				context.commit('SET_PRODUCT_UPLOADING', true);
				const photoURL = await context.dispatch(
					'fileUploadToStorage',
					product.file
				);
				console.log(photoURL);
				context.commit('SET_PRODUCT_UPLOADING', false);
			} catch (e) {
				console.log(e);
			}
		},
		async fileUploadToStorage(context, file) {
			try {
				const storage = firebase.storage();
				const extName = path.extname(file.name);
				const fileOnlyName = crypto
					.randomBytes(15)
					.toString('hex')
					.toUpperCase();
				const storageRef = storage.ref(`uploads/${fileOnlyName}${extName}`);
				const metadata = {
					contentType: `${file.type}`,
				};
				await storageRef.put(file, metadata);
				const downloadURL = await storageRef.getDownloadURL();
				return downloadURL;
			} catch (e) {
				console.log(e);
			}
		},
	},
});

export default store;
