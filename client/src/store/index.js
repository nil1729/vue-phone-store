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
	},
	mutations: {
		SET_USER_STATE: function(state, user) {
			state.user = user;
		},
	},
	getters: {},
	actions: {
		async userAuthenticate(context, { type, data }) {
			let user = { ...data.user.providerData[0] };
			const idToken = await firebase.auth().currentUser.getIdToken(true);
			let userID = data.user.uid;
			user.id = userID;
			if (type === 'register') {
				let res = await axios.post(
					'/api/v1/login',
					{ idToken: idToken, user: user },
					config
				);
				user = res.data.user;
			}
			context.commit('SET_USER_STATE', user);
		},
	},
});

export default store;
