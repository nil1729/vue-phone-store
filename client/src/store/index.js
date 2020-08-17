import Vue from 'vue';
import Vuex from 'vuex';
import firebase from '@/firebase';
import axios from 'axios';
const config = {
	headers: {
		'Content-Type': 'application/json',
	},
};

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		user: null,
		errors: null,
	},
	mutations: {
		SET_USER_STATE: function(state, user) {
			state.user = user;
		},
		SET_ERRORS(state, error) {
			state.errors = error;
		},
	},
	getters: {},
	actions: {
		async userAuthenticate(context, { type, data }) {
			let user = { ...data.providerData[0] };
			const idToken = await firebase.auth().currentUser.getIdToken(true);
			let userID = data.uid;
			user.id = userID;
			if (type === 'register') {
				let res = await axios.post(
					'/api/v1/login',
					{ idToken: idToken },
					config
				);
				user = res.data.user;
			}
			user.authToken = idToken;
			context.commit('SET_USER_STATE', user);
		},
		async userSignOut(context) {
			await firebase.auth().signOut();
			context.commit('SET_USER_STATE', null);
		},
	},
});

export default store;
