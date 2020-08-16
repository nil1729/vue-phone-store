import Vue from 'vue';
import Vuex from 'vuex';

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
		userAuthenticate(context, value) {
			let user = { ...value.user.providerData[0] };
			let userID = value.user.uid;
			user.uid = userID;
			context.commit('SET_USER_STATE', user);
		},
	},
});

export default store;
