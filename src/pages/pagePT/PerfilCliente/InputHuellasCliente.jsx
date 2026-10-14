import React, { useEffect, useMemo, useState } from 'react';
import { Badge, Spinner } from 'react-bootstrap';
import { ModalAgregarDedo } from '../GestionEventosAsistencia/ModalAgregarDedo';
import { EstadoSincronizacion } from '../GestionEventosAsistencia/DataTablePersonas';
import { useEventosAsistenciaStore } from '../GestionEventosAsistencia/useEventosAsistenciaStore';
import { pinDesdeDni } from '../GestionEventosAsistencia/pinHuellero';
import { nombreDedo } from '../GestionEventosAsistencia/dedos';

// Huellas del cliente en los huelleros: muestra los dedos registrados, su sincronización y permite agregar otro.
// La primera huella crea a la persona en el huellero; las demás se agregan como dedos.
export const InputHuellasCliente = ({ dni: dniCliente, nombre, toast }) => {
	const dni = String(dniCliente ?? '').trim();
	const habilitado = dni.length > 3;
	const { obtenerPersonas, dataPersonas, estadoHuelleros, isLoadingPersonas, agregarPersona, agregarHuella } =
		useEventosAsistenciaStore();
	const [isOpenModal, setisOpenModal] = useState(false);
	// Entre registrar la huella y la siguiente consulta, para que el loading aparezca al instante
	const [recienRegistrada, setrecienRegistrada] = useState(false);

	useEffect(() => {
		if (habilitado) obtenerPersonas();
	}, [dni]);

	// Por DNI, por el PIN actual o por el de antes (que solo quitaba el 0 inicial)
	const personaHuellero = useMemo(() => {
		if (!habilitado) return null;
		const pin = pinDesdeDni(dni);
		const pinAnterior = parseInt(dni, 10);
		return dataPersonas.find((p) => p.dni === dni || p.pin === pin || p.pin === pinAnterior) || null;
	}, [dataPersonas, dni]);
	const dedos = personaHuellero?.dedos ?? [];
	const sincronizacion = personaHuellero?.sincronizacion;

	// Igual que en GestionEventosAsistencia: mientras haya cambios pendientes en un huellero EN LÍNEA
	// (llegan en segundos) o esperando su confirmación, se consulta cada 5 s. Los pendientes en
	// huelleros fuera de línea no se consultan (pueden tardar horas).
	const SINCRONIZANDO =
		recienRegistrada ||
		Boolean(sincronizacion?.pendiente && sincronizacion.huelleros.some((sn) => estadoHuelleros[sn] === 'online')) ||
		sincronizacion?.estado === 'esperando';
	useEffect(() => {
		if (!SINCRONIZANDO) return;
		const intervalo = setInterval(() => obtenerPersonas(true), 5000);
		return () => clearInterval(intervalo);
	}, [SINCRONIZANDO]);

	// memorizado: ModalAgregarDedo limpia su formulario cada vez que cambia "persona"
	const personaModal = useMemo(
		() => (isOpenModal ? { pin: personaHuellero?.pin ?? dni, nombre: personaHuellero?.nombre || nombre, dedos } : null),
		[isOpenModal]
	);

	const registrarHuella = async (_pin, { dedo, binaryData }) => {
		if (!binaryData?.trim()) return { ok: false, msg: 'El BinaryData es obligatorio' };
		if (personaHuellero) return agregarHuella(personaHuellero.pin, { dedo, binaryData });
		const resultado = await agregarPersona({ nombre: nombre.slice(0, 40), dni, dedo, binaryData });
		// Registrada desde otra pantalla mientras esta estaba abierta
		if (!resultado.ok && String(resultado.msg ?? '').startsWith('Ya existe una persona')) {
			return agregarHuella(pinDesdeDni(dni) ?? dni, { dedo, binaryData });
		}
		return resultado;
	};
	const onHuellaRegistrada = async ({ huelleros = [] }) => {
		toast?.current?.show({
			severity: 'success',
			summary: 'Huellas',
			detail: huelleros.length
				? `Huella registrada. Enviándose a: ${huelleros.join(', ')}`
				: 'Huella registrada. No hay huelleros activos.',
			life: 4000,
		});
		setrecienRegistrada(true);
		await obtenerPersonas(true);
		setrecienRegistrada(false);
	};

	const cargando = isLoadingPersonas && !personaHuellero;
	const texto = !habilitado ? (
		<span className="text-muted">El socio no tiene DNI registrado</span>
	) : cargando ? (
		<span className="text-muted">Cargando...</span>
	) : SINCRONIZANDO ? (
		<span className="text-info">Sincronizando con el huellero...</span>
	) : dedos.length === 0 ? (
		<span className="text-muted">Sin huellas · registrar huella</span>
	) : (
		<span className="fw-bold">
			{dedos.length} {dedos.length === 1 ? 'huella' : 'huellas'}
			<span className="fw-normal text-muted"> · agregar dedo</span>
		</span>
	);

	return (
		<>
			<div
				className={`form-control d-flex align-items-center gap-2 ${habilitado ? 'cursor-pointer' : 'bg-light'}`}
				onClick={() => {
					if (habilitado && !cargando) setisOpenModal(true);
				}}
				title={habilitado ? 'Registrar huella en el huellero' : 'Guarda primero el DNI del socio'}
				style={{ opacity: habilitado ? 1 : 0.6 }}
			>
				{cargando || SINCRONIZANDO ? (
					<Spinner animation="border" size="sm" variant={SINCRONIZANDO ? 'info' : 'secondary'} />
				) : (
					<i className={`mdi mdi-fingerprint ${habilitado ? 'text-primary' : 'text-muted'}`} style={{ fontSize: '1.2rem', lineHeight: 1 }}></i>
				)}
				{texto}
			</div>
			{personaHuellero && (
				<div className="mt-1">
					<div className="d-flex flex-wrap gap-1 mb-1">
						{dedos.map((dedo) => {
							// Estado de la huella de este dedo en el huellero
							const conError = sincronizacion?.dedosConError?.includes(dedo);
							const pendiente = sincronizacion?.dedosPendientes?.includes(dedo);
							return (
								<Badge
									key={dedo}
									bg={conError ? 'danger' : pendiente ? 'warning' : 'light'}
									text={conError ? undefined : 'dark'}
									className="border d-inline-flex align-items-center gap-1"
									title={conError ? 'El huellero rechazó esta huella' : pendiente ? 'Esta huella aún no llega al huellero' : undefined}
								>
									{pendiente && <i className="pi pi-clock" style={{ fontSize: '0.7rem' }} />}
									{conError && <i className="pi pi-exclamation-triangle" style={{ fontSize: '0.7rem' }} />}
									{nombreDedo(dedo)}
								</Badge>
							);
						})}
					</div>
					<EstadoSincronizacion sincronizacion={sincronizacion} estadoHuelleros={estadoHuelleros} />
				</div>
			)}
			<ModalAgregarDedo
				persona={personaModal}
				onHide={() => setisOpenModal(false)}
				agregarHuella={registrarHuella}
				onAgregada={onHuellaRegistrada}
				titulo="Registrar huella"
			/>
		</>
	);
};
