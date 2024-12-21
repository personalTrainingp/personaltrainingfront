export const NodeService = {
	getTreeNodesData() {
		return [
			{
				key: '0',
				label: '2024',
				data: '2024',
				// icon: 'pi pi-fw pi-inbox',
				children: [
					{
						key: '0-0',
						label: 'Enero',
						data: 'enero',
					},
					{
						key: '0-1',
						label: 'Febrero',
						data: 'febrero',
					},
					{
						key: '0-2',
						label: 'Marzo',
						data: 'marzo',
					},
				],
			},
		];
	},

	getTreeTableNodesData() {
		return [
			{
				key: '0',
				data: {
					name: 'Applications',
					size: '100kb',
					type: 'Folder',
				},
				children: [
					{
						key: '0-0',
						data: {
							name: 'React',
							size: '25kb',
							type: 'Folder',
						},
						children: [
							{
								key: '0-0-0',
								data: {
									name: 'react.app',
									size: '10kb',
									type: 'Application',
								},
							},
							{
								key: '0-0-1',
								data: {
									name: 'native.app',
									size: '10kb',
									type: 'Application',
								},
							},
							{
								key: '0-0-2',
								data: {
									name: 'mobile.app',
									size: '5kb',
									type: 'Application',
								},
							},
						],
					},
					{
						key: '0-1',
						data: {
							name: 'editor.app',
							size: '25kb',
							type: 'Application',
						},
					},
					{
						key: '0-2',
						data: {
							name: 'settings.app',
							size: '50kb',
							type: 'Application',
						},
					},
				],
			},
		];
	},

	getTreeTableNodes() {
		return Promise.resolve(this.getTreeTableNodesData());
	},

	getTreeNodes() {
		return Promise.resolve(this.getTreeNodesData());
	},
};
