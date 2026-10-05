import { DataTableCR } from '@/components/DataView/DataTableCR';
import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import { nombreDedo } from './dedos';

// Estados de sincronización con el huellero (ver calcularSincronizacion en el backend)
export const ESTADOS_SINCRONIZACION = {
	pendiente: { label: 'Pendiente', bg: 'warning', text: 'dark', ayuda: 'En cola: el huellero aún no lo recoge' },
	esperando: { label: 'Enviado, esperando confirmación', bg: 'info', text: 'dark', ayuda: 'El huellero lo recogió y aún no responde' },
	error: { label: 'Rechazado por el huellero', bg: 'danger', ayuda: 'El huellero respondió con un error' },
	sin_confirmar: { label: 'Enviado sin confirmación', bg: 'secondary', ayuda: 'El huellero lo recogió pero nunca respondió' },
	confirmado: { label: 'Confirmado por el huellero', bg: 'success', ayuda: 'El huellero respondió que lo aplicó' },
	sincronizado: { label: 'Sincronizado', bg: 'success', ayuda: 'Sin cambios pendientes' },
};
const estadoDe = (s) => (s?.estado ? s.estado : s?.pendiente ? 'pendiente' : 'sincronizado');

// Huella eliminada en las últimas 24 h: tachada, con el estado del borrado en el huellero
const BORRADO_HUELLA = {
	pendiente: { bg: 'warning', text: 'dark', icono: 'pi-clock', ayuda: 'Borrándose: el huellero aún no recoge la orden' },
	esperando: { bg: 'info', text: 'dark', icono: 'pi-spinner pi-spin', ayuda: 'El huellero recogió la orden y aún no responde' },
	error: { bg: 'danger', icono: 'pi-exclamation-triangle', ayuda: 'El huellero rechazó el borrado' },
	sin_confirmar: { bg: 'secondary', icono: 'pi-question-circle', ayuda: 'El huellero recogió la orden pero nunca respondió' },
	confirmado: { bg: 'success', icono: 'pi-check', ayuda: 'Eliminada del huellero (confirmado)' },
	sincronizado: { bg: 'success', icono: 'pi-check', ayuda: 'Eliminada del huellero' },
};
export const HuellaEliminada = ({ dedo, estado }) => {
	const e = BORRADO_HUELLA[estado] || BORRADO_HUELLA.sincronizado;
	return (
		<Badge bg={e.bg} text={e.text} className="border d-inline-flex align-items-center gap-1" title={e.ayuda}>
			<i className={`pi ${e.icono}`} style={{ fontSize: '0.7rem' }} />
			<span style={{ textDecoration: 'line-through' }}>{nombreDedo(dedo)}</span>
		</Badge>
	);
};

// Etiqueta de sincronización con el detalle por huellero (pendientes, en espera y errores)
export const EstadoSincronizacion = ({ sincronizacion, estadoHuelleros }) => {
	const estado = ESTADOS_SINCRONIZACION[estadoDe(sincronizacion)];
	const operaciones = sincronizacion?.operaciones?.length ? `Pendiente: ${sincronizacion.operaciones.join(', ')}` : estado.ayuda;
	return (
		<div title={operaciones}>
			<Badge bg={estado.bg} text={estado.text}>
				{estado.label}
			</Badge>
			{(sincronizacion?.huelleros || []).map((sn) => (
				<div key={`p-${sn}`} className="small text-muted">
					{sn} ·{' '}
					{estadoHuelleros[sn] === 'online' ? (
						<span className="text-success">en línea, en segundos</span>
					) : (
						<span className="text-danger">fuera de línea, al reconectarse</span>
					)}
				</div>
			))}
			{(sincronizacion?.esperando || []).map((e, i) => (
				<div key={`e-${i}`} className="small text-muted">
					{e.DeviceSN} · {e.operacion}
				</div>
			))}
			{(sincronizacion?.errores || []).map((e, i) => (
				<div key={`x-${i}`} className="small text-danger">
					{e.DeviceSN} · {e.operacion}
					{e.dedo !== null && e.dedo !== undefined ? ` (${nombreDedo(e.dedo).toLowerCase()})` : ''} · código {e.codigo}
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
	onAgregarDedo,
	onCambiarEstado,
}) => {
	const columns = [
		{ id: 'pin', header: 'PIN', accessor: 'pin', sortable: true, width: 100, headerAlign: 'left', cellAlign: 'left' },
		{
			id: 'dni',
			header: 'DNI',
			accessor: 'dni',
			sortable: true,
			width: 100,
			headerAlign: 'left',
			cellAlign: 'left',
			render: (row) => (row.dni ? row.dni : <span className="text-muted">—</span>),
		},
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
			width: 260,
			headerAlign: 'left',
			cellAlign: 'left',
			render: (row) => (
				<div className="d-flex flex-wrap gap-1">
					{row.dedos.map((dedo) => {
						// Estado de la huella de este dedo en el huellero
						const conError = row.sincronizacion?.dedosConError?.includes(dedo);
						const pendiente = row.sincronizacion?.dedosPendientes?.includes(dedo);
						return (
							<Badge
								key={dedo}
								bg={conError ? 'danger' : pendiente ? 'warning' : 'light'}
								text={conError ? undefined : 'dark'}
								className="border d-inline-flex align-items-center gap-1"
								title={
									conError
										? 'El huellero rechazó esta huella'
										: pendiente
											? 'Esta huella aún no llega al huellero'
											: undefined
								}
							>
								{pendiente && <i className="pi pi-clock" style={{ fontSize: '0.7rem' }} />}
								{conError && <i className="pi pi-exclamation-triangle" style={{ fontSize: '0.7rem' }} />}
								{nombreDedo(dedo)}
								<button
									type="button"
									className={`btn btn-link btn-sm p-0 lh-1 ${conError ? 'text-white' : 'text-danger'}`}
									title={`Eliminar la huella del ${nombreDedo(dedo).toLowerCase()} (también del huellero)`}
									onClick={(e) => {
										e.stopPropagation();
										onEliminarHuella(row, dedo);
									}}
								>
									&times;
								</button>
							</Badge>
						);
					})}
					{(row.huellasEliminadas || []).map((h) => (
						<HuellaEliminada key={`eliminada-${h.dedo}`} dedo={h.dedo} estado={h.estado} />
					))}
				</div>
			),
		},
		{
			id: 'activo',
			header: 'Estado',
			accessor: (row) => (row.activo ? 'Activo' : 'Inactivo'),
			sortable: true,
			width: 170,
			headerAlign: 'left',
			cellAlign: 'left',
			// Inactivo = el huellero lo reconoce pero no lo deja entrar (membresía vencida o desactivado a mano)
			render: (row) => (
				<div className="d-flex align-items-center gap-2">
					<Badge bg={row.activo ? 'success' : 'secondary'}>{row.activo ? 'Activo' : 'Inactivo'}</Badge>
					<Button
						variant={row.activo ? 'outline-secondary' : 'outline-success'}
						size="sm"
						className="py-0"
						title={row.activo ? 'Desactivar: el huellero no lo dejará entrar' : 'Activar: el huellero lo dejará entrar'}
						onClick={(e) => {
							e.stopPropagation();
							onCambiarEstado(row);
						}}
					>
						{row.activo ? 'Desactivar' : 'Activar'}
					</Button>
				</div>
			),
		},
		{ id: 'registrado', header: 'Registrado', accessor: 'registrado', sortable: true, width: 100, headerAlign: 'left', cellAlign: 'left' },
		{
			id: 'sincronizacion',
			header: 'Sincronización',
			accessor: (row) => ESTADOS_SINCRONIZACION[estadoDe(row.sincronizacion)].label,
			sortable: true,
			width: 220,
			headerAlign: 'left',
			cellAlign: 'left',
			render: (row) => <EstadoSincronizacion sincronizacion={row.sincronizacion} estadoHuelleros={estadoHuelleros} />,
		},
		{
			id: 'acciones',
			header: 'Acciones',
			width: 290,
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
						variant="outline-success"
						size="sm"
						title="Agregar la huella de otro dedo"
						disabled={row.dedos.length >= 10}
						onClick={(e) => {
							e.stopPropagation();
							onAgregarDedo(row);
						}}
					>
						Agregar dedo
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
