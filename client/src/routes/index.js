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
	if (to.matched.some(record => record.meta.requiresAuth)) {
		if (firebase.auth().currentUser) {
			next();
		} else {
			next({
				path: '/login',
				query: { redirect: to.fullPath.split('/')[1] },
			});
		}
	} else if (to.matched.some(record => !record.meta.requiresGuest)) {
		if (firebase.auth().currentUser) {
			next({
				path: from.fullPath,
				query: { redirect: to.fullPath.split('/')[1] },
			});
		} else {
			next();
		}
	} else {
		next();
	}
});

export default router;
