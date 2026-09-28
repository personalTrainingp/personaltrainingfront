import React, { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { confirmDialog } from 'primereact/confirmdialog';
import { DataTablePersonas, EstadoSincronizacion } from './DataTablePersonas';
import { ModalAgregarPersona } from './ModalAgregarPersona';
import { useEventosAsistenciaStore } from './useEventosAsistenciaStore';
import { nombreDedo } from './dedos';

export const TabPersonas = () => {
	const {
		reenviarPersona,
		sincronizarHuelleros,
		obtenerPersonas,
		agregarPersona,
		eliminarHuella,
		eliminarPersona,
		dataPersonas,
		borradosPendientes,
		estadoHuelleros,
		isLoadingPersonas,
		errorPersonas,
	} = useEventosAsistenciaStore();

	// Mientras haya cambios pendientes en un huellero EN LÍNEA (llegan en segundos), la tabla se
	// actualiza sola cada 5 s para mostrar cuándo pasan a "Sincronizado". Si solo quedan pendientes
	// en huelleros fuera de línea, no se consulta (pueden tardar horas).
	const PENDIENTE_EN_LINEA = [...dataPersonas.map((p) => p.sincronizacion), ...borradosPendientes.map((b) => ({ pendiente: true, ...b }))]
		.some((s) => s?.pendiente && s.huelleros.some((sn) => estadoHuelleros[sn] === 'online'));
	useEffect(() => {
		if (!PENDIENTE_EN_LINEA) return;
		const intervalo = setInterval(() => obtenerPersonas(true), 5000);
		return () => clearInterval(intervalo);
	}, [PENDIENTE_EN_LINEA]);

	// Sincronizar huellero -> sistema: el huellero envía todas sus personas y huellas.
	// La importación tarda unos minutos; mientras tanto la tabla se actualiza sola cada 10 s.
	const MINUTOS_IMPORTACION = 6;
	const [isSincronizando, setisSincronizando] = useState(false);
	const [importandoHasta, setimportandoHasta] = useState(0);
	const IMPORTANDO = importandoHasta > 0;
	useEffect(() => {
		if (!IMPORTANDO) return;
		const intervalo = setInterval(() => {
			if (Date.now() > importandoHasta) setimportandoHasta(0);
			obtenerPersonas(true);
		}, 10000);
		return () => clearInterval(intervalo);
	}, [importandoHasta]);

	const onSincronizar = () => {
		confirmDialog({
			header: 'Sincronizar con el huellero',
			message:
				'Se traerán del huellero todas las personas y sus huellas al sistema (las nuevas se agregan y las ' +
				'que cambiaron se actualizan; no se duplica nada). Tarda unos minutos. ¿Continuar?',
			icon: 'pi pi-sync',
			acceptLabel: 'Sincronizar',
			rejectLabel: 'Cancelar',
			accept: async () => {
				setmensajeExito('');
				setmensajeError('');
				setisSincronizando(true);
				const resultado = await sincronizarHuelleros();
				setisSincronizando(false);
				if (!resultado.ok) {
					setmensajeError(resultado.msg);
					return;
				}
				const omitidos = resultado.omitidos?.length
					? ` No se pidió a: ${resultado.omitidos.map((o) => `${o.DeviceSN} (${o.motivo})`).join(', ')}.`
					: '';
				setmensajeExito(
					`Sincronización iniciada con ${resultado.solicitados.join(', ')}. El huellero enviará sus personas ` +
						`y huellas en los próximos minutos; la tabla se actualizará sola.${omitidos}`
				);
				setimportandoHasta(Date.now() + MINUTOS_IMPORTACION * 60 * 1000);
			},
		});
	};
	const [isOpenModalAgregarPersona, setisOpenModalAgregarPersona] = useState(false);
	const [mensajeExito, setmensajeExito] = useState('');
	const [mensajeError, setmensajeError] = useState('');

	const onReenviarPersona = (persona) => {
		confirmDialog({
			header: 'Reenviar al huellero',
			message:
				`¿Volver a enviar a ${persona.nombre} (DNI ${persona.pin}) a los huelleros, con sus ` +
				`${persona.huellas} huella(s) y acceso 24 horas? Reemplaza sus datos en el equipo.`,
			icon: 'pi pi-send',
			acceptLabel: 'Reenviar',
			rejectLabel: 'Cancelar',
			accept: async () => {
				setmensajeExito('');
				setmensajeError('');
				const resultado = await reenviarPersona(persona.pin);
				if (!resultado.ok) {
					setmensajeError(resultado.msg);
					return;
				}
				setmensajeExito(
					`${persona.nombre} (DNI ${persona.pin}) se está enviando con ${resultado.huellas} huella(s) a: ` +
						`${resultado.huelleros.join(', ')}. Revisa la columna "Sincronización".`
				);
				obtenerPersonas();
			},
		});
	};

	const onEliminarPersona = (persona) => {
		confirmDialog({
			header: 'Eliminar persona',
			message:
				`¿Eliminar a ${persona.nombre} (DNI ${persona.pin}) y todas sus huellas? ` +
				'También se borrará de los huelleros y ya no podrá marcar. Sus marcaciones anteriores se conservan.',
			icon: 'pi pi-exclamation-triangle',
			acceptLabel: 'Eliminar',
			rejectLabel: 'Cancelar',
			acceptClassName: 'p-button-danger',
			accept: async () => {
				setmensajeExito('');
				setmensajeError('');
				const resultado = await eliminarPersona(persona.pin);
				if (!resultado.ok) {
					setmensajeError(resultado.msg);
					return;
				}
				setmensajeExito(
					`Se eliminó a ${persona.nombre} (DNI ${persona.pin})` +
						(resultado.huelleros.length
							? `. Se está borrando de: ${resultado.huelleros.join(', ')} (en segundos si está en línea).`
							: '. No hay huelleros activos.')
				);
				obtenerPersonas();
			},
		});
	};

	const onEliminarHuella = (persona, dedo) => {
		confirmDialog({
			header: 'Eliminar huella',
			message: `¿Eliminar la huella del ${nombreDedo(dedo).toLowerCase()} de ${persona.nombre} (DNI ${persona.pin})? También se borrará de los huelleros.`,
			icon: 'pi pi-exclamation-triangle',
			acceptLabel: 'Eliminar',
			rejectLabel: 'Cancelar',
			acceptClassName: 'p-button-danger',
			accept: async () => {
				setmensajeExito('');
				setmensajeError('');
				const resultado = await eliminarHuella(persona.pin, dedo);
				if (!resultado.ok) {
					setmensajeError(resultado.msg);
					return;
				}
				setmensajeExito(
					`Se eliminó la huella del ${nombreDedo(dedo).toLowerCase()} de ${persona.nombre}` +
						(resultado.huelleros.length
							? `. Se está borrando de: ${resultado.huelleros.join(', ')} (en segundos si está en línea).`
							: '. No hay huelleros activos.')
				);
				obtenerPersonas();
			},
		});
	};

	useEffect(() => {
		obtenerPersonas();
	}, []);

	const onPersonaAgregada = ({ persona, huelleros }) => {
		setmensajeExito(
			`${persona.nombre} (DNI ${persona.pin}) fue agregada` +
				(huelleros.length
					? ` y se está enviando a: ${huelleros.join(', ')}. Revisa la columna "Sincronización".`
					: '. No hay huelleros activos.')
		);
		obtenerPersonas();
	};

	return (
		<div>
			<div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
				<Button variant="success" onClick={() => setisOpenModalAgregarPersona(true)}>
					Agregar persona
				</Button>
				<Button variant="primary" onClick={onSincronizar} disabled={isSincronizando || IMPORTANDO}>
					<i className={`pi pi-sync me-1 ${isSincronizando || IMPORTANDO ? 'pi-spin' : ''}`} />
					{IMPORTANDO ? 'Importando del huellero...' : 'Sincronizar con el huellero'}
				</Button>
				<Button variant="outline-secondary" onClick={() => obtenerPersonas()} disabled={isLoadingPersonas}>
					{isLoadingPersonas ? 'Actualizando...' : 'Actualizar'}
				</Button>
				{PENDIENTE_EN_LINEA && <small className="text-muted">Sincronizando con el huellero… (se actualiza sola)</small>}
				<small className="text-muted ms-md-auto">
					{dataPersonas.length} personas · {dataPersonas.filter((p) => p.huellas > 0).length} con huella ·{' '}
					{dataPersonas.filter((p) => p.sincronizacion?.pendiente).length} pendientes de sincronizar
				</small>
			</div>

			{borradosPendientes.length > 0 && (
				<Alert variant="warning">
					<details>
						<summary>
							{borradosPendientes.length}{' '}
							{borradosPendientes.length === 1 ? 'persona eliminada tiene' : 'personas eliminadas tienen'} el
							borrado pendiente de sincronizar en algún huellero
						</summary>
						<ul className="mb-0 mt-2">
							{borradosPendientes.map((b) => (
								<li key={b.pin} className="mb-1">
									DNI {b.pin}{' '}
									<EstadoSincronizacion
										sincronizacion={{ pendiente: true, ...b }}
										estadoHuelleros={estadoHuelleros}
									/>
								</li>
							))}
						</ul>
					</details>
				</Alert>
			)}

			{mensajeExito && (
				<Alert variant="success" dismissible onClose={() => setmensajeExito('')}>
					{mensajeExito}
				</Alert>
			)}
			{mensajeError && (
				<Alert variant="danger" dismissible onClose={() => setmensajeError('')}>
					{mensajeError}
				</Alert>
			)}
			{errorPersonas && <Alert variant="danger">{errorPersonas}</Alert>}
			<DataTablePersonas
				list={dataPersonas}
				loading={isLoadingPersonas}
				estadoHuelleros={estadoHuelleros}
				onEliminarHuella={onEliminarHuella}
				onEliminarPersona={onEliminarPersona}
				onReenviarPersona={onReenviarPersona}
			/>
			<ModalAgregarPersona
				show={isOpenModalAgregarPersona}
				onHide={() => setisOpenModalAgregarPersona(false)}
				agregarPersona={agregarPersona}
				onAgregada={onPersonaAgregada}
			/>
		</div>
	);
};
