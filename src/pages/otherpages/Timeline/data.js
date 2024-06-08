import small1 from '@/assets/images/small/small-1.jpg';
import small2 from '@/assets/images/small/small-2.jpg';
import small3 from '@/assets/images/small/small-3.jpg';
import avatar3 from '@/assets/images/users/avatar-3.jpg';

export const timelineData = {
	Today: [
		{
			title: 'Completed UX design project for our client',
			date: '22 July, 2023',
			text: 'Dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde?',
			reactions: [
				{
					emoji: '👍',
					count: '17',
				},
				{
					emoji: '❤️',
					count: '89',
				},
			],
		},
		{
			title: 'Yay! We are celebrating our first admin release.',
			date: '22 July, 2023',
			text: 'Consectetur adipisicing elit. Iusto, optio, dolorum John deon provident rerum aut hic quasi placeat iure tempora laudantium',
			reactions: [
				{
					emoji: '🎉',
					count: '148',
				},
			],
		},
	],
	Yesterday: [
		{
			title: 'We released new version of our theme Attex.',
			date: '22 July, 2023',
			text: '3 new photo Uploaded on facebook fan page',
			images: [small1, small2, small3],
			reactions: [
				{
					emoji: '🏆',
					count: '94',
				},
			],
		},
		{
			title: 'We have archieved 25k sales in our themes.',
			date: '22 July, 2023',
			text: 'Outdoor visit at California State Route 85 with John Boltana & Harry Piterson regarding to setup a new show room.',
			reactions: [
				{
					emoji: '👍',
					count: '1.4k',
				},
				{
					emoji: '🎉',
					count: '2k',
				},
			],
		},
		{
			title: 'Conference call with UX team',
			date: '22 July, 2023',
			text: 'Jonatha Smith added new milestone Pathek Lorem ipsum dolor sit amet consiquest dio',
			reactions: [
				{
					emoji: '❤️',
					count: '89',
				},
			],
		},
	],
	'Last Month': [
		{
			title: 'Join new team member Alex Smith',
			date: '10 December, 2018',
			text: 'Alex Smith is a Senior Software (Full Stack) engineer with a deep passion for building usable, functional & pretty web applications.',
			user: {
				image: avatar3,
				name: 'Alex Smith',
				position: 'Senior Software (Full Stack)',
			},
		},
		{
			title: 'First release of Attex admin dashboard template',
			date: '05 May, 2023',
			text: 'Outdoor visit at California State Route 85 with John Boltana & Harry Piterson regarding to setup a new show room.',
			reactions: [
				{
					emoji: '🎉',
					count: '10k',
				},
				{
					emoji: '👍',
					count: '3.2k',
				},
				{
					emoji: '❤️',
					count: '7.1k',
				},
			],
		},
	],
};
