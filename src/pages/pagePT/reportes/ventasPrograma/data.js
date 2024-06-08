import avatar1 from '@/assets/images/users/avatar-1.jpg';
import avatar2 from '@/assets/images/users/avatar-2.jpg';
import avatar3 from '@/assets/images/users/avatar-4.jpg';
import avatar4 from '@/assets/images/users/avatar-5.jpg';
import avatar5 from '@/assets/images/users/avatar-6.jpg';
import avatar6 from '@/assets/images/users/avatar-7.jpg';

const statisticsClientes = [
	{
		icon: 'mdi mdi-account-star-outline',
		variant: 'primary',
		title: 'CLIENTES NUEVOS',
		noOfProject: 85,
	},
	{
		icon: 'mdi mdi-account-group',
		variant: 'success',
		title: 'CLIENTES REINSCRITOS',
		noOfProject: 32,
	},
	{
		icon: 'mdi mdi-autorenew',
		variant: 'info',
		title: 'CLIENTES RENOVADOS',
		noOfProject: 40,
	},
];

const members = [
	{
		avatar: avatar1,
		name: 'Risa Pearson',
	},
	{
		avatar: avatar2,
		name: 'Margaret D. Evans',
	},
	{
		avatar: avatar3,
		name: 'Bryan J. Luellen',
	},
	{
		avatar: avatar4,
		name: 'Kathryn S. Collier',
	},
	{
		avatar: avatar5,
		name: 'Timothy Kauper',
	},
	{
		avatar: avatar6,
		name: 'Zara Raws',
	},
];
export { statisticsClientes, members };
