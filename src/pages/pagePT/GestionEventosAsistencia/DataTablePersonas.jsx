import { DataTableCR } from '@/components/DataView/DataTableCR';
import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import { nombreDedo } from './dedos';

// Etiqueta de sincronización: "Sincronizado", o "Pendiente" con cada huellero y si está en línea
export const EstadoSincronizacion = ({ sincronizacion, estadoHuelleros }) => {
	if (!sincronizacion?.pendiente) return <Badge bg="success">Sincronizado</Badge>;
	return (
		<div title={`Pendiente: ${sincronizacion.operaciones.join(', ')}`}>
			<Badge bg="warning" text="dark">
				Pendiente
			</Badge>
			{sincronizacion.huelleros.map((sn) => (
				<div key={sn} className="small text-muted">
					{sn} ·{' '}
					{estadoHuelleros[sn] === 'online' ? (
						<span className="text-success">en línea, en segundos</span>
					) : (
						<span className="text-danger">fuera de línea, al reconectarse</span>
					)}
				</div>
			))}
		</div>
	);
};

export const DataTablePersonas = ({
	list,
	loading,
	estadoHuelleros = {},
	onEliminarHuella,
	onEliminarPersona,
	onReenviarPersona,
}) => {
	const columns = [
		{ id: 'pin', header: 'DNI / PIN', accessor: 'pin', sortable: true, width: 100, headerAlign: 'left', cellAlign: 'left' },
		{ id: 'nombre', header: 'Nombre', accessor: 'nombre', sortable: true, width: 200, headerAlign: 'left', cellAlign: 'left' },
		{
			id: 'huellas',
			header: 'Huellas',
			accessor: 'huellas',
			sortable: true,
			width: 80,
			headerAlign: 'left',
			cellAlign: 'left',
			render: (row) =>
				row.huellas > 0 ? <Badge bg="success">{row.huellas}</Badge> : <Badge bg="secondary">Sin huella</Badge>,
		},
		{
			id: 'dedos',
			header: 'Dedos registrados',
			accessor: (row) => row.dedos.map(nombreDedo).join(', '),
			width: 240,
			headerAlign: 'left',
			cellAlign: 'left',
			render: (row) => (
				<div className="d-flex flex-wrap gap-1">
					{row.dedos.map((dedo) => (
						<Badge key={dedo} bg="light" text="dark" className="border d-inline-flex align-items-center gap-1">
							{nombreDedo(dedo)}
							<button
								type="button"
								className="btn btn-link btn-sm p-0 text-danger lh-1"
								title={`Eliminar la huella del ${nombreDedo(dedo).toLowerCase()} (también del huellero)`}
								onClick={(e) => {
									e.stopPropagation();
									onEliminarHuella(row, dedo);
								}}
							>
								&times;
							</button>
						</Badge>
					))}
				</div>
			),
		},
		{
			id: 'activo',
			header: 'Estado',
			accessor: (row) => (row.activo ? 'Activo' : 'Deshabilitado'),
			sortable: true,
			width: 90,
			headerAlign: 'left',
			cellAlign: 'left',
		},
		{ id: 'registrado', header: 'Registrado', accessor: 'registrado', sortable: true, width: 100, headerAlign: 'left', cellAlign: 'left' },
		{
			id: 'sincronizacion',
			header: 'Sincronización',
			accessor: (row) => (row.sincronizacion?.pendiente ? 'Pendiente' : 'Sincronizado'),
			sortable: true,
			width: 190,
			headerAlign: 'left',
			cellAlign: 'left',
			render: (row) => <EstadoSincronizacion sincronizacion={row.sincronizacion} estadoHuelleros={estadoHuelleros} />,
		},
		{
			id: 'acciones',
			header: 'Acciones',
			width: 190,
			headerAlign: 'center',
			cellAlign: 'center',
			render: (row) => (
				<div className="d-flex gap-1 justify-content-center">
					<Button
						variant="outline-primary"
						size="sm"
						title="Volver a enviar esta persona, sus huellas y acceso 24 h a los huelleros"
						onClick={(e) => {
							e.stopPropagation();
							onReenviarPersona(row);
						}}
					>
						Reenviar
					</Button>
					<Button
						variant="outline-danger"
						size="sm"
						title="Eliminar a la persona y sus huellas (también de los huelleros)"
						onClick={(e) => {
							e.stopPropagation();
							onEliminarPersona(row);
						}}
					>
						Eliminar
					</Button>
				</div>
			),
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
			rowKey="pin"
			emptyMessage="No hay personas registradas"
			exportFileName="personas-huellero"
		/>
	);
};
