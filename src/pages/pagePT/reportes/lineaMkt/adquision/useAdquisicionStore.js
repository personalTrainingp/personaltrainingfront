// import { PTApi } from '@/common';
// import { DateMaskString } from '@/components/CurrencyMask';
// import { onDataFail, onSetDataView } from '@/store/data/dataSlice';
// import dayjs from 'dayjs';
// import 'dayjs/locale/es';
// import { useState } from 'react';
// import { useDispatch } from 'react-redux';

// dayjs.locale('es');
// function formatDateToSQLServerWithDayjs(date) {
// 	return dayjs(date).toISOString(); // Asegurar que esté en UTC
// 	// .format('YYYY-MM-DD HH:mm:ss.SSS0000 +00:00');
// }

// function eliminarDuplicadosPorId(data) {
// 	const idsProcesados = new Set();
// 	return data
// 		.filter(({ detalle_ventaMembresium }) => {
// 			const idVenta = detalle_ventaMembresium?.tb_ventum?.id;
// 			if (idVenta && !idsProcesados.has(idVenta)) {
// 				idsProcesados.add(idVenta);
// 				return true;
// 			}
// 			return false;
// 		})
// 		.map((orig) => {
// 			const venta = orig.detalle_ventaMembresium?.tb_ventum;
// 			if (!venta) return orig;

// 			// formateo
// 			const fechaFormateada = venta.fecha_venta
// 				? DateMaskString(venta.fecha_venta)
// 				: venta.fecha_venta;

// 			// clonar sólo el nivel que necesitamos cambiar
// 			const nuevoVentum = {
// 				...venta,
// 				fecha_venta: fechaFormateada,
// 			};

// 			const nuevaMembresia = {
// 				...orig.detalle_ventaMembresium,
// 				tb_ventum: nuevoVentum,
// 			};

// 			// devolvemos un item completamente “nuevo”
// 			return {
// 				...orig,
// 				detalle_ventaMembresium: nuevaMembresia,
// 			};
// 		});
// }

// function agruparPorMesYAnio(data) {
// 	const inicio = dayjs('2024-09-01'); // Empezar desde septiembre 2024
// 	const fin = dayjs(); // Fecha actual

// 	const meses = [];
// 	let fechaIteracion = inicio;

// 	// Generamos los meses en orden cronológico
// 	while (fechaIteracion.isBefore(fin) || fechaIteracion.isSame(fin, 'month')) {
// 		meses.push({
// 			anio: fechaIteracion.format('YYYY'),
// 			mes: fechaIteracion.format('MMMM'),
// 			fecha: fechaIteracion.format('MMMM YYYY'),
// 			items: [],
// 		});
// 		fechaIteracion = fechaIteracion.add(1, 'month');
// 	}

// 	// Agrupar datos por mes
// 	data?.forEach((item) => {
// 		const mesVenta = DateMaskString(
// 			item.detalle_ventaMembresium?.tb_ventum.fecha_venta,
// 			'MMMM YYYY'
// 		);
// 		const grupo = meses.find((m) => m.fecha === mesVenta);

// 		if (grupo) {
// 			grupo.items.push(item);
// 		}
// 	});
// 	const nuevaData = meses.map((m) => {
// 		return {
// 			...m,
// 			itemsDia: [],
// 		};
// 	});

// 	return nuevaData;
// }

// function agruparPorMesYAnioYDia(data) {
// 	const generarMeses = (anio, mes) => {
// 		const meses = [];
// 		for (let dia = 1; dia <= 31; dia++) {
// 			const param = `${dia.toString().padStart(2, '0')}-${mes.toString().padStart(2, '0')}-${anio}`;
// 			meses.push({
// 				dia,
// 				mes: mes.toString().padStart(2, '0'),
// 				anio,
// 				param,
// 				data,
// 				items: [],
// 			});
// 		}
// 		return meses;
// 	};

// 	const grouped = data.reduce((acc, item) => {
// 		const fecha = new Date(item.detalle_ventaMembresium.tb_ventum.fecha_venta);
// 		const dia = fecha.getDate();
// 		const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
// 		const anio = fecha.getFullYear();
// 		const param = `${dia.toString().padStart(2, '0')}-${mes}-${anio}`;

// 		let group = acc.find((group) => group.param === param);
// 		if (!group) {
// 			group = {
// 				dia,
// 				mes,
// 				anio,
// 				param,
// 				items: [],
// 			};
// 			acc.push(group);
// 		}

// 		group.items.push(item);
// 		return acc;
// 	}, []);

// 	// Asegúrate de que todos los días del mes estén presentes
// 	const anio = 2024;
// 	const mes = 9; // Septiembre
// 	const todosLosDias = generarMeses(anio, mes);

// 	// Combina ambos arreglos para asegurar que todos los días estén presentes
// 	const resultadoFinal = todosLosDias.map((dia) => {
// 		const grupoExistente = grouped.find(
// 			(group) => group.dia === dia.dia && group.mes === dia.mes && group.anio === dia.anio
// 		);

// 		return grupoExistente ? grupoExistente : dia;
// 	});
// 	console.log({ todosLosDias });
// 	// console.log({ todosLosDias, grouped }, 'grr');

// 	return resultadoFinal;
// }

// export const useAdquisicionStore = () => {
// 	const [data, setdata] = useState([]);
// 	const dispatch = useDispatch();
// 	const obtenerTodoVentas = async () => {
// 		try {
// 			const RANGE_DATE = [new Date(2024, 8, 16), new Date()];
// 			const { data: dataCom } = await PTApi.get(
// 				'/venta/reporte/obtener-comparativo-resumen',
// 				{
// 					params: {
// 						arrayDate: [
// 							formatDateToSQLServerWithDayjs(RANGE_DATE[0]),
// 							formatDateToSQLServerWithDayjs(RANGE_DATE[1]),
// 						],
// 					},
// 				}
// 			);
// 			const { data: dataFechas } = await PTApi.get(
// 				'/parametros/get_params_periodo/reporte-ventas/comparativaFechas'
// 			);

// 			const ventasSinCero = dataCom.ventasProgramas.filter(
// 				(f) => f.detalle_ventaMembresium.tarifa_monto !== 0
// 			);
// 			// const test = eliminarDuplicadosPorId(ventasSinCero).map(
// 			// 	(v) => v.detalle_ventaMembresium.tb_ventum
// 			// );
// 			// console.log(eliminarDuplicadosPorId(ventasSinCero), test, 'aqui 177');

// 			// dispatch(onDataFail(ventasSinCero));
// 			dispatch(
// 				onSetDataView(
// 					filtrarPorIntervalos(eliminarDuplicadosPorId(ventasSinCero), dataFechas)
// 				)
// 			);

// 			setdata([]);
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	};
// 	return {
// 		obtenerTodoVentas,
// 		data,
// 	};
// };
// function filtrarPorIntervalos(tb_data, tb_fechas) {
// 	return tb_fechas.map(({ fecha_desde_param, fecha_hasta_param }) => {
// 		const desde = new Date(fecha_desde_param);
// 		const hasta = new Date(fecha_hasta_param);

// 		const items_filters = tb_data.filter((item) => {
// 			const venta = new Date(item.detalle_ventaMembresium.tb_ventum.fecha_venta);
// 			return venta >= desde && venta <= hasta;
// 		});
// 		const items = groupByDate(items_filters)[0];

// 		return {
// 			fechas: {
// 				fecha_desde: fecha_desde_param,
// 				fecha_hasta: fecha_hasta_param,
// 			},
// 			items_filters: items,
// 		};
// 	});
// }

// function groupByDate(data) {
// 	// 1) Agrupa los elementos por clave "YYYY-MM"
// 	const temp = {};
// 	data.forEach((item) => {
// 		// Extraemos fecha “YYYY-MM-DD”
// 		const fechaStr = item.detalle_ventaMembresium.tb_ventum.fecha_venta.split('T')[0];
// 		const [anioStr, mesStr, diaStr] = fechaStr.split('-');
// 		const anio = parseInt(anioStr, 10);
// 		const mes = mesStr; // dos dígitos
// 		const dia = parseInt(diaStr, 10);
// 		const key = `${anioStr}-${mesStr}`;

// 		if (!temp[key]) {
// 			temp[key] = { anio, mes, byDay: {} };
// 		}
// 		if (!temp[key].byDay[dia]) {
// 			temp[key].byDay[dia] = [];
// 		}
// 		temp[key].byDay[dia].push(item);
// 	});

// 	// 2) Para cada mes, construye un array de 31 días
// 	return Object.values(temp).map(({ anio, mes, byDay }) => {
// 		const dias = [];
// 		for (let day = 1; day <= 31; day++) {
// 			dias.push({
// 				dia: day,
// 				mes,
// 				anio,
// 				items: byDay[day] || [],
// 			});
// 		}
// 		return dias;
// 	});
// }

import { PTApi } from '@/common';
import { DateMaskString } from '@/components/CurrencyMask';
import { onDataFail, onSetDataView } from '@/store/data/dataSlice';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

dayjs.locale('es');
function formatDateToSQLServerWithDayjs(date) {
	return dayjs(date).toISOString(); // Asegurar que esté en UTC
	// .format('YYYY-MM-DD HH:mm:ss.SSS0000 +00:00');
}

function eliminarDuplicadosPorId(data) {
	const idsProcesados = new Set();
	return data
		.filter(({ detalle_ventaMembresium }) => {
			const idVenta = detalle_ventaMembresium?.tb_ventum?.id;
			const fecha_venta = detalle_ventaMembresium?.tb_ventum?.fecha_venta;
			if (idVenta && !idsProcesados.has(idVenta)) {
				idsProcesados.add(idVenta);
				return true;
			}
			return false;
		}) // 2) Formateamos la fecha de venta
		.map((orig) => {
			const venta = orig.detalle_ventaMembresium?.tb_ventum;
			if (!venta) return orig;

			// formateo
			const fechaFormateada = venta.fecha_venta
				? DateMaskString(venta.fecha_venta)
				: venta.fecha_venta;

			// clonar sólo el nivel que necesitamos cambiar
			const nuevoVentum = {
				...venta,
				fecha_venta: fechaFormateada,
			};

			const nuevaMembresia = {
				...orig.detalle_ventaMembresium,
				tb_ventum: nuevoVentum,
			};

			// devolvemos un item completamente “nuevo”
			return {
				...orig,
				detalle_ventaMembresium: nuevaMembresia,
			};
		});
}

function agruparPorMesYAnio(data) {
	const inicio = dayjs('2024-09-01'); // Desde septiembre 2024
	const fin = dayjs(); // Hasta el mes actual

	const meses = [];
	let fechaIteracion = inicio;

	// Generamos los meses con estructura vacía
	while (fechaIteracion.isBefore(fin) || fechaIteracion.isSame(fin, 'month')) {
		meses.push({
			anio: fechaIteracion.format('YYYY'),
			mes: fechaIteracion.format('MMMM'),
			fecha: fechaIteracion.format('MMMM YYYY'),
			items: [],
		});
		fechaIteracion = fechaIteracion.add(1, 'month');
	}

	// Agrupar datos por mes
	data?.forEach((item) => {
		const mesVenta = DateMaskString(
			item.detalle_ventaMembresium?.tb_ventum?.fecha_venta,
			'MMMM YYYY'
		);
		const grupo = meses.find((m) => m.fecha === mesVenta);
		if (grupo) grupo.items.push(item);
	});

	// Retornar meses con items agrupados por día (aunque vacíos)
	const nuevaData = meses.map((m) => {
		const itemsDia = [];
		for (let d = 1; d <= 31; d++) {
			itemsDia.push({
				dia: d,
				mes: dayjs().month(m.mes).format('MM'), // mes en "09", "10", etc.
				anio: parseInt(m.anio),
				items: [],
			});
		}

		// Agrupar si hay items
		if (m.items.length > 0) {
			const agrupado = groupByDate(m.items)[0];
			if (agrupado) {
				agrupado.forEach((itemDia, i) => {
					itemsDia[i] = itemDia; // sobrescribe solo si hay info
				});
			}
		}

		return {
			...m,
			itemsDia,
		};
	});

	return nuevaData;
}

function agruparPorMesYAnioYDia(data) {
	const generarMeses = (anio, mes) => {
		const meses = [];
		for (let dia = 1; dia <= 31; dia++) {
			const param = `${dia.toString().padStart(2, '0')}-${mes.toString().padStart(2, '0')}-${anio}`;
			meses.push({
				dia,
				mes: mes.toString().padStart(2, '0'),
				anio,
				param,
				data,
				items: [],
			});
		}
		return meses;
	};

	const grouped = data.reduce((acc, item) => {
		const fecha = new Date(item.detalle_ventaMembresium.tb_ventum.fecha_venta);
		const dia = fecha.getDate();
		const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
		const anio = fecha.getFullYear();
		const param = `${dia.toString().padStart(2, '0')}-${mes}-${anio}`;

		let group = acc.find((group) => group.param === param);
		if (!group) {
			group = {
				dia,
				mes,
				anio,
				param,
				items: [],
			};
			acc.push(group);
		}

		group.items.push(item);
		return acc;
	}, []);

	// Asegúrate de que todos los días del mes estén presentes
	const anio = 2024;
	const mes = 9; // Septiembre
	const todosLosDias = generarMeses(anio, mes);

	// Combina ambos arreglos para asegurar que todos los días estén presentes
	const resultadoFinal = todosLosDias.map((dia) => {
		const grupoExistente = grouped.find(
			(group) => group.dia === dia.dia && group.mes === dia.mes && group.anio === dia.anio
		);

		return grupoExistente ? grupoExistente : dia;
	});
	console.log({ todosLosDias });
	// console.log({ todosLosDias, grouped }, 'grr');

	return resultadoFinal;
}

function agruparPorVendedores(data) {
	const resultado = [];

	data?.forEach((item) => {
		const { nombre_empl } = item.detalle_ventaMembresium.tb_ventum.tb_empleado;

		// Verificar si ya existe un grupo con la misma cantidad de sesiones
		let grupo = resultado?.find((g) => g.lbel === nombre_empl);

		if (!grupo) {
			// Si no existe, crear un nuevo grupo
			grupo = {
				lbel: nombre_empl,
				// propiedad: <div style={{width: '350px'}}>{semanas_st} SEMANAS <br/> {sesiones} Sesiones</div>,
				propiedad: `${nombre_empl}`,
				nombre_empl,
				items: [],
			};
			resultado.push(grupo);
		}

		// Agregar el item al grupo correspondiente
		grupo.items.push(item);
	});

	return resultado.sort((a, b) => b.items.length - a.items.length);
}

function agruparPorPgm(data) {
	const resultado = [];

	data?.forEach((item) => {
		const { name_pgm } = item;

		// Verificar si ya existe un grupo con la misma cantidad de sesiones
		let grupo = resultado?.find((g) => g.lbel === name_pgm);

		if (!grupo) {
			// Si no existe, crear un nuevo grupo
			grupo = {
				lbel: name_pgm,
				// propiedad: <div style={{width: '350px'}}>{semanas_st} SEMANAS <br/> {sesiones} Sesiones</div>,
				propiedad: `${name_pgm}`,
				name_pgm,
				items: [],
			};
			resultado.push(grupo);
		}

		// Agregar el item al grupo correspondiente
		grupo.items.push(item);
	});

	return resultado.sort((a, b) => b.items.length - a.items.length);
}

//AGRUPAR POR HORARIOS
function agruparPorHorarios(data) {
	const resultado = [];

	data?.forEach((item) => {
		const { horario, tarifa_monto, tb_ventum } = item.detalle_ventaMembresium;
		const { fecha_venta } = tb_ventum;

		const formatHorario = dayjs.utc(horario).format('A');
		//   console.log(horario, formatHorario, "horarrrr");
		// Verificar si ya existe un grupo con la misma cantidad de sesiones
		let grupo = resultado?.find((g) => g.propiedad === formatHorario);

		if (!grupo) {
			// Si no existe, crear un nuevo grupo
			grupo = { propiedad: formatHorario, items: [], tarifa_monto };
			resultado.push(grupo);
		}
		// Agregar el item al grupo correspondiente
		grupo.items.push(item);
	});

	return resultado
		.sort((a, b) => b.items.length - a.items.length)
		.sort((a, b) => b.tarifa_monto - a.tarifa_monto);
}

const agruparPorAnio = (datos) => {
	return Object.values(
		datos.reduce((acc, item) => {
			if (!acc[item.anio]) {
				acc[item.anio] = { anio: item.anio, items: [] };
			}
			acc[item.anio].items.push(item);
			return acc;
		}, {})
	);
};

export const useAdquisicionStore = () => {
	const [data, setdata] = useState([]);
	const [dataVentas, setdataVentas] = useState([]);
	const [dataUnif, setdataUnif] = useState([]);
	const [dataVendedores, setdataVendedores] = useState([]);
	const [dataProgramas, setdataProgramasXAnio] = useState([]);
	const [dataProgramasx, setdataProgramasx] = useState([]);
	const [dataTotalPgmX, setdataTotalPgmX] = useState([]);
	const [dataVendedorAnualizados, setdataVendedorAnualizados] = useState([]);
	const dispatch = useDispatch();
	const obtenerTodoVentas = async () => {
		try {
			const RANGE_DATE = [new Date(2024, 8, 16), new Date()];
			const { data } = await PTApi.get('/venta/reporte/obtener-comparativo-resumen', {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(RANGE_DATE[0]),
						formatDateToSQLServerWithDayjs(RANGE_DATE[1]),
					],
				},
			});
			const ventasSinCero = data.ventasProgramas.filter(
				(f) => f.detalle_ventaMembresium.tarifa_monto !== 0
			);
			dispatch(onDataFail(ventasSinCero));
			const agregarItemsDias = agruparPorMesYAnio(
				eliminarDuplicadosPorId(ventasSinCero),
				'2024-09-01',
				9
			).map((f) => {
				return {
					...f,
				};
			});
			const vendedores = agruparPorVendedores(eliminarDuplicadosPorId(ventasSinCero)).map(
				(f) => {
					return {
						...f,
						items: agruparPorMesYAnio(f.items, '2024-09-01', 9).map((m) => {
							return {
								...m,
							};
						}),
					};
				}
			);

			const programas = agruparPorPgm(eliminarDuplicadosPorId(ventasSinCero)).map((f) => {
				return {
					...f,
					items: agruparPorMesYAnio(f.items, '2024-09-01', 9).map((m) => {
						return {
							...m,
							itemVendedores: (() => {
								const getNombre = (f) => f.nombre_empl || f.lbl || f.propiedad;
								const calcularDatos = (items) => {
									const socios = items.length;
									const tarifa = items.reduce(
										(total, item) =>
											total +
											(item?.detalle_ventaMembresium?.tarifa_monto || 0),
										0
									);
									return {
										socios,
										tarifa,
										ticket_medio: tarifa / (socios || 1),
									};
								};
								// Paso 1: construir vendedores con estructura intacta
								const vendedores = agruparPorVendedores(m.items).map((f) => {
									const nombre = getNombre(f);
									const nuevosItems = f.items.filter((item) => {
										const origen =
											item?.detalle_ventaMembresium?.tb_ventum?.id_origen;
										return origen !== 691 && origen !== 692;
									});
									const renovacionesItems = f.items.filter(
										(item) =>
											item?.detalle_ventaMembresium?.tb_ventum?.id_origen ===
											691
									);

									const reinscripcionesItems = f.items.filter(
										(item) =>
											item?.detalle_ventaMembresium?.tb_ventum?.id_origen ===
											692
									);

									return {
										nombre,
										datos: {
											total: calcularDatos(f.items),
											nuevos: { nombre, ...calcularDatos(nuevosItems) },
											renovaciones: {
												nombre,
												...calcularDatos(renovacionesItems),
											},
											reinscripciones: {
												nombre,
												...calcularDatos(reinscripcionesItems),
											},
										},
									};
								});

								// Paso 2: función para poner puestos dentro de datos
								const setPuestosEnSubobjeto = (lista, tipoBloque, campo) => {
									const ordenados = [...lista].sort(
										(a, b) =>
											b.datos[tipoBloque][campo] - a.datos[tipoBloque][campo]
									);

									return lista.map((v) => {
										const valorActual = v.datos[tipoBloque][campo];
										const cantidadIguales = ordenados.filter(
											(x) => x.datos[tipoBloque][campo] === valorActual
										).length;

										let puesto;
										if (cantidadIguales > 1) {
											puesto = 'i';
										} else {
											const index = ordenados.findIndex(
												(x) => x.nombre === v.nombre
											);
											if (index === 0) puesto = 'p';
											else if (index === ordenados.length - 1) puesto = 'u';
											else puesto = index + 1;
										}

										return {
											...v,
											datos: {
												...v.datos,
												[tipoBloque]: {
													...v.datos[tipoBloque],
													puesto: {
														...(v.datos[tipoBloque].puesto || {}),
														[campo]: puesto,
													},
												},
											},
										};
									});
								};

								// Paso 3: aplicar puestos por cada tipo y métrica
								let conPuestos = vendedores;

								['total', 'nuevos', 'renovaciones', 'reinscripciones'].forEach(
									(tipo) => {
										['socios', 'tarifa', 'ticket_medio'].forEach((campo) => {
											conPuestos = setPuestosEnSubobjeto(
												conPuestos,
												tipo,
												campo
											);
										});
									}
								);

								// Paso 4: debug
								console.log(
									'DEBUG puestos',
									conPuestos.map((v) => ({
										nombre: v.nombre,
										total: v.datos.total.puesto,
										nuevos: v.datos.nuevos.puesto,
										renovaciones: v.datos.renovaciones.puesto,
										reinscripciones: v.datos.reinscripciones.puesto,
									}))
								);

								return conPuestos;
							})(),
						};
					}),
				};
			});

			const programasx = agruparPorPgm(eliminarDuplicadosPorId(ventasSinCero)).map((f) => {
				return {
					...f,
					items: agruparPorMesYAnio(f.items, '2024-09-01', 9).map((m) => {
						return {
							...m,
							datos: (() => {
								const getNombre = (f) => f.nombre_empl || f.lbl || f.propiedad;
								const calcularDatos = (items) => {
									const socios = items.length;
									const tarifa = items.reduce(
										(total, item) =>
											total +
											(item?.detalle_ventaMembresium?.tarifa_monto || 0),
										0
									);
									return {
										socios,
										tarifa,
										ticket_medio: tarifa / (socios || 1),
									};
								};
								// Paso 1: construir vendedores con estructura intacta
								const vendedores = agruparPorVendedores(m.items).map((f) => {
									const nombre = getNombre(f);
									const nuevosItems = f.items.filter((item) => {
										const origen =
											item?.detalle_ventaMembresium?.tb_ventum?.id_origen;
										return origen !== 691 && origen !== 692;
									});
									const renovacionesItems = f.items.filter(
										(item) =>
											item?.detalle_ventaMembresium?.tb_ventum?.id_origen ===
											691
									);

									const reinscripcionesItems = f.items.filter(
										(item) =>
											item?.detalle_ventaMembresium?.tb_ventum?.id_origen ===
											692
									);

									return {
										nombre,
										datos: {
											total: calcularDatos(f.items),
											nuevos: { ...calcularDatos(nuevosItems) },
											renovaciones: {
												...calcularDatos(renovacionesItems),
											},
											reinscripciones: {
												...calcularDatos(reinscripcionesItems),
											},
										},
									};
								});

								// Paso 2: función para poner puestos dentro de datos
								const setPuestosEnSubobjeto = (lista, tipoBloque, campo) => {
									const ordenados = [...lista].sort(
										(a, b) =>
											b.datos[tipoBloque][campo] - a.datos[tipoBloque][campo]
									);

									return lista.map((v) => {
										const valorActual = v.datos[tipoBloque][campo];
										const cantidadIguales = ordenados.filter(
											(x) => x.datos[tipoBloque][campo] === valorActual
										).length;

										let puesto;
										if (cantidadIguales > 1) {
											puesto = 'i';
										} else {
											const index = ordenados.findIndex(
												(x) => x.nombre === v.nombre
											);
											if (index === 0) puesto = 'p';
											else if (index === ordenados.length - 1) puesto = 'u';
											else puesto = index + 1;
										}

										return {
											...v,
											datos: {
												...v.datos,
												[tipoBloque]: {
													...v.datos[tipoBloque],
													puesto: {
														...(v.datos[tipoBloque].puesto || {}),
														[campo]: puesto,
													},
												},
											},
										};
									});
								};

								// Paso 3: aplicar puestos por cada tipo y métrica
								let conPuestos = vendedores;

								['total', 'nuevos', 'renovaciones', 'reinscripciones'].forEach(
									(tipo) => {
										['socios', 'tarifa', 'ticket_medio'].forEach((campo) => {
											conPuestos = setPuestosEnSubobjeto(
												conPuestos,
												tipo,
												campo
											);
										});
									}
								);
								// Paso 4: calcular totales generales
								const totalGeneral = [
									'total',
									'nuevos',
									'renovaciones',
									'reinscripciones',
								].reduce((acc, tipo) => {
									const socios = conPuestos.reduce(
										(suma, v) => suma + (v.datos[tipo]?.socios || 0),
										0
									);
									const tarifa = conPuestos.reduce(
										(suma, v) => suma + (v.datos[tipo]?.tarifa || 0),
										0
									);
									const ticket_medio = tarifa / (socios || 1);

									acc[tipo] = {
										socios,
										tarifa,
										ticket_medio,
									};

									return acc;
								}, {});
								return totalGeneral;
							})(),
						};
					}),
				};
			});

			const dataTotalProgramax = (() => {
				const agrupados = agruparPorMesYAnio(
					eliminarDuplicadosPorId(ventasSinCero),
					'2024-09-01',
					9
				);

				const itemsMensuales = agrupados.map((m) => {
					return {
						...m,
						datos: (() => {
							const getNombre = (f) => f.nombre_empl || f.lbl || f.propiedad;
							const calcularDatos = (items) => {
								const socios = items.length;
								const tarifa = items.reduce(
									(total, item) =>
										total + (item?.detalle_ventaMembresium?.tarifa_monto || 0),
									0
								);
								return {
									socios,
									tarifa,
									ticket_medio: tarifa / (socios || 1),
								};
							};
							const vendedores = agruparPorVendedores(m.items).map((f) => {
								const nombre = getNombre(f);
								const nuevosItems = f.items.filter((item) => {
									const origen =
										item?.detalle_ventaMembresium?.tb_ventum?.id_origen;
									return origen !== 691 && origen !== 692;
								});
								const renovacionesItems = f.items.filter(
									(item) =>
										item?.detalle_ventaMembresium?.tb_ventum?.id_origen === 691
								);
								const reinscripcionesItems = f.items.filter(
									(item) =>
										item?.detalle_ventaMembresium?.tb_ventum?.id_origen === 692
								);

								return {
									nombre,
									datos: {
										total: calcularDatos(f.items),
										nuevos: calcularDatos(nuevosItems),
										renovaciones: calcularDatos(renovacionesItems),
										reinscripciones: calcularDatos(reinscripcionesItems),
									},
								};
							});

							const setPuestosEnSubobjeto = (lista, tipoBloque, campo) => {
								const ordenados = [...lista].sort(
									(a, b) =>
										b.datos[tipoBloque][campo] - a.datos[tipoBloque][campo]
								);

								return lista.map((v) => {
									const valorActual = v.datos[tipoBloque][campo];
									const cantidadIguales = ordenados.filter(
										(x) => x.datos[tipoBloque][campo] === valorActual
									).length;

									let puesto;
									if (cantidadIguales > 1) puesto = 'i';
									else {
										const index = ordenados.findIndex(
											(x) => x.nombre === v.nombre
										);
										puesto =
											index === 0
												? 'p'
												: index === ordenados.length - 1
													? 'u'
													: index + 1;
									}

									return {
										...v,
										datos: {
											...v.datos,
											[tipoBloque]: {
												...v.datos[tipoBloque],
												puesto: {
													...(v.datos[tipoBloque].puesto || {}),
													[campo]: puesto,
												},
											},
										},
									};
								});
							};
							let conPuestos = vendedores;
							['total', 'nuevos', 'renovaciones', 'reinscripciones'].forEach(
								(tipo) => {
									['socios', 'tarifa', 'ticket_medio'].forEach((campo) => {
										conPuestos = setPuestosEnSubobjeto(conPuestos, tipo, campo);
									});
								}
							);

							const totalGeneral = [
								'total',
								'nuevos',
								'renovaciones',
								'reinscripciones',
							].reduce((acc, tipo) => {
								const socios = conPuestos.reduce(
									(suma, v) => suma + (v.datos[tipo]?.socios || 0),
									0
								);
								const tarifa = conPuestos.reduce(
									(suma, v) => suma + (v.datos[tipo]?.tarifa || 0),
									0
								);
								const ticket_medio = tarifa / (socios || 1);
								acc[tipo] = { socios, tarifa, ticket_medio };
								return acc;
							}, {});

							return totalGeneral;
						})(),
					};
				});

				// Agrupar y ordenar por año, agregando resumen al finalizar cada año
				const itemsOrdenados = [];
				const porAnio = {};

				// Agrupar mensual por año
				for (const item of itemsMensuales) {
					const anio = item.anio;
					if (!porAnio[anio]) porAnio[anio] = [];
					porAnio[anio].push(item);
				}

				// Insertar resumen anual tras cada año
				for (const anio of Object.keys(porAnio).sort()) {
					const itemsDelAnio = porAnio[anio];
					itemsOrdenados.push(...itemsDelAnio); // añadir los meses

					const itemsTotalesDelAnio = itemsDelAnio.flatMap((i) => i.items); // ✅ ventas reales

					// Clasificar por tipo
					const nuevosItems = itemsTotalesDelAnio.filter((item) => {
						const origen = item?.detalle_ventaMembresium?.tb_ventum?.id_origen;
						return origen !== 691 && origen !== 692;
					});
					const renovacionesItems = itemsTotalesDelAnio.filter(
						(item) => item?.detalle_ventaMembresium?.tb_ventum?.id_origen === 691
					);
					const reinscripcionesItems = itemsTotalesDelAnio.filter(
						(item) => item?.detalle_ventaMembresium?.tb_ventum?.id_origen === 692
					);

					const calcularDatos = (items) => {
						const socios = items.length;
						const tarifa = items.reduce(
							(total, item) =>
								total + (item?.detalle_ventaMembresium?.tarifa_monto || 0),
							0
						);
						return {
							socios,
							tarifa,
							ticket_medio: tarifa / (socios || 1),
						};
					};

					const resumen = {
						anio,
						mes: `TOTAL`,
						fecha: `TOTAL ${anio}`,
						items: itemsTotalesDelAnio,
						datos: {
							total: calcularDatos(itemsTotalesDelAnio),
							nuevos: calcularDatos(nuevosItems),
							renovaciones: calcularDatos(renovacionesItems),
							reinscripciones: calcularDatos(reinscripcionesItems),
						},
					};

					itemsOrdenados.push(resumen); // añadir el TOTAL anual
				}
				return {
					name_pgm: 'TOTAL',
					items: itemsOrdenados,
				};
			})();

			const dataxAnio = agruparPorMesYAnio(
				eliminarDuplicadosPorId(ventasSinCero),
				'2024-09-01',
				9
			).map((m) => {
				return {
					...m,
					itemVendedores: (() => {
						const getNombre = (f) => f.nombre_empl || f.lbl || f.propiedad;

						const calcularDatos = (items) => {
							const socios = items.length;
							const tarifa = items.reduce(
								(total, item) =>
									total + (item?.detalle_ventaMembresium?.tarifa_monto || 0),
								0
							);
							return {
								socios,
								tarifa,
								ticket_medio: tarifa / (socios || 1),
							};
						};

						const vendedores = agruparPorVendedores(m.items).map((f) => {
							const nombre = getNombre(f);

							const nuevosItems = f.items.filter((item) => {
								const origen = item?.detalle_ventaMembresium?.tb_ventum?.id_origen;
								return origen !== 691 && origen !== 692;
							});

							const renovacionesItems = f.items.filter(
								(item) =>
									item?.detalle_ventaMembresium?.tb_ventum?.id_origen === 691
							);

							const reinscripcionesItems = f.items.filter(
								(item) =>
									item?.detalle_ventaMembresium?.tb_ventum?.id_origen === 692
							);

							return {
								nombre,
								...calcularDatos(f.items),
								nuevos: { nombre, ...calcularDatos(nuevosItems) },
								renovaciones: {
									nombre,
									...calcularDatos(renovacionesItems),
								},
								reinscripciones: {
									nombre,
									...calcularDatos(reinscripcionesItems),
								},
							};
						});

						// FUNCIONES PARA RANKEAR
						const setPuestos = (lista, campo) => {
							const ordenados = [...lista].sort((a, b) => b[campo] - a[campo]);

							return lista.map((v) => {
								const valorActual = v[campo];

								// Verifica si hay más de uno con el mismo valor
								const cantidadIguales = ordenados.filter(
									(x) => x[campo] === valorActual
								).length;

								if (cantidadIguales > 1) {
									return { ...v, [`puesto_${campo}`]: 'i' }; // empate
								}

								const index = ordenados.findIndex((x) => x.nombre === v.nombre);

								if (index === 0) return { ...v, [`puesto_${campo}`]: 'p' };
								if (index === ordenados.length - 1)
									return { ...v, [`puesto_${campo}`]: 'u' };
								return { ...v, [`puesto_${campo}`]: index + 1 };
							});
						};

						// 1. PUESTOS GENERALES
						let conPuestos = setPuestos(vendedores, 'socios');
						conPuestos = setPuestos(conPuestos, 'tarifa');
						conPuestos = setPuestos(conPuestos, 'ticket_medio');

						// 2. PUESTOS NUEVOS
						let nuevos = conPuestos.map((v) => v.nuevos);
						nuevos = setPuestos(nuevos, 'socios');
						nuevos = setPuestos(nuevos, 'tarifa');
						nuevos = setPuestos(nuevos, 'ticket_medio');

						// 3. PUESTOS RENOVACIONES
						let renovaciones = conPuestos.map((v) => v.renovaciones);
						renovaciones = setPuestos(renovaciones, 'socios');
						renovaciones = setPuestos(renovaciones, 'tarifa');
						renovaciones = setPuestos(renovaciones, 'ticket_medio');

						// 4. PUESTOS REINSCRIPCIONES
						let reinscripciones = conPuestos.map((v) => v.reinscripciones);
						reinscripciones = setPuestos(reinscripciones, 'socios');
						reinscripciones = setPuestos(reinscripciones, 'tarifa');
						reinscripciones = setPuestos(reinscripciones, 'ticket_medio');

						// 5. COMBINAR TODO
						return conPuestos.map((v, i) => ({
							nombre: v.nombre,
							socios: v.socios,
							tarifa: v.tarifa,
							ticket_medio: v.ticket_medio,
							puesto: {
								socios: v.puesto_socios,
								tarifa: v.puesto_tarifa,
								ticket_medio: v.puesto_ticket_medio,
							},
							nuevos: {
								...v.nuevos,
								puesto: {
									socios: nuevos[i].puesto_socios,
									tarifa: nuevos[i].puesto_tarifa,
									ticket_medio: nuevos[i].puesto_ticket_medio,
								},
							},
							renovaciones: {
								...v.renovaciones,
								puesto: {
									socios: renovaciones[i].puesto_socios,
									tarifa: renovaciones[i].puesto_tarifa,
									ticket_medio: renovaciones[i].puesto_ticket_medio,
								},
							},
							reinscripciones: {
								...v.reinscripciones,
								puesto: {
									socios: reinscripciones[i].puesto_socios,
									tarifa: reinscripciones[i].puesto_tarifa,
									ticket_medio: reinscripciones[i].puesto_ticket_medio,
								},
							},
						}));
					})(),
				};
			});
			const dataVentas = {
				lbl: '',
				items: agruparPorMesYAnio(
					eliminarDuplicadosPorId(ventasSinCero),
					'2024-09-01',
					9
				).map((m) => {
					return {
						...m,
						itemVendedores: (() => {
							const getNombre = (f) => f.nombre_empl || f.lbl || f.propiedad;
							const calcularDatos = (items) => {
								const socios = items.length;
								const tarifa = items.reduce(
									(total, item) =>
										total + (item?.detalle_ventaMembresium?.tarifa_monto || 0),
									0
								);
								return {
									socios,
									tarifa,
									ticket_medio: tarifa / (socios || 1),
									PM: agruparPorHorarios(items)
										?.find((hora) => hora.propiedad === 'PM')
										?.items.reduce(
											(total, item) =>
												total +
												(item?.detalle_ventaMembresium?.tarifa_monto || 0),
											0
										),
									AM: agruparPorHorarios(items)
										?.find((hora) => hora.propiedad === 'AM')
										?.items.reduce(
											(total, item) =>
												total +
												(item?.detalle_ventaMembresium?.tarifa_monto || 0),
											0
										),
								};
							};
							// Paso 1: construir vendedores con estructura intacta
							const vendedores = agruparPorVendedores(m.items).map((f) => {
								const nombre = getNombre(f);
								const nuevosItems = f.items.filter((item) => {
									const origen =
										item?.detalle_ventaMembresium?.tb_ventum?.id_origen;
									return origen !== 691 && origen !== 692;
								});
								const renovacionesItems = f.items.filter(
									(item) =>
										item?.detalle_ventaMembresium?.tb_ventum?.id_origen === 691
								);
								const reinscripcionesItems = f.items.filter(
									(item) =>
										item?.detalle_ventaMembresium?.tb_ventum?.id_origen === 692
								);

								return {
									nombre,
									datos: {
										total: calcularDatos(f.items),
										nuevos: { nombre, ...calcularDatos(nuevosItems) },
										renovaciones: {
											nombre,
											...calcularDatos(renovacionesItems),
										},
										reinscripciones: {
											nombre,
											...calcularDatos(reinscripcionesItems),
										},
									},
								};
							});

							// Paso 2: función para poner puestos dentro de datos
							const setPuestosEnSubobjeto = (lista, tipoBloque, campo) => {
								const ordenados = [...lista].sort(
									(a, b) =>
										b.datos[tipoBloque][campo] - a.datos[tipoBloque][campo]
								);

								return lista.map((v) => {
									const valorActual = v.datos[tipoBloque][campo];
									const cantidadIguales = ordenados.filter(
										(x) => x.datos[tipoBloque][campo] === valorActual
									).length;

									let puesto;
									if (cantidadIguales > 1) {
										puesto = 'i';
									} else {
										const index = ordenados.findIndex(
											(x) => x.nombre === v.nombre
										);
										if (index === 0) puesto = 'p';
										else if (index === ordenados.length - 1) puesto = 'u';
										else puesto = index + 1;
									}

									return {
										...v,
										datos: {
											...v.datos,
											[tipoBloque]: {
												...v.datos[tipoBloque],
												puesto: {
													...(v.datos[tipoBloque].puesto || {}),
													[campo]: puesto,
												},
											},
										},
									};
								});
							};

							// Paso 3: aplicar puestos por cada tipo y métrica
							let conPuestos = vendedores;

							['total', 'nuevos', 'renovaciones', 'reinscripciones'].forEach(
								(tipo) => {
									['socios', 'tarifa', 'ticket_medio', 'PM', 'AM'].forEach(
										(campo) => {
											conPuestos = setPuestosEnSubobjeto(
												conPuestos,
												tipo,
												campo
											);
										}
									);
								}
							);

							return conPuestos;
						})(),
					};
				}),
			};
			const dataVendedoresAnualizados = {
				lbl: '',
				items: agruparPorMesYAnio(
					eliminarDuplicadosPorId(ventasSinCero),
					'2024-09-01',
					9
				).map((m) => {
					return {
						...m,
						itemVendedores: (() => {
							const getNombre = (f) => f.nombre_empl || f.lbl || f.propiedad;
							const calcularDatos = (items) => {
								const socios = items.length;
								const tarifa = items.reduce(
									(total, item) =>
										total + (item?.detalle_ventaMembresium?.tarifa_monto || 0),
									0
								);
								return {
									socios,
									tarifa,
									ticket_medio: tarifa / (socios || 1),
								};
							};
							// Paso 1: construir vendedores con estructura intacta
							const vendedores = agruparPorVendedores(m.items).map((f) => {
								const nombre = getNombre(f);
								const nuevosItems = f.items.filter((item) => {
									const origen =
										item?.detalle_ventaMembresium?.tb_ventum?.id_origen;
									return origen !== 691 && origen !== 692;
								});
								const renovacionesItems = f.items.filter(
									(item) =>
										item?.detalle_ventaMembresium?.tb_ventum?.id_origen === 691
								);

								const reinscripcionesItems = f.items.filter(
									(item) =>
										item?.detalle_ventaMembresium?.tb_ventum?.id_origen === 692
								);

								return {
									nombre,
									datos: {
										total: calcularDatos(f.items),
										nuevos: { nombre, ...calcularDatos(nuevosItems) },
										renovaciones: {
											nombre,
											...calcularDatos(renovacionesItems),
										},
										reinscripciones: {
											nombre,
											...calcularDatos(reinscripcionesItems),
										},
									},
								};
							});

							// Paso 2: función para poner puestos dentro de datos
							const setPuestosEnSubobjeto = (lista, tipoBloque, campo) => {
								const ordenados = [...lista].sort(
									(a, b) =>
										b.datos[tipoBloque][campo] - a.datos[tipoBloque][campo]
								);

								return lista.map((v) => {
									const valorActual = v.datos[tipoBloque][campo];
									const cantidadIguales = ordenados.filter(
										(x) => x.datos[tipoBloque][campo] === valorActual
									).length;

									let puesto;
									if (cantidadIguales > 1) {
										puesto = 'i';
									} else {
										const index = ordenados.findIndex(
											(x) => x.nombre === v.nombre
										);
										if (index === 0) puesto = 'p';
										else if (index === ordenados.length - 1) puesto = 'u';
										else puesto = index + 1;
									}

									return {
										...v,
										datos: {
											...v.datos,
											[tipoBloque]: {
												...v.datos[tipoBloque],
												puesto: {
													...(v.datos[tipoBloque].puesto || {}),
													[campo]: puesto,
												},
											},
										},
									};
								});
							};

							// Paso 3: aplicar puestos por cada tipo y métrica
							let conPuestos = vendedores;

							['total', 'nuevos', 'renovaciones', 'reinscripciones'].forEach(
								(tipo) => {
									['socios', 'tarifa', 'ticket_medio'].forEach((campo) => {
										conPuestos = setPuestosEnSubobjeto(conPuestos, tipo, campo);
									});
								}
							);

							// Paso 4: debug
							console.log(
								'DEBUG puestos',
								conPuestos.map((v) => ({
									nombre: v.nombre,
									total: v.datos.total.puesto,
									nuevos: v.datos.nuevos.puesto,
									renovaciones: v.datos.renovaciones.puesto,
									reinscripciones: v.datos.reinscripciones.puesto,
								}))
							);

							return conPuestos;
						})(),
					};
				}),
			};
			console.log({ dataVendedoresAnualizados });
			setdataVendedorAnualizados(dataVendedoresAnualizados);
			setdataTotalPgmX(dataTotalProgramax);
			setdataProgramasx(programasx);
			setdataVentas(dataVentas);
			setdataProgramasXAnio(programas);
			setdataVendedores(vendedores);
			setdata(agregarItemsDias);
			setdataUnif(dataxAnio);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerTodoVentas,
		dataVendedorAnualizados,
		dataTotalPgmX,
		data,
		dataVendedores,
		dataProgramas,
		dataUnif,
		dataVentas,
		dataProgramasx,
	};
};

function groupByDate(data) {
	// 1) Agrupa los elementos por clave "YYYY-MM"
	const temp = {};
	data.forEach((item) => {
		// Extraemos fecha “YYYY-MM-DD”
		const fechaStr = item.detalle_ventaMembresium.tb_ventum.fecha_venta.split('T')[0];
		const [anioStr, mesStr, diaStr] = fechaStr.split('-');
		const anio = parseInt(anioStr, 10);
		const mes = mesStr; // dos dígitos
		const dia = parseInt(diaStr, 10);
		const key = `${anioStr}-${mesStr}`;

		if (!temp[key]) {
			temp[key] = { anio, mes, byDay: {} };
		}
		if (!temp[key].byDay[dia]) {
			temp[key].byDay[dia] = [];
		}
		temp[key].byDay[dia].push(item);
	});

	// 2) Para cada mes, construye un array de 31 días
	return Object.values(temp).map(({ anio, mes, byDay }) => {
		const dias = [];
		for (let day = 1; day <= 31; day++) {
			dias.push({
				dia: day,
				mes,
				anio,
				items: byDay[day] || [],
			});
		}
		return dias;
	});
}
