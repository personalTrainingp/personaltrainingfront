import { PTApi } from '@/common';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
const generarAsistencia = ({ estabilidades, semana, fecha_inicio, fechaFin }) => {
	const resultado = [];

	const fechaIni = new Date(fecha_inicio);
	const fechaFinDate = new Date(fechaFin);

	// Mapa días
	const diasMap = {
		0: 'DOMINGO',
		1: 'LUNES',
		2: 'MARTES',
		3: 'MIERCOLES',
		4: 'JUEVES',
		5: 'VIERNES',
		6: 'SABADO',
	};

	// Contador de patrón por id_estabilidad
	const contadores = {};

	for (
		let fecha = new Date(fechaIni);
		fecha <= fechaFinDate;
		fecha.setDate(fecha.getDate() + 1)
	) {
		const diaNombre = diasMap[fecha.getDay()];

		const diaSemana = semana.find((d) => d.dia === diaNombre);

		let hora_fin = 0;
		let min_fin = 0;
		let hora_inicio = 0;
		let min_inicio = 0;

		if (diaSemana) {
			const estabilidad = estabilidades.find((e) => e.id === diaSemana.id_estabilidad);

			if (estabilidad) {
				const key = diaSemana.id_estabilidad;

				if (!contadores[key]) {
					contadores[key] = 0;
				}

				const ciclo = estabilidad.si + estabilidad.no;

				if (ciclo === 0) {
					// Fijo o ninguno → siempre asiste
					const [hf, mf] = diaSemana.hora_fin.split(':');
					const [hi, mi] = diaSemana.hora_inicio.split(':');
					hora_fin = parseInt(hf);
					min_fin = parseInt(mf);
					hora_inicio = parseInt(hi);
					min_inicio = parseInt(mi);
				} else {
					const posicion = contadores[key] % ciclo;

					if (posicion < estabilidad.si) {
						// ASISTE
						const [hf, mf] = diaSemana.hora_fin.split(':');
						const [hi, mi] = diaSemana.hora_inicio.split(':');
						hora_fin = parseInt(hf);
						min_fin = parseInt(mf);
						hora_inicio = parseInt(hi);
						min_inicio = parseInt(mi);
					} else {
						// NO ASISTE → queda en 0
					}

					contadores[key]++;
				}
			}
		}

		resultado.push({
			dia: fecha.getDate(),
			mes: fecha.getMonth() + 1,
			anio: fecha.getFullYear(),
			fecha_fin: `${hora_fin}:${min_fin}`,
			fecha_inicio: `${hora_inicio}:${min_inicio}`,
			hora_fin,
			min_fin,
			min_inicio,
			hora_inicio,
		});
	}

	return resultado;
};
export const usePlanillaStore = () => {
	const dispatch = useDispatch();
	const [dataPlanilla, setdataPlanilla] = useState([]);
	const obtenerSemana = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(`/contrato-empleado/semana/${id_empresa}`);
			const diasAsistencias = [
				{
					dia: 1,
					mes: 4,
					anio: 2026,
					hora_inicio: 7,
					min_inicio: 30,
					hora_fin: 16,
					min_fin: 30,
					estado: 'PUNTUAL',
				},
				{
					dia: 2,
					mes: 4,
					anio: 2026,
					hora_inicio: 7,
					min_inicio: 50,
					hora_fin: 16,
					min_fin: 30,
					estado: 'TARDANZA',
				},
				{
					dia: 3,
					mes: 4,
					anio: 2026,
					hora_inicio: 7,
					min_inicio: 30,
					hora_fin: 15,
					min_fin: 45,
					estado: 'SALIDA_ANTICIPADA',
				},
				{
					dia: 4,
					mes: 4,
					anio: 2026,
					hora_inicio: 7,
					min_inicio: 30,
					hora_fin: 14,
					min_fin: 0,
					estado: 'PUNTUAL',
				},
				{
					dia: 5,
					mes: 4,
					anio: 2026,
					hora_inicio: 0,
					min_inicio: 0,
					hora_fin: 0,
					min_fin: 0,
					estado: 'NO_LABORA',
				},

				{
					dia: 6,
					mes: 4,
					anio: 2026,
					hora_inicio: 7,
					min_inicio: 30,
					hora_fin: 16,
					min_fin: 30,
					estado: 'PUNTUAL',
				},
				{
					dia: 7,
					mes: 4,
					anio: 2026,
					hora_inicio: 8,
					min_inicio: 5,
					hora_fin: 16,
					min_fin: 0,
					estado: 'TARDANZA_Y_SALIDA_ANTICIPADA',
				},
				{
					dia: 9,
					mes: 4,
					anio: 2026,
					hora_inicio: 7,
					min_inicio: 30,
					hora_fin: 16,
					min_fin: 30,
					estado: 'PUNTUAL',
				},
				{
					dia: 10,
					mes: 4,
					anio: 2026,
					hora_inicio: 7,
					min_inicio: 40,
					hora_fin: 16,
					min_fin: 30,
					estado: 'TARDANZA',
				},
				{
					dia: 11,
					mes: 4,
					anio: 2026,
					hora_inicio: 7,
					min_inicio: 30,
					hora_fin: 13,
					min_fin: 30,
					estado: 'SALIDA_ANTICIPADA',
				},
				{
					dia: 12,
					mes: 4,
					anio: 2026,
					hora_inicio: 0,
					min_inicio: 0,
					hora_fin: 0,
					min_fin: 0,
					estado: 'NO_LABORA',
				},

				{
					dia: 13,
					mes: 4,
					anio: 2026,
					hora_inicio: 7,
					min_inicio: 30,
					hora_fin: 16,
					min_fin: 30,
					estado: 'PUNTUAL',
				},
				{
					dia: 14,
					mes: 4,
					anio: 2026,
					hora_inicio: 7,
					min_inicio: 30,
					hora_fin: 15,
					min_fin: 30,
					estado: 'SALIDA_ANTICIPADA',
				},
				{
					dia: 15,
					mes: 4,
					anio: 2026,
					hora_inicio: 7,
					min_inicio: 55,
					hora_fin: 16,
					min_fin: 30,
					estado: 'TARDANZA',
				},
				{
					dia: 16,
					mes: 4,
					anio: 2026,
					hora_inicio: 8,
					min_inicio: 10,
					hora_fin: 15,
					min_fin: 0,
					estado: 'TARDANZA_Y_SALIDA_ANTICIPADA',
				},
				{
					dia: 17,
					mes: 4,
					anio: 2026,
					hora_inicio: 7,
					min_inicio: 30,
					hora_fin: 16,
					min_fin: 30,
					estado: 'PUNTUAL',
				},
				{
					dia: 18,
					mes: 4,
					anio: 2026,
					hora_inicio: null,
					min_inicio: null,
					hora_fin: null,
					min_fin: null,
					estado: 'INASISTENCIA',
				},
				{
					dia: 19,
					mes: 4,
					anio: 2026,
					hora_inicio: 0,
					min_inicio: 0,
					hora_fin: 0,
					min_fin: 0,
					estado: 'NO_LABORA',
				},

				{
					dia: 20,
					mes: 4,
					anio: 2026,
					hora_inicio: 7,
					min_inicio: 30,
					hora_fin: 16,
					min_fin: 30,
					estado: 'PUNTUAL',
				},
				{
					dia: 21,
					mes: 4,
					anio: 2026,
					hora_inicio: 7,
					min_inicio: 45,
					hora_fin: 16,
					min_fin: 30,
					estado: 'TARDANZA',
				},
				{
					dia: 22,
					mes: 4,
					anio: 2026,
					hora_inicio: 7,
					min_inicio: 30,
					hora_fin: 16,
					min_fin: 30,
					estado: 'PUNTUAL',
				},
				{
					dia: 23,
					mes: 4,
					anio: 2026,
					hora_inicio: null,
					min_inicio: null,
					hora_fin: null,
					min_fin: null,
					estado: 'INASISTENCIA',
				},
				{
					dia: 24,
					mes: 4,
					anio: 2026,
					hora_inicio: 7,
					min_inicio: 30,
					hora_fin: 16,
					min_fin: 0,
					estado: 'SALIDA_ANTICIPADA',
				},
				{
					dia: 25,
					mes: 4,
					anio: 2026,
					hora_inicio: 7,
					min_inicio: 30,
					hora_fin: 14,
					min_fin: 0,
					estado: 'PUNTUAL',
				},
				{
					dia: 26,
					mes: 4,
					anio: 2026,
					hora_inicio: 0,
					min_inicio: 0,
					hora_fin: 0,
					min_fin: 0,
					estado: 'NO_LABORA',
				},

				{
					dia: 27,
					mes: 4,
					anio: 2026,
					hora_inicio: 7,
					min_inicio: 30,
					hora_fin: 16,
					min_fin: 30,
					estado: 'PUNTUAL',
				},
				{
					dia: 28,
					mes: 4,
					anio: 2026,
					hora_inicio: 8,
					min_inicio: 0,
					hora_fin: 16,
					min_fin: 30,
					estado: 'TARDANZA',
				},
				{
					dia: 29,
					mes: 4,
					anio: 2026,
					hora_inicio: 7,
					min_inicio: 30,
					hora_fin: 15,
					min_fin: 30,
					estado: 'SALIDA_ANTICIPADA',
				},
				{
					dia: 30,
					mes: 4,
					anio: 2026,
					hora_inicio: 7,
					min_inicio: 30,
					hora_fin: 16,
					min_fin: 30,
					estado: 'PUNTUAL',
				},
			].filter((f) => f.hora_inicio > 0 && f.hora_fin > 0);
			const dataColaboradores = data.empleados?.map((e) => {
				const dias_pendientes = generarAsistencia({
					estabilidades: [
						{ id: 1695, label: '2 dias si y un dia no', si: 2, no: 1 },
						{ id: 1693, label: '1 dias si y un dia no', si: 1, no: 1 },
						{ id: 1694, label: 'Fijo', si: 0, no: 0 },
						{ id: 1694, label: 'NINGUNO', si: 0, no: 0 },
					],
					fecha_inicio: '2026-01-01T00:00:00.000Z',
					fechaFin: '2026-10-30T00:00:00.000Z',
					semana: [
						{
							dia: 'LUNES',
							id_estabilidad: 1694,
							hora_inicio: '07:00:00',
							hora_fin: '18:00:00',
						},
						{
							dia: 'MARTES',
							id_estabilidad: 1694,
							hora_inicio: '07:00:00',
							hora_fin: '18:00:00',
						},
						{
							dia: 'MIERCOLES',
							id_estabilidad: 1694,
							hora_inicio: '07:00:00',
							hora_fin: '18:00:00',
						},
						{
							dia: 'JUEVES',
							id_estabilidad: 1694,
							hora_inicio: '07:00:00',
							hora_fin: '18:00:00',
						},
						{
							dia: 'VIERNES',
							id_estabilidad: 1694,
							hora_inicio: '07:00:00',
							hora_fin: '18:00:00',
						},
						{
							dia: 'SABADO',
							id_estabilidad: 1693,
							hora_inicio: '07:00:00',
							hora_fin: '13:00:00',
						},
					],
				})
					.filter((f) => f.mes === 4 && f.anio == 2026)
					.map((g, i, a) => {
						const isAsistido = diasAsistencias.find(
							(d) => d.dia == g.dia && d.anio == g.anio && d.mes == g.mes
						);
						const sueldo_dia = e._empl[0].sueldo / a.length;
						const sueldo_min = 540 / sueldo_dia; //SUELDO POR CADA MINUTO DEL DIA, POR DEFECTO ES 540
						const minutosTarde = isAsistido?.min_inicio - g?.min_inicio;
						return {
							...g,
							sueldo_dia,
							sueldo_min,
							isAsistido,
							sueldo_neto: '',
							minutosTarde,
							// estado: `${isAsistido?.hora_inicio == 0 ? 'NO ASISTIO' : `${g.hora_inicio < isAsistido?.hora_inicio ? 'TARDANZA' : ''}`}`,
						};
					});

				return {
					cargo: '',
					colaborador: `${e.nombre_empl} ${e.apPaterno_empl}`,
					sueldo: e._empl[0].sueldo,
					dias_pendientes: dias_pendientes.filter((f) => f.hora_inicio !== 0),
					dias_asistencias: diasAsistencias.filter((f) => f.hora_inicio !== 0),
				};
			});
			console.log({ data: data, dataColaboradores, diasAsistencias });
			setdataPlanilla(dataColaboradores);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerSemana,
		dataPlanilla,
	};
};


function obtenerMinutosPorNumero(hora=2, min=0) {
	return (hora*60)+min
}