import React from 'react';
import { Badge, Modal } from 'react-bootstrap';
import { DataTableCR } from '@/components/DataView/DataTableCR';

const vacio = <span className="text-muted">—</span>;
const fechaCorta = (f) => (f ? f.split('-').reverse().join('/') : '');

// Detalle de un día de la curva: quién asistió, su programa, hora de llegada y sesiones que le quedan
export const ModalDetalleDia = ({ fecha, personas = [], onHide }) => {
	const columns = [
		{
			id: 'horaLlegada',
			header: 'Hora de llegada',
			accessor: 'horaLlegada',
			sortable: true,
			width: 110,
			headerAlign: 'left',
			cellAlign: 'left',
			render: (row) => row.horaLlegada?.slice(0, 5),
		},
		{
			id: 'cliente',
			header: 'Cliente',
			accessor: (row) => row.cliente || row.nombreHuellero,
			sortable: true,
			width: 240,
			headerAlign: 'left',
			cellAlign: 'left',
			render: (row) =>
				row.cliente ? (
					row.cliente
				) : (
					<span>
						{row.nombreHuellero} <Badge bg="secondary">No es cliente</Badge>
					</span>
				),
		},
		{ id: 'dni', header: 'DNI', accessor: 'dni', sortable: true, width: 95, headerAlign: 'left', cellAlign: 'left' },
		{
			id: 'programa',
			header: 'Programa',
			accessor: (row) => row.programa || (row.cliente ? 'Sin membresía vigente' : ''),
			sortable: true,
			width: 150,
			headerAlign: 'left',
			cellAlign: 'left',
			render: (row) => row.programa || (row.cliente ? <span className="text-muted">Sin membresía vigente</span> : vacio),
		},
		{
			id: 'sesionesRestantes',
			header: 'Sesiones que le quedan',
			accessor: 'sesionesRestantes',
			sortable: true,
			width: 150,
			headerAlign: 'right',
			cellAlign: 'right',
			render: (row) =>
				row.sesionesRestantes === null || row.sesionesRestantes === undefined ? (
					vacio
				) : (
					<span title={`Lunes a viernes desde este día hasta el vencimiento (${fechaCorta(row.vence)})`}>
						<b>{row.sesionesRestantes}</b> <small className="text-muted">· vence {fechaCorta(row.vence)}</small>
					</span>
				),
		},
	];

	return (
		<Modal show={Boolean(fecha)} onHide={onHide} size="xl" centered scrollable>
			<Modal.Header closeButton>
				<Modal.Title>
					Asistencia del {fechaCorta(fecha)} · {personas.length} {personas.length === 1 ? 'cliente' : 'clientes'}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p className="text-muted small">
					Hora de llegada = primera marcación del día. Sesiones que le quedan = días de lunes a viernes desde este día
					hasta el vencimiento de su membresía vigente.
				</p>
				<DataTableCR
					columns={columns}
					data={personas}
					defaultPageSize={25}
					pageSizeOptions={[25, 50, 100]}
					striped={false}
					small
					responsive
					verticalBorders
					rowKey="pin"
					emptyMessage="Nadie marcó este día"
					exportFileName={`asistencia-${fecha}`}
				/>
			</Modal.Body>
		</Modal>
	);
};
