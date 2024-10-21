import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ModalInventario } from './ModalInventario';
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore';

// const columns: ReadonlyArray<Column<Customer>> = [
const ActionColumnGF = ({ row }) => {
	const [modal, setmodal] = useState(false);
	const [modalUpdate, setmodalUpdate] = useState(false);
	const { gastoxID, obtenerGastoxID, isLoading } = useGf_GvStore()
	const onModalUpdateGF = (id) => {
		setmodalUpdate(true);
		obtenerGastoxID(id)
	};
	const onCloseModal = ()=>{
		setmodalUpdate(false)
	}
	return (
		<>
			<Link to="" className="action-icon" onClick={()=>onModalUpdateGF(row.original.id)}>
				<i className="mdi mdi-square-edit-outline"></i>
			</Link>
			<Link to="" className="action-icon" onClick={() => setmodal(true)}>
				<i className="mdi mdi-delete"></i>
			</Link>
			<ModalInventario show={modalUpdate} onHide={onCloseModal} data={gastoxID} isLoading={isLoading} />
		</>
	);
};
const columns = [
	{
		Header: 'id',
		accessor: 'id',
		defaultCanSort: true,
	},
	{
		Header: 'Monedas',
		accessor: 'moneda',
		defaultCanSort: true,
	},
	{
		Header: 'Tipo de gastos',
		accessor: 'monto',
		defaultCanSort: true,
	},
	{
		Header: 'Descripcion',
		accessor: 'descripcion',
		defaultCanSort: true,
	},
	{
		Header: 'Fecha de pago',
		accessor: 'fec_pago',
		defaultCanSort: true,
	},
	{
		Header: 'Action',
		defaultCanSort: false,
		Cell: ActionColumnGF,
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
