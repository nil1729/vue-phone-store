import Authentication from '../components/pages/auth.vue';
import Home from '@/components/pages/Home.vue';
const routes = [
	{
		name: 'Authenticatiion',
		component: Authentication,
		path: '/login',
		meta: {
			requiresGuest: true,
		},
	},
	{
		name: 'Home',
		component: Home,
		path: '/',
		meta: {
			requiresAuth: true,
		},
	},
];

export default routes;
