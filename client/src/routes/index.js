import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import firebase from '@/firebase';
Vue.use(VueRouter);

const router = new VueRouter({
	routes,
	mode: 'history',
});

router.beforeEach((to, from, next) => {
	// Check for gaurds AUTHENTICATE
	if (to.matched.some(record => record.meta.requiresAuth)) {
		// Check for is have Any User Logged in
		if (firebase.auth().currentUser) {
			// Proceed to Route
			next();
		} else {
			// Proceed to LOGIN page
			next({
				path: '/login',
				query: { redirect: to.fullPath.split('/')[1] },
			});
		}
		// Check for gaurds NOT-AUTHENTICATED ( GUEST )
	} else if (to.matched.some(record => record.meta.requiresGuest)) {
		if (firebase.auth().currentUser) {
			// if is Logged in then go to Home Page
			next({
				path: from.fullPath,
				query: { redirect: to.fullPath.split('/')[1] },
			});
		} else {
			// Other wise That Page for Non Authenticated Users
			next();
		}
	} else {
		// Except these Guards
		next();
	}
});

export default router;
