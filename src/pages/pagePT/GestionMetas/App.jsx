import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Spinner, Table } from 'react-bootstrap';
import { PageBreadcrumb } from '@/components';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import { useMetasStore } from './useMetasStore';
import { ModalMeta } from './ModalMeta';
import { ModalMetaAsesores } from './ModalMetaAsesores';
import { MESES } from './meses';

export const App = () => {
	const {
		dataMetas,
		dataAsesores,
		isLoading,
		error,
		obtenerMetas,
		obtenerAsesores,
		guardarMeta,
		eliminarMeta,
		guardarMetaAsesor,
		eliminarMetaAsesor,
	} = useMetasStore();
	const [anio, setanio] = useState(new Date().getFullYear());
	const [modalMeta, setmodalMeta] = useState({ show: false, meta: null });
	// Se guarda el id para que el modal muestre la meta actualizada tras cada cambio
	const [idMetaAsesores, setidMetaAsesores] = useState(null);
	const [errorAccion, seterrorAccion] = useState('');

	useEffect(() => {
		obtenerAsesores();
	}, []);
	useEffect(() => {
		obtenerMetas(anio);
	}, [anio]);

	const recargar = () => obtenerMetas(anio);
	const onEliminar = async (meta) => {
		if (!window.confirm(`¿Eliminar la meta de ${MESES[meta.mes - 1]} ${meta.anio}? También se quitan sus asesores.`)) return;
		seterrorAccion('');
		const resultado = await eliminarMeta(meta.id_meta);
		if (!resultado.ok) {
			seterrorAccion(resultado.msg);
			return;
		}
		recargar();
	};

	const totalMeta = dataMetas.reduce((t, m) => t + m.meta, 0);
	const totalBono = dataMetas.reduce((t, m) => t + m.bono, 0);
	const totalAsignado = dataMetas.reduce((t, m) => t + m.total_asignado, 0);

	return (
		<div>
			<PageBreadcrumb title={'Gestión de metas'} />
			<div className="d-flex flex-wrap align-items-end gap-3 mb-3">
				<Form.Group>
					<Form.Label>Año</Form.Label>
					<Form.Control type="number" value={anio} onChange={(e) => setanio(Number(e.target.value))} min={2000} max={2100} style={{ width: 120 }} />
				</Form.Group>
				<Button onClick={() => setmodalMeta({ show: true, meta: null })}>Nueva meta</Button>
			</div>
			{(error || errorAccion) && <Alert variant="danger">{error || errorAccion}</Alert>}
			{isLoading ? (
				<div className="text-center p-4">
					<Spinner animation="border" />
				</div>
			) : (
				<Table striped bordered hover responsive>
					<thead>
						<tr>
							<th>Mes</th>
							<th>Nombre</th>
							<th className="text-end">Meta</th>
							<th className="text-end">Bono</th>
							<th className="text-end">Asignado a asesores</th>
							<th>Observación</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{dataMetas.length === 0 && (
							<tr>
								<td colSpan={7} className="text-center text-muted">
									No hay metas registradas en {anio}
								</td>
							</tr>
						)}
						{dataMetas.map((m) => (
							<tr key={m.id_meta}>
								<td className="text-nowrap">
									{MESES[m.mes - 1]} {m.anio}
								</td>
								<td>{m.nombre_meta}</td>
								<td className="text-end">
									<NumberFormatMoney className="" amount={m.meta} />
								</td>
								<td className="text-end">
									<NumberFormatMoney className="" amount={m.bono} />
								</td>
								<td className={`text-end ${m.total_asignado > m.meta ? 'text-danger' : ''}`}>
									<NumberFormatMoney className="" amount={m.total_asignado} /> ({m.asesores.length})
								</td>
								<td>{m.observacion}</td>
								<td className="text-end text-nowrap">
									<Button size="sm" variant="link" onClick={() => setidMetaAsesores(m.id_meta)}>
										Asesores
									</Button>
									<Button size="sm" variant="link" onClick={() => setmodalMeta({ show: true, meta: m })}>
										Editar
									</Button>
									<Button size="sm" variant="link" className="text-danger" onClick={() => onEliminar(m)}>
										Eliminar
									</Button>
								</td>
							</tr>
						))}
					</tbody>
					{dataMetas.length > 0 && (
						<tfoot>
							<tr className="fw-bold">
								<td colSpan={2}>TOTAL</td>
								<td className="text-end">
									<NumberFormatMoney className="" amount={totalMeta} />
								</td>
								<td className="text-end">
									<NumberFormatMoney className="" amount={totalBono} />
								</td>
								<td className="text-end">
									<NumberFormatMoney className="" amount={totalAsignado} />
								</td>
								<td colSpan={2}></td>
							</tr>
						</tfoot>
					)}
				</Table>
			)}
			<ModalMeta
				show={modalMeta.show}
				metaEditar={modalMeta.meta}
				onHide={() => setmodalMeta({ show: false, meta: null })}
				guardarMeta={guardarMeta}
				onGuardada={recargar}
			/>
			<ModalMetaAsesores
				show={idMetaAsesores !== null}
				meta={dataMetas.find((m) => m.id_meta === idMetaAsesores)}
				onHide={() => setidMetaAsesores(null)}
				dataAsesores={dataAsesores}
				guardarMetaAsesor={guardarMetaAsesor}
				eliminarMetaAsesor={eliminarMetaAsesor}
				onCambio={recargar}
			/>
		</div>
	);
};
