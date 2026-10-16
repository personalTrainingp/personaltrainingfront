import React from 'react';
import { Modal } from 'react-bootstrap';
import { DataTableCR } from '@/components/DataView/DataTableCR';

const fechaCorta = (f) => (f ? f.split('-').reverse().join('/') : '');

// Detalle de una card de día de la semana: un cliente por fecha (total, a.m. o p.m.)
export const ModalClientesDiaSemana = ({ titulo, filas = [], onHide }) => {
	const columns = [
		{ id: 'cliente', header: 'Cliente', accessor: 'cliente', sortable: true, width: 260, headerAlign: 'left', cellAlign: 'left' },
		{
			id: 'fecha',
			header: 'Fecha',
			accessor: 'fecha',
			sortable: true,
			width: 110,
			headerAlign: 'left',
			cellAlign: 'left',
			render: (row) => fechaCorta(row.fecha),
		},
		{
			id: 'programa',
			header: 'Programa',
			accessor: (row) => row.programa || 'Sin membresía vigente',
			sortable: true,
			width: 180,
			headerAlign: 'left',
			cellAlign: 'left',
			render: (row) => row.programa || <span className="text-muted">Sin membresía vigente</span>,
		},
	];

	return (
		<Modal show={Boolean(titulo)} onHide={onHide} size="lg" centered scrollable>
			<Modal.Header closeButton>
				<Modal.Title>
					{titulo} · {filas.length} {filas.length === 1 ? 'cliente' : 'clientes'}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<DataTableCR
					columns={columns}
					data={filas}
					defaultPageSize={25}
					pageSizeOptions={[25, 50, 100]}
					striped={false}
					small
					responsive
					verticalBorders
					rowKey="id"
					emptyMessage="Sin clientes"
					exportFileName={`clientes-${titulo || ''}`}
				/>
			</Modal.Body>
		</Modal>
	);
};
