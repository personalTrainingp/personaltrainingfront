import { DataTableCR } from '@/components/DataView/DataTableCR';
import React from 'react';
import { Badge } from 'react-bootstrap';

// Color de cada estado de la marcación (label_estado, se guarda al recibirla):
// colaborador = morado, activo para [programa] = verde, sin membresía / inactiva = rojo
const estiloLabel = (label) => {
	if (!label) return null;
	if (label === 'Es colaborador')
		return { bg: '', style: { backgroundColor: '#6f42c1' }, icono: 'pi-id-card', ayuda: 'Empleado activo' };
	if (label.startsWith('activo para'))
		return { bg: 'success', icono: 'pi-check-circle', ayuda: 'Cliente con membresía vigente ese día' };
	if (label === 'membresia inactiva')
		return { bg: 'danger', icono: 'pi-ban', ayuda: 'Membresía vigente pero desactivado: el huellero no lo dejó entrar' };
	return { bg: 'danger', icono: 'pi-times-circle', ayuda: 'Cliente sin membresía vigente ese día' };
};

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
			render: (row) => {
				const e = estiloLabel(row.labelEstado);
				return e ? (
					<Badge bg={e.bg} style={e.style} title={e.ayuda}>
						<i className={`pi ${e.icono} me-1`} style={{ fontSize: '0.7rem' }} />
						{row.labelEstado}
					</Badge>
				) : null;
			},
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
