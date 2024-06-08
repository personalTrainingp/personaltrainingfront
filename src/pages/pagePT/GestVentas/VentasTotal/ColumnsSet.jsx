// Todo: Generic's values are not provided from the library itself
// const columns: ReadonlyArray<Column<Customer>> = [
const columns = [
	{
		Header: 'id',
		accessor: 'id_venta',
		defaultCanSort: true,
	},
	{
		Header: 'cliente',
		accessor: 'id_cliente',
		defaultCanSort: true,
	},
	{
		Header: 'Vendedor',
		accessor: 'id_empl',
		defaultCanSort: true,
	},
	{
		Header: 'fecha de venta',
		accessor: 'fecha_venta',
		defaultCanSort: true,
	},
	{
		Header: 'Tipo de factura',
		accessor: 'id_tipo_factura',
		defaultCanSort: true,
	},
	{
		Header: 'Factura',
		accessor: 'n_factura',
		defaultCanSort: true,
	},
	{
		Header: 'Total',
		accessor: 'monto',
		defaultCanSort: true,
	},
];

const sizePerPageList = [
	{
		text: '1',
		value: 10,
	},
	{
		text: '105',
		value: 25,
	},
	{
		text: '50',
		value: 50,
	},
	{
		text: '50',
		value: 50,
	},
];

export { columns, sizePerPageList };
