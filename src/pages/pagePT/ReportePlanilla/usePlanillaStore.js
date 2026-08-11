import { PTApi } from '@/common';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
const generarDiasContratados = ({ estabilidades, semana, fecha_inicio, fechaFin }) => {
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
	const obtenerSemana = async (id_empresa, arrayDate) => {
		try {
			const { data } = await PTApi.get(`/contrato-empleado/semana/${id_empresa}`);
			console.log({ data });

			const dataColaboradores = data.empleados?.map((e) => {
				const marcacionesPorDia = obtenerMarcacionesPorDia(e.tb_marcacions);
				console.log({
					marcacionesPorDia,
					marc: e._empl[0].contrato_semana.map((m2) => {
						return {
							...m2,
							hora_inicio: m2.hora_inicio.split('T')[1].split('.')[0],
							hora_fin: m2.hora_fin.split('T')[1].split('.')[0],
						};
					}),
				});

				const dias_pendientes = generarDiasContratados({
					estabilidades: [
						{ id: 1695, label: '2 dias si y un dia no', si: 2, no: 1 },
						{ id: 1693, label: '1 dias si y un dia no', si: 1, no: 1 },
						{ id: 1694, label: 'Fijo', si: 0, no: 0 },
						{ id: 1694, label: 'NINGUNO', si: 0, no: 0 },
					],
					fecha_inicio: '2026-07-01T00:00:00.000Z',
					fechaFin: '2026-07-31T00:00:00.000Z',
					semana: e._empl[0].contrato_semana.map((m2) => {
						const horaIni = new Date(m2.hora_inicio);
						const horaFin = new Date(m2.hora_fin);
						return {
							...m2,
							hora_inicio: `${String(horaIni.getUTCHours()).padStart(2, '0')}:${String(horaIni.getUTCMinutes()).padStart(2, '0')}`,
							hora_fin: `${String(horaFin.getUTCHours()).padStart(2, '0')}:${String(horaFin.getUTCMinutes()).padStart(2, '0')}`,
						};
					}),
				})
					.filter((f) => f.mes === 7 && f.anio == 2026)
					.map((g, i, a) => {
						let isAsistido = marcacionesPorDia.find(
							(d) => d.dia == g.dia && d.anio == g.anio && d.mes == g.mes
						);
						if (!isAsistido) {
							isAsistido = {
								anio: g.anio,
								dia: g.dia,
								hora_fin: null,
								hora_inicio: null,
								mes: g.mes,
								min_fin: null,
								min_inicio: null,
							};
						}
						const sueldo_dia = e._empl[0].sueldo / a.length;
						const minutosContratados = 540; //POR DEFECTO
						const sueldo_min = sueldo_dia / minutosContratados;
						const minutosAsistidos =
							isAsistido.hora_inicio === null
								? 0
								: obtenerMinutosPorNumero(g.hora_fin, g.min_fin) -
									obtenerMinutosPorNumero(
										isAsistido?.hora_inicio,
										isAsistido?.min_inicio
									);
						return {
							...g,
							sueldo_dia,
							jornada: {
								...isAsistido,
								minutosAsistidos,
								sueldo_jornada: sueldo_min * minutosAsistidos,
							},
							sueldo_neto: '',
							minutosContratados,
							minutosTarde: minutosContratados - minutosAsistidos,
							// estado: `${isAsistido?.hora_inicio == 0 ? 'NO ASISTIO' : `${g.hora_inicio < isAsistido?.hora_inicio ? 'TARDANZA' : ''}`}`,
						};
					});

				return {
					cargo: '',
					colaborador: `${e.nombre_empl} ${e.apPaterno_empl}`,
					sueldo: e._empl[0].sueldo,
					dias_pendientes: dias_pendientes.filter((f) => f.hora_inicio !== 0),
					dias_tardanzas: dias_pendientes
						.filter((f) => f.hora_inicio !== 0)
						.filter((f) => f.minutosContratados > f.jornada.minutosAsistidos),
					dias_asistencias: marcacionesPorDia.filter((f) => f.hora_inicio !== 0),
				};
			});
			console.log({ data: data, dataColaboradores });
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

function obtenerMinutosPorNumero(hora = 2, min = 0) {
	return hora * 60 + min;
}

function obtenerFechas(inicio, fin) {
	const fechas = [];
	const fechaActual = new Date(inicio);

	while (fechaActual <= fin) {
		fechas.push({
			dia: fechaActual.getDate(),
			mes: fechaActual.getMonth() + 1, // los meses van de 0 a 11
			anio: fechaActual.getFullYear(),
		});

		fechaActual.setDate(fechaActual.getDate() + 1);
	}

	return fechas;
}
const obtenerMarcacionesPorDia = (marcaciones) => {
	const grupos = {};

	marcaciones.forEach((m) => {
		const fecha = new Date(m.tiempo_marcacion_new);

		const dia = fecha.getUTCDate();
		const mes = fecha.getUTCMonth();
		const anio = fecha.getUTCFullYear();

		const key = `${anio}-${mes}-${dia}`;

		if (!grupos[key]) {
			grupos[key] = [];
		}

		grupos[key].push({
			fecha,
			dia,
			mes,
			anio,
		});
	});

	return Object.values(grupos).map((marcacionesDia) => {
		// Ordenar por hora
		marcacionesDia.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

		const inicio = marcacionesDia[0].fecha;
		const fin = marcacionesDia[marcacionesDia.length - 1].fecha;

		return {
			dia: marcacionesDia[0].dia,
			mes: marcacionesDia[0].mes,
			anio: marcacionesDia[0].anio,

			hora_inicio: inicio.getUTCHours(),
			min_inicio: inicio.getUTCMinutes(),

			hora_fin: fin.getUTCHours(),
			min_fin: fin.getUTCMinutes(),
		};
	});
};
