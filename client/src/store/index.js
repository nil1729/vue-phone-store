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
		viewProductFetching: false,
		viewSingleProduct: null,
	},
	mutations: {
		SET_ADMIN(state, status) {
			state.isAdmin = status;
		},
		SET_PAGE_LOADING(state, payload) {
			state.pageLoading = payload;
		},
		SET_USER_STATE: function (state, user) {
			state.user = user;
			if (!user) {
				state.isAdmin = false;
			}
		},
		SET_USER_UPDATE: function (state, data) {
			if (data.photoURL) {
				state.user.photoURL = data.photoURL;
			} else {
				state.user.displayName = data.displayName;
				state.user.phoneNumber = data.phoneNumber;
			}
		},
		SET_CART_STATE: function (state, cart) {
			state.cart = cart;
		},
		SET_ERRORS(state, error) {
			state.errors = error;
		},
		SET_PRODUCT_LOADING(state, payload) {
			state.productFetching = payload;
		},
		SET_PRODUCTS: function (state, products) {
			state.products = products;
		},
		ADD_TO_CART: function (state, product) {
			product.quantity = 1;
			state.cart = [product, ...state.cart];
		},
		CART_NOTIFICATION: function (state, product) {
			state.productAddAlert = product;
		},
		REMOVE_CART_ITEM: function (state, id) {
			state.cart = state.cart.filter(item => item._id !== id);
		},
		CHANGE_ITEM_QUANTITY: function (state, {
			id,
			quantity
		}) {
			state.cart = state.cart.filter(item => {
				if (item._id === id) return (item.quantity += quantity);
				else return item;
			});
		},
		CLEAR_CART: function (state) {
			state.cart = [];
		},
		SET_PRODUCT_UPLOADING(state, payload) {
			state.productUploading = payload;
		},
		ADD_PRODUCT_IN_LIST(state, payload) {
			if (state.products.current === 1) {
				state.products.results.pop();
				state.products.results = [payload, ...state.products.results];
			}
		},
		SET_VIEW_PRODUCT_FETCHING(state, payload) {
			state.viewProductFetching = payload;
		},
		SET_SINGLE_VIEW_PRODUCT(state, payload) {
			state.viewSingleProduct = payload;
		},
	},
	getters: {
		formatPrice: () => price => {
			var format = new Intl.NumberFormat('en-IN', {
				style: 'currency',
				currency: 'INR',
				minimumFractionDigits: 2,
			});
			return format.format(price).substr(1);
		},
		hasCarted: state => id => {
			if (state.cart) {
				let index = state.cart.findIndex(item => item._id === id);
				if (index > -1) {
					return true;
				}
				return false;
			}
			return false;
		},
		user: (state) => {
			return state.user;
		}
	},
	actions: {
		async userAuthenticate(context, {
			type,
			data
		}) {
			let user = {
				...data.providerData[0]
			};
			const idToken = await firebase.auth().currentUser.getIdToken(true);
			localStorage.setItem('authToken', idToken);
			if (type === 'register') {
				let res = await axios.get('/api/v1/register', createConfig());
				user = res.data.user;
			} else if (type === 'google-register') {
				let res = await axios.post(
					'/api/v1/google-register', {
						user
					},
					createConfig()
				);
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

		async userUpdate(context, data) {
			try {
				let res = await axios.post('/api/v1/update-profile-details', data, createConfig());
				if (res.status === 200) {
					context.commit('SET_USER_UPDATE', data);
					context.commit('SET_ERRORS', {
						code: "Notification",
						message: res.data.msg
					});
				}
			} catch (e) {
				console.log(e);
			}
		},
		async updateDP(context, file) {
			try {
				const storage = firebase.storage();
				const extName = path.extname(file.name);
				const fileOnlyName = crypto
					.randomBytes(15)
					.toString('hex')
					.toUpperCase();
				const storageRef = storage.ref(`profiles/${context.state.user.id}/${fileOnlyName}${extName}`);
				const metadata = {
					contentType: `${file.type}`,
				};
				await storageRef.put(file, metadata);
				const photoURL = await storageRef.getDownloadURL();
				let res = await axios.post('/api/v1/update-profile-details', {
					photoURL
				}, createConfig());
				if (res.status === 200) {
					context.commit('SET_USER_UPDATE', {
						photoURL
					});
					context.commit('SET_ERRORS', {
						code: "Notification",
						message: res.data.msg
					});
				}
			} catch (e) {
				console.log(e);
			}
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
					item => item._id === product._id
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
					'/api/v1/save-cart', {
						cart: context.state.cart
					},
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
				const dbProduct = {
					...product.info,
					photoURL,
				};
				const res = await axios.post(
					'/api/v1/admin/add-product',
					dbProduct,
					createConfig()
				);
				context.commit('ADD_PRODUCT_IN_LIST', dbProduct);
				context.commit('SET_PRODUCT_UPLOADING', false);
				context.commit('SET_ERRORS', res.data);
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
		async fetchSingleProduct(context, id) {
			context.commit('SET_VIEW_PRODUCT_FETCHING', true);
			try {
				const res = await axios.get(
					'/api/v1/view/product/' + id,
					createConfig()
				);
				if (!res.data.product) {
					context.commit('SET_SINGLE_VIEW_PRODUCT', null);
				} else {
					context.commit('SET_SINGLE_VIEW_PRODUCT', res.data.product);
				}
			} catch (e) {
				context.commit('SET_SINGLE_VIEW_PRODUCT', null);
			}
			context.commit('SET_VIEW_PRODUCT_FETCHING', false);
		},
	},
});

export default store;