// Todo: Generic's values are not provided from the library itself

import { useState } from "react";
import { ModalViewObservacion } from "../ModalViewObservacion";

// const columns: ReadonlyArray<Column<Customer>> = [
const columns = [
	{
		Header: 'id',
		accessor: 'id',
		defaultCanSort: true,
	},
	{
		Header: 'cliente',
		accessor: 'tb_cliente.nombres_apellidos_cli',
		defaultCanSort: true,
	},
	{
		Header: 'Vendedor',
		accessor: 'tb_empleado.nombres_apellidos_empl',
		defaultCanSort: true,
	},
	{
		Header: 'fecha de venta',
		accessor: 'fecha_venta',
		Cell:({row})=>{
			return new Date(row.original.fecha_venta).toLocaleDateString()
		},
		defaultCanSort: true,
	},
	{
		Header: 'Total',
		accessor: 'monto',
		defaultCanSort: true,
		Cell:({row})=>{
			return 'asdf'
		}
	},
	{
		Header: ' ',
		defaultCanSort: true,
		Cell:({row})=>{
			const [viewObs, setviewObs] = useState(false)
			const [idVenta, setidVenta] = useState(0)
			const [id, setid] = useState(0)
			const onViewObservacion =()=>{
				setidVenta(row.original.id)
				setviewObs(true)
				setid(row.original.id)
			}
			
			return (
				<>
				<button type="button" className="btn btn-primary" onClick={onViewObservacion}>
					Observacion
				</button>
				<ModalViewObservacion show={viewObs} onHide={()=>setviewObs(false)} data={idVenta} id={id}/>
				</>
			)
		}
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
