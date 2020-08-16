import Authentication from '../components/pages/auth.vue';
import Home from '@/components/pages/Home.vue';
import Cart from '@/components/pages/cart.vue';
import Products from '@/components/pages/Products.vue';
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
		children: [
			{
				path: '/cart',
				name: 'Cart',
				component: Cart,
			},
			{
				path: '',
				name: 'Products',
				component: Products,
			},
		],
		path: '/',
		meta: {
			requiresAuth: true,
		},
		components: {
			default: Home,
		},
	},
];

export default routes;
