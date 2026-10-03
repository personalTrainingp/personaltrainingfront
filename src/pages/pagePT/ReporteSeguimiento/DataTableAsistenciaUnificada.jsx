import { DataTableCR } from '@/components/DataView/DataTableCR';
import React from 'react';
import { Badge } from 'react-bootstrap';

export const ESTADOS_PERSONA = {
	cliente_en_huellero: { label: 'Cliente en el huellero', bg: 'success' },
	cliente_sin_huellero: { label: 'Cliente sin huella', bg: 'warning', text: 'dark' },
	huellero_sin_cliente: { label: 'En huellero, sin cliente', bg: 'secondary' },
	// Empleado activo (tb_empleados): no cuenta como cliente aunque también esté en tb_clientes
	empleado: { label: 'Empleado', bg: 'dark' },
};

const vacio = <span className="text-muted">—</span>;
const fechaCorta = (f) => (f ? f.split('-').reverse().join('/') : null);

// Una fila por DNI: cliente (tb_clientes.numDoc_cli) + persona del huellero (zk_Users.dni)
export const DataTableAsistenciaUnificada = ({ list, loading }) => {
	const columns = [
		{ id: 'dni', header: 'DNI', accessor: 'dni', sortable: true, width: 95, headerAlign: 'left', cellAlign: 'left' },
		{
			id: 'cliente',
			header: 'Cliente',
			accessor: 'cliente',
			sortable: true,
			width: 220,
			headerAlign: 'left',
			cellAlign: 'left',
			render: (row) =>
				row.cliente || (
					<span className="text-muted">
						({row.estado === 'empleado' ? 'empleado' : 'sin cliente'}) {row.nombreHuellero}
					</span>
				),
		},
		{
			id: 'programa',
			header: 'Programa',
			accessor: 'programa',
			sortable: true,
			width: 130,
			headerAlign: 'left',
			cellAlign: 'left',
			render: (row) => row.programa || vacio,
		},
		{
			id: 'vence',
			header: 'Vence',
			accessor: 'vence',
			sortable: true,
			width: 90,
			headerAlign: 'left',
			cellAlign: 'left',
			render: (row) => fechaCorta(row.vence) || vacio,
		},
		{
			id: 'pin',
			header: 'PIN huellero',
			accessor: 'pin',
			sortable: true,
			width: 100,
			headerAlign: 'left',
			cellAlign: 'left',
			render: (row) => row.pin ?? vacio,
		},
		{
			id: 'huellas',
			header: 'Huellas',
			accessor: 'huellas',
			sortable: true,
			width: 70,
			headerAlign: 'right',
			cellAlign: 'right',
			render: (row) => (row.pin ? row.huellas : vacio),
		},
		{ id: 'marcaciones', header: 'Marcaciones', accessor: 'marcaciones', sortable: true, width: 100, headerAlign: 'right', cellAlign: 'right' },
		{ id: 'diasAsistidos', header: 'Días asistidos', accessor: 'diasAsistidos', sortable: true, width: 100, headerAlign: 'right', cellAlign: 'right' },
		{
			id: 'ultimaMarcacion',
			header: 'Última marcación',
			accessor: 'ultimaMarcacion',
			sortable: true,
			width: 140,
			headerAlign: 'left',
			cellAlign: 'left',
			render: (row) => {
				if (!row.ultimaMarcacion) return vacio;
				const [fecha, hora] = row.ultimaMarcacion.split(' ');
				return `${fechaCorta(fecha)} ${hora.slice(0, 5)}`;
			},
		},
		{
			id: 'estado',
			header: 'Estado',
			accessor: (row) => ESTADOS_PERSONA[row.estado]?.label,
			sortable: true,
			width: 170,
			headerAlign: 'left',
			cellAlign: 'left',
			render: (row) => {
				const e = ESTADOS_PERSONA[row.estado];
				return e ? (
					<Badge bg={e.bg} text={e.text}>
						{e.label}
					</Badge>
				) : null;
			},
		},
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
			verticalBorders
			resizableColumns
			rowKey="dni"
			emptyMessage="Sin datos en el rango seleccionado"
			exportFileName="reporte-asistencia-huellero"
		/>
	);
};
