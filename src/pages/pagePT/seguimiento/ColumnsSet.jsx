import { Link } from 'react-router-dom';
import classNames from 'classnames';

/* order column render */
const OrderColumn = ({ row }) => {
	return (
		<Link to="" className="text-body fw-bold">
			#BM{row.original.order_id}
		</Link>
	);
};

/* orderdate column render */
const OrderDateColumn = ({ row }) => {
	return (
		<>
			{row.original.order_date}
			<small className="text-muted">{row.original.order_time}</small>
		</>
	);
};

/* payment column render */
const PaymentStatusColumn = ({ row }) => {
	return (
		<h5>
			<span
				className={classNames('badge', {
					'badge-success-lighten': row.original.payment_status === 'Paid',
					'badge-danger-lighten': row.original.payment_status === 'Payment Failed',
					'badge-info-lighten': row.original.payment_status === 'Unpaid',
					'badge-warning-lighten':
						row.original.payment_status === 'Awaiting Authorization',
				})}
			>
				{row.original.payment_status === 'Paid' && <i className="mdi mdi-bitcoin me-1"></i>}
				{row.original.payment_status === 'Payment Failed' && (
					<i className="mdi mdi-cancel me-1"></i>
				)}
				{row.original.payment_status === 'Unpaid' && <i className="mdi mdi-cash me-1"></i>}
				{row.original.payment_status === 'Awaiting Authorization' && (
					<i className="mdi mdi-timer-sand me-1"></i>
				)}
				{row.original.payment_status}
			</span>
		</h5>
	);
};

/* status column render */
const StatusColumn = ({ row }) => {
	return (
		<h4>
			<span
				className={classNames('badge', {
					'badge-outline-success': row.original.order_dia >= 10,
					'badge-outline-warning': row.original.order_dia <10,
					'badge-outline-danger': row.original.order_dia <1,
				})}
			>
				{row.original.order_dia} DIAS
			</span>
		</h4>
	);
};

/* action column render */
const ActionColumn = () => {
	return (
		<>
			<Link to="" className="action-icon">
				<i className="mdi mdi-eye"></i>
			</Link>
			<Link to="" className="action-icon">
				<i className="mdi mdi-square-edit-outline"></i>
			</Link>
			<Link to="" className="action-icon">
				<i className="mdi mdi-delete"></i>
			</Link>
		</>
	);
};

// get all columns
const columns = [
	{
		Header: 'Nombres y apellidos',
		accessor: 'names',
		defaultCanSort: false
	},
	{
		Header: 'Programa / Semana',
		accessor: 'programa',
		defaultCanSort: false
	},
	{
		Header: 'Vencimiento',
		accessor: 'vencimiento',
		defaultCanSort: false
	},
	{
		Header: 'Dia',
		accessor: 'order_dia',
		defaultCanSort: true,
		Cell: StatusColumn
	},
	{
		Header: 'Email',
		accessor: 'email',
		defaultCanSort: false
	},
	{
		Header: 'Telefono',
		accessor: 'telefono',
		defaultCanSort: false
	},
	{
		Header: 'Dni',
		accessor: 'dni',
		defaultCanSort: false
	},
];

const sizePerPageList = [
	{
		text: '10',
		value: 10,
	},
	{
		text: '20',
		value: 20,
	},
	{
		text: '50',
		value: 50,
	},
];

export { columns, sizePerPageList };
