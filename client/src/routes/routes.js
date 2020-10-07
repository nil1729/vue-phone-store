import Home from '@/components/pages/Home.vue';

const routes = [{
		name: 'Authenticatiion',
		component: () => import('@/components/pages/auth.vue'),
		path: '/login',
		meta: {
			requiresGuest: true,
		},
	},
	{
		path: '/',
		children: [{
				path: '/cart',
				name: 'Cart',
				component: () => import('@/components/pages/cart.vue'),
			},
			{
				path: '',
				name: 'Products',
				component: () => import('@/components/pages/Products.vue'),
			},
			{
				path: '/profile',
				name: 'Profile',
				component: () => import('@/components/pages/Profile.vue'),
			},
			{
				path: '/profile/settings',
				name: 'Settings',
				component: () => import('@/components/pages/Profile.vue'),
			},
			{
				path: '/admin/add-product',
				name: 'Admin-Add-Product',
				component: () => import('@/components/pages/addProduct.vue'),
			},
			{
				path: '/view/:id',
				name: 'Product-View',
				component: () => import('@/components/pages/ProductView.vue'),
			},
			{
				path: '*',
				name: 'NotFound',
				component: () => import('@/components/pages/NotFound.vue'),
			},
		],
		meta: {
			requiresAuth: true,
		},
		components: {
			default: Home,
		},
	},
];

export default routes;