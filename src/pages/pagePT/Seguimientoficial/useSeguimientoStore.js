import { PTApi } from '@/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useState } from 'react';

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
						nombres_apellidos_cli: `${m.nombre_cli} ${m.apPaterno_cli} ${m.apMaterno_cli}`,
						id_cli: m.id_cli,
						uid: m.uid,
						fecha_inicio: venta.fecha_inicio,
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
		} catch (error) {
			console.log(error);
		}
	};
	return {
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
