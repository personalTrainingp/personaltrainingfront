import { PTApi } from '@/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useState } from 'react';
import { dniTieneHuella } from '../GestionEventosAsistencia/pinHuellero';

dayjs.extend(utc);

// Perú es UTC-5 todo el año (sin horario de verano).
const OFFSET_PERU_HORAS = 5;

// Fecha de hoy en Perú como 'YYYY-MM-DD', sin depender de la zona horaria del navegador.
export const hoyPeru = () => dayjs.utc().subtract(OFFSET_PERU_HORAS, 'hour').format('YYYY-MM-DD');

// fecha_vencimiento es una fecha "solo fecha": el backend la envía como medianoche UTC.
// Se toma el día calendario en UTC; restarle 5h la haría caer en el día anterior.
const fechaCalendario = (fecha) => (fecha ? dayjs.utc(fecha).format('YYYY-MM-DD') : null);

export const useSeguimientoStore = () => {
	const [dataSeguimientoxFecha, setdataSeguimientoxFecha] = useState([]);
	// PINs del huellero (= DNI) con al menos una huella. null mientras se consulta.
	const [pinesConHuella, setpinesConHuella] = useState(null);
	const obtenerPinesConHuella = async () => {
		try {
			setpinesConHuella(null);
			const { data } = await PTApi.get('/eventos-asistencia/personas/con-huella');
			setpinesConHuella(new Set((data.pines || []).map(Number)));
		} catch (error) {
			console.log(error);
			setpinesConHuella(new Set());
		}
	};
	// true / false, o null si aun no se termino de consultar
	const tieneHuella = (dni) => (pinesConHuella === null ? null : dniTieneHuella(pinesConHuella, dni));
	const obtenerSeguimientoxFecha = async () => {
		try {
			const { data } = await PTApi.get('/seguimiento/');
			const hoy = hoyPeru();
			const dataAlter = data.dataSeguimiento
				.map((m) => {
					const ultimaMembresia = [...(m?.cli_seguimiento ?? [])].sort(
						(a, b) => b.id_membresia - a.id_membresia
					)[0];
					const venta = ultimaMembresia?.venta;
					if (!ultimaMembresia || !venta) return null;
					const fecha_vencimiento = fechaCalendario(ultimaMembresia.fecha_vencimiento);
					if (!fecha_vencimiento) return null;
					const ultimoPrograma =
						venta.cambio_programa?.length > 0
							? venta.cambio_programa[0]?.pgm?.name_pgm
							: venta.tb_ProgramaTraining?.name_pgm;
					return {
						...ultimaMembresia,
						horario: venta.horario?.split('T')[1]?.split('.')[0] || '12:00:00',
						nombre_programa: `${ultimoPrograma ?? 'SIN DEFINIR'}`,
						ultimoPrograma: ultimoPrograma,
						nombres_cli: m.nombre_cli,
						apPaterno_cli: m.apPaterno_cli,
						apMaterno_cli: m.apMaterno_cli,
						email_cli: m.email_cli,
						tel_cli: m.tel_cli,
						dni: m.numDoc_cli,
						// contrato de la ultima membresia: firmado, sin firmar, o no requiere (monto 0)
						contrato:
							Number(venta.tarifa_monto) === 0
								? 'NO REQUIERE'
								: venta.firma_cli
									? 'CON CONTRATO'
									: 'SIN CONTRATO',
						nombres_apellidos_cli: `${m.nombre_cli} ${m.apPaterno_cli} ${m.apMaterno_cli}`,
						id_cli: m.id_cli,
						uid: m.uid,
						fecha_inicio: venta.fecha_inicio,
						// venta de la ultima membresia del socio (monto de esa membresia)
						id_venta: venta.id_venta,
						fecha_venta: venta.tb_ventum?.fecha_venta
							? dayjs.utc(venta.tb_ventum.fecha_venta).subtract(OFFSET_PERU_HORAS, 'hour').format('YYYY-MM-DD')
							: '',
						monto_venta: Number(venta.tarifa_monto) || 0,
						// membresias distintas que tuvo el socio (con venta)
						cantidad_membresias: new Set(
							(m?.cli_seguimiento ?? []).filter((s) => s.venta).map((s) => s.id_membresia)
						).size,
						fecha_vencimiento,
						fecha_vencimiento_: dayjs
							.utc(fecha_vencimiento)
							.format('dddd DD [DE] MMMM [DEL] YYYY'),
						sesionesPendientes: diasHabilesLunASab(hoy, fecha_vencimiento),
						diasVencidos: dayjs.utc(hoy).diff(dayjs.utc(fecha_vencimiento), 'day'),
					};
				})
				.filter(Boolean);
			setdataSeguimientoxFecha(dataAlter);
			// las huellas se consultan despues de mostrar los socios
			obtenerPinesConHuella();
		} catch (error) {
			console.log(error);
		}
	};
	return {
		tieneHuella,
		obtenerSeguimientoxFecha,
		dataSeguimientoxFecha,
	};
};

// Sesiones entre dos fechas 'YYYY-MM-DD' contando lunes a sábado (el gimnasio cierra domingos).
// Incluye el día de vencimiento; si vence hoy queda 1 sesión (la de hoy). Negativo si ya venció.
const diasHabilesLunASab = (inicio, fin) => {
	let cursor = dayjs.utc(inicio);
	const f = dayjs.utc(fin);
	if (f.isBefore(cursor, 'day')) return -diasHabilesLunASab(fin, inicio);
	let dias = 0;
	while (!cursor.isAfter(f, 'day')) {
		if (cursor.day() !== 0) dias++;
		cursor = cursor.add(1, 'day');
	}
	return dias;
};
