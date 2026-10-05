import { DataTableCR } from '@/components/DataView/DataTableCR';
import React from 'react';
import { Badge } from 'react-bootstrap';

export const DataTableEventosAsistencia = ({ list, loading }) => {
	const columns = [
		{ id: 'fecha', header: 'Fecha', accessor: 'fecha', sortable: true, width: 90, headerAlign: 'left', cellAlign: 'left' },
		{ id: 'hora', header: 'Hora', accessor: 'hora', sortable: true, width: 70, headerAlign: 'left', cellAlign: 'left' },
		{ id: 'pin', header: 'PIN', accessor: 'pin', sortable: true, width: 90, headerAlign: 'left', cellAlign: 'left' },
		{ id: 'dni', header: 'DNI', accessor: 'dni', sortable: true, width: 90, headerAlign: 'left', cellAlign: 'left' },
		{
			id: 'nombre',
			header: 'Nombre',
			accessor: 'nombre',
			sortable: true,
			width: 180,
			headerAlign: 'left',
			cellAlign: 'left',
			render: (row) => (row.nombre ? row.nombre : <span className="text-muted">(no registrado)</span>),
		},
		{
			id: 'labelEstado',
			header: 'Estado',
			accessor: (row) => row.labelEstado || '',
			sortable: true,
			width: 150,
			headerAlign: 'left',
			cellAlign: 'left',
			// "membresia inactiva": intentó entrar con la membresía vencida o desactivada (el huellero no lo dejó pasar)
			render: (row) =>
				row.labelEstado ? (
					<Badge bg="danger" className="text-uppercase" title="El huellero no lo dejó entrar">
						<i className="pi pi-ban me-1" style={{ fontSize: '0.7rem' }} />
						{row.labelEstado}
					</Badge>
				) : null,
		},
		{ id: 'huellero', header: 'Huellero', accessor: 'huellero', sortable: true, width: 110, headerAlign: 'left', cellAlign: 'left' },
		{ id: 'recibida', header: 'Recibida', accessor: 'recibida', sortable: true, width: 120, headerAlign: 'left', cellAlign: 'left' },
	];
	return (
		<DataTableCR
			columns={columns}
			data={list}
			loading={loading}
			defaultPageSize={25}
			pageSizeOptions={[10, 25, 50, 100]}
			striped={false}
			small
			responsive
			syncUrl
			pageParam="page"
			pageSizeParam="pageSize"
			verticalBorders
			resizableColumns
			rowKey="id"
			emptyMessage="Sin marcaciones en el rango seleccionado"
			exportFileName="eventos-asistencia"
		/>
	);
};
