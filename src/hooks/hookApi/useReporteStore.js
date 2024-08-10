import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useReporteStore = () => {
	const [reporteSeguimiento, setreporteSeguimiento] = useState([]);
	const [programa_comparativa_mejoranio, setprograma_comparativa_mejoranio] = useState([]);
	const [programa_estado_cliente, setprograma_estado_cliente] = useState({});
	const [egresosPorFecha_PROVEEDOR, setegresosPorFecha_PROVEEDOR] = useState([]);
	const [egresosPorFecha_GRUPO, setegresosPorFecha_GRUPO] = useState([]);
	const [egresosPorFecha_GASTO, setegresosPorFecha_GASTO] = useState([]);
	const [agrupado_programas, setagrupado_programas] = useState([]);
	const [
		ventasxPrograma_ventasDeProgramasPorSemanas,
		setventasxPrograma_ventasDeProgramasPorSemanas,
	] = useState([]);
	const [ventasxPrograma_ventasAcumuladasTickets, setventasxPrograma_ventasAcumuladasTickets] =
		useState({});
	const [ventasxPrograma_clientesFrecuentes, setventasxPrograma_clientesFrecuentes] = useState(
		{}
	);
	const [reportegerencial_resumenGeneral, setreportegerencial_resumenGeneral] = useState([]);
	const [reporteTotalVentasPorTipoCliente, setreporteTotalVentasPorTipoCliente] = useState([]);
	const [reporteDeDetalleVenta, setreporteDeDetalle] = useState(null);
	const [reporteVentas, setreporteVentas] = useState([]);
	const [reporteFormasDePagos, setreporteFormasDePagos] = useState([]);
	const [reporteProscedencia, setreporteProscedencia] = useState([]);
	const [reporteDeVentasPorEmpleados, setreporteDeVentasPorEmpleados] = useState([]);
	const [loadinData, setloadinData] = useState(false);
	const dispatch = useDispatch();
	// const obtenerReporteDeProscedencia = async () => {
	// 	try {
	// 		const { data } = await PTApi.get('/reporte/reporte-procedencia');
	// 		console.log(data);
	// 		dispatch(onSetDataView('reporte_procedencia', data.reporte));
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };
	// const obtenerReporteDeRankingDeVendedores = async () => {
	// 	try {
	// 		const { data } = await PTApi.get('/reporte/reporte-procedencia');
	// 		console.log(data);
	// 		dispatch(onSetDataView('reporte_procedencia', data.reporte));
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	const obtenerReporteDeFormasDePagos = async (arrayDate) => {
		try {
			const { data } = await PTApi.get('/reporte/reporte-ventas-formas-de-pago', {
				params: {
					arrayDate,
				},
			});
			// Agrupar por forma de pago y sumar el monto parcial
			const result = data.reporte
				.flatMap((venta) => venta.detalleVenta_pagoVenta)
				.reduce((acc, pago) => {
					const formaPago = pago.parametro_forma_pago.label_param;
					if (!acc.find((item) => item.forma_pago === formaPago)) {
						acc.push({ forma_pago: formaPago, monto: 0 });
					}
					const item = acc.find((item) => item.forma_pago === formaPago);
					item.monto += pago.parcial_monto;
					return acc;
				}, []);
			console.log(data.reporte);

			setreporteFormasDePagos(result);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerVentas = async (arrayDate) => {
		try {
			const { data } = await PTApi.get('/reporte/reporte-obtener-ventas', {
				params: {
					arrayDate,
				},
			});
			console.log(data.reporte);
			// console.log(data.reporte, sumarDatos(data.reporte));
			function sumarTotalDetalle(array) {
				return array.reduce((total, item) => {
					return total + (item.totalDetalle || 0);
				}, 0);
			}
			setreporteVentas(sumarTotalDetalle(sumarDatos(data.reporte)));
			setreporteDeDetalle(sumarDatos_y_cantidades(data.reporte));
			setreporteDeVentasPorEmpleados(agruparPorEmpleadoConTotales(data.reporte));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerReporteDeTotalDeVentas_PorTipoCliente_PorVendedor = async (arrayDate) => {
		try {
			const { data } = await PTApi.get('/reporte/reporte-total-de-ventas', {
				params: {
					arrayDate,
				},
			});
			const agrupadoPorTipoCliente = data.reporte.reduce((acc, venta) => {
				const tipoCli = venta.tb_cliente.tipoCli_cli;
				let grupo = acc.find((g) => g.tipo_cli === tipoCli);

				if (!grupo) {
					grupo = {
						tipo_cli: tipoCli,
						venta: [],
					};
					acc.push(grupo);
				}

				grupo.venta.push({
					id: venta.id,
					id_cli: venta.id_cli,
					id_empl: venta.id_empl,
					tb_cliente: venta.tb_cliente,
				});
				return acc;
			}, []);
			setreporteTotalVentasPorTipoCliente(agrupadoPorTipoCliente);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerReporteDeEgresos = async (arrayDate) => {
		try {
			const { data } = await PTApi.get('/reporte/reporte-egresos', {
				params: {
					arrayDate,
				},
			});
			console.log(data);
			const groupByIdProv = (dae) => {
				const groupedData = {};

				dae.forEach((item) => {
					const provId = item.id_prov;
					if (!groupedData[provId]) {
						groupedData[provId] = {
							proveedor: item.tb_Proveedor.razon_social_prov,
							egresos: [],
							suma_monto_PEN: 0,
							suma_monto_USD: 0,
						};
					}
					groupedData[provId].egresos.push(item);
					if (item.moneda === 'PEN') {
						groupedData[provId].suma_monto_PEN += item.monto;
					} else if (item.moneda === 'USD') {
						groupedData[provId].suma_monto_USD += item.monto;
					}
				});

				const result = Object.values(groupedData);

				// Ordenar por suma_monto_PEN de mayor a menor
				result.sort((a, b) => b.suma_monto_PEN - a.suma_monto_PEN);
				return result;
			};
			//tb_parametros_gasto.nombre_gasto   tb_parametros_gasto.id_tipoGasto
			const groupByGasto = (dae) => {
				const groupedData = {};

				dae.forEach((item) => {
					const provId = item.tb_parametros_gasto
						? item.tb_parametros_gasto.nombre_gasto
						: 0;
					if (!groupedData[provId]) {
						groupedData[provId] = {
							gasto: item.tb_parametros_gasto?.nombre_gasto,
							egresos: [],
							suma_monto_PEN: 0,
							suma_monto_USD: 0,
						};
					}
					groupedData[provId].egresos.push(item);
					if (item.moneda === 'PEN') {
						groupedData[provId].suma_monto_PEN += item.monto;
					} else if (item.moneda === 'USD') {
						groupedData[provId].suma_monto_USD += item.monto;
					}
				});

				const result = Object.values(groupedData);

				// Ordenar por suma_monto_PEN de mayor a menor
				result.sort((a, b) => b.suma_monto_PEN - a.suma_monto_PEN);
				return result;
			};
			const groupByGrupo = (dae) => {
				const groupedData = {};

				dae.forEach((item) => {
					const provId = item.tb_parametros_gasto ? item.tb_parametros_gasto.grupo : 0;
					if (!groupedData[provId]) {
						groupedData[provId] = {
							grupo: item.tb_parametros_gasto?.grupo,
							egresos: [],
							suma_monto_PEN: 0,
							suma_monto_USD: 0,
						};
					}
					groupedData[provId].egresos.push(item);
					if (item.moneda === 'PEN') {
						groupedData[provId].suma_monto_PEN += item.monto;
					} else if (item.moneda === 'USD') {
						groupedData[provId].suma_monto_USD += item.monto;
					}
				});

				const result = Object.values(groupedData);

				// Ordenar por suma_monto_PEN de mayor a menor
				result.sort((a, b) => b.suma_monto_PEN - a.suma_monto_PEN);
				return result;
			};
			setegresosPorFecha_PROVEEDOR(groupByIdProv(data.reporte));
			setegresosPorFecha_GRUPO(groupByGrupo(data.reporte));
			setegresosPorFecha_GASTO(groupByGasto(data.reporte));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerReporteSeguimiento = async (isClienteActive) => {
		try {
			setloadinData(true);
			const { data } = await PTApi.get('/reporte/reporte-seguimiento-membresia', {
				params: { isClienteActive },
			});
			// console.log(data.newMembresias);
			setreporteSeguimiento(data.newMembresias);
			dispatch(onSetDataView(data.newMembresias));
			setloadinData(false);
			setagrupado_programas(agruparPorPrograma(data.newMembresias));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerReporteVentasPrograma_COMPARATIVACONMEJORANIO = async (id_programa, rangoDate) => {
		try {
			const { data } = await PTApi.get(
				'/reporte/reporte-ventas-programa-comparativa-con-mejor-anio',
				{
					params: {
						id_programa,
						rangoDate,
					},
				}
			);
			setprograma_comparativa_mejoranio(data.series);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerReporteVentasPrograma_EstadoCliente = async (id_programa, rangoDate) => {
		try {
			const { data } = await PTApi.get('/reporte/reporte-programa-estadocliente', {
				params: {
					dateRanges: rangoDate,
					id_programa,
				},
			});
			console.log(data);
			setprograma_estado_cliente(data.data_estadosclientes);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerReporteVentasAcumuladas_y_Tickets = async (id_programa, rangoDate) => {
		try {
			const { data } = await PTApi.get('/reporte/reporte-ventas-tickets', {
				params: {
					dateRanges: rangoDate,
					id_programa,
				},
			});
			console.log(data);
			setventasxPrograma_ventasAcumuladasTickets(data.data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerReporteVentasPorProgramas_x_ClientesFrecuentes = async (
		id_programa,
		rangoDate
	) => {
		try {
			const { data } = await PTApi.get('/reporte/reporte-programa-acumuladas-y-tickets', {
				params: {
					dateRanges: rangoDate,
					id_programa,
				},
			});
			setventasxPrograma_clientesFrecuentes(data.data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtener_ReporteVentasPorAsesor_Profile = async (id_empl, rangoDate) => {};
	const obtenerReporteVentasDeProgramasPorSemanas = async (id_programa, rangoDate) => {
		try {
			const { data } = await PTApi.get('/reporte/reporte-programa-x-semanas');
			setventasxPrograma_ventasDeProgramasPorSemanas(data.data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerReporteDeResumenUTILIDAD = async (rangoDate) => {
		try {
			const { data } = await PTApi.get('/reporte/reporte-resumen-utilidad', {
				params: {
					dateRanges: rangoDate,
				},
			});
			const ingresosVentas = data.utilidades[0].map((venta) => {
				// Sumar todos los tarifa_monto de los detalles
				const monto_sumado = [
					...venta.detalle_ventaProductos,
					...venta.detalle_ventaMembresia,
					...venta.detalle_ventaCitas,
				].reduce((sum, detalle) => sum + (detalle.tarifa_monto || 0), 0);

				return {
					id: venta.id,
					fecha_venta: venta.fecha_venta,
					monto_sumado: monto_sumado,
				};
			});
			// Unificar todos los datos en un solo array
			const unifiedData = [
				...data.utilidades[2].map((e) => ({
					tipo: 'egreso',
					fecha: e.fec_pago,
					monto: e.monto,
				})),
				...ingresosVentas.map((v) => ({
					tipo: 'venta',
					fecha: v.fecha_venta,
					monto: v.monto_sumado,
				})),
				...data.utilidades[1].map((a) => ({
					tipo: 'aporte',
					fecha: a.fecha_aporte,
					monto: a.monto_aporte,
				})),
			];

			// Ordenar por fecha
			unifiedData.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

			// Agrupar por fecha y calcular monto útil
			const resultadoFinal = unifiedData.reduce((acc, current) => {
				const fecha = current.fecha.split('T')[0]; // Tomar solo la parte de la fecha sin la hora
				const index = acc.findIndex((item) => item.fecha === fecha);

				const suma_monto_ventas = current.tipo === 'venta' ? current.monto : 0;
				const suma_monto_aportes = current.tipo === 'aporte' ? current.monto : 0;
				const suma_monto_egresos = current.tipo === 'egreso' ? current.monto : 0;
				if (index === -1) {
					acc.push({
						fecha: fecha,
						suma_monto_ventas: suma_monto_ventas,
						suma_monto_aportes: suma_monto_aportes,
						suma_monto_egresos: suma_monto_egresos,
						monto_util: suma_monto_ventas,
					});
				} else {
					acc[index].monto_util +=
						current.tipo === 'egreso'
							? -current.monto.toFixed(2)
							: current.monto.toFixed(2);
				}
				return acc;
			}, []);
			setreportegerencial_resumenGeneral(resultadoFinal);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerReporteSeguimiento,
		obtenerReporteVentasPrograma_COMPARATIVACONMEJORANIO,
		obtenerReporteVentasPrograma_EstadoCliente,
		obtenerReporteVentasAcumuladas_y_Tickets,
		obtenerReporteVentasPorProgramas_x_ClientesFrecuentes,
		obtenerReporteVentasDeProgramasPorSemanas,
		obtenerReporteDeEgresos,
		obtenerReporteDeResumenUTILIDAD,
		obtenerReporteDeTotalDeVentas_PorTipoCliente_PorVendedor,
		obtenerVentas,
		obtenerReporteDeFormasDePagos,
		loadinData,
		reporteDeVentasPorEmpleados,
		reporteFormasDePagos,
		reporteDeDetalleVenta,
		reporteVentas,
		reporteTotalVentasPorTipoCliente,
		agrupado_programas,
		reportegerencial_resumenGeneral,
		egresosPorFecha_PROVEEDOR,
		egresosPorFecha_GRUPO,
		egresosPorFecha_GASTO,
		reporteSeguimiento,
		ventasxPrograma_ventasDeProgramasPorSemanas,
		programa_comparativa_mejoranio,
		programa_estado_cliente,
		ventasxPrograma_clientesFrecuentes,
		ventasxPrograma_ventasAcumuladasTickets,
	};
};

function agruparPorPrograma(datos) {
	const resultado = [];

	datos.forEach((item) => {
		const { id_pgm, name_pgm, tb_image } = item.tb_ProgramaTraining;

		// Buscar si ya existe un grupo para este id_pgm
		let grupo = resultado.find((g) => g.tb_programa_training.id_pgm === id_pgm);

		if (!grupo) {
			// Si no existe, crear un nuevo grupo
			grupo = {
				tb_programa_training: {
					id_pgm,
					name_pgm,
					tb_image,
				},
				todo: [],
			};
			resultado.push(grupo);
		}

		// Añadir el item al grupo correspondiente
		grupo.todo.push(item);
	});

	return resultado;
}

function agruparPorEmpleadoConTotales(registros) {
	// Crear un objeto para almacenar las ventas agrupadas por empleado
	const ventasPorEmpleado = {};

	// Recorrer cada registro
	registros.forEach((registro) => {
		const empleado = registro.tb_empleado?.nombres_apellidos_empl;

		// Si el empleado no está en el objeto, inicializarlo
		if (!ventasPorEmpleado[empleado]) {
			ventasPorEmpleado[empleado] = {
				tb_empleado: { nombres_apellidos_empl: empleado },
				ventas: [],
				cantidad_ventas: 0,
				total_ventas: 0,
			};
		}

		// Agregar el registro a la lista de ventas del empleado
		ventasPorEmpleado[empleado].ventas.push(registro);
		ventasPorEmpleado[empleado].cantidad_ventas += 1;
		ventasPorEmpleado[empleado].total_ventas += calcularTotalVenta(registro);
	});

	// Convertir el objeto a un array con el formato deseado
	return Object.values(ventasPorEmpleado);
}

// Función para calcular el total de una venta
function calcularTotalVenta(registro) {
	let total = 0;

	// Sumar los valores de tarifa_monto en detalle_ventaMembresia y detalle_ventaProductos
	total += registro.detalle_ventaMembresia.reduce(
		(sum, item) => sum + (item.tarifa_monto || 0),
		0
	);
	total += registro.detalle_ventaProductos.reduce(
		(sum, item) => sum + (item.tarifa_monto || 0),
		0
	);
	total += registro.detalle_ventaCitas.reduce((sum, item) => sum + (item.tarifa_monto || 0), 0);

	return total;
}

function sumarDatos_y_cantidades(datos) {
	// Inicializar los contadores y sumas
	// Inicializar los contadores y sumas
	const result = {
		suma_tarifa_monto_citas_FITOL: 0,
		cantidad_citas_FITOL: 0,
		suma_tarifa_monto_citas_NUTRI: 0,
		cantidad_citas_NUTRI: 0,
		suma_tarifa_monto_membresia: 0,
		cantidad_membresia: 0,
		suma_tarifa_monto_suplementos: 0,
		cantidad_suplementos: 0,
		suma_tarifa_monto_accesorio: 0,
		cantidad_accesorio: 0,
	};

	datos.forEach((dato) => {
		// Procesar detalle_ventaCitas
		if (dato.detalle_ventaCitas && dato.detalle_ventaCitas.length > 0) {
			dato.detalle_ventaCitas.forEach((cita) => {
				if (cita.tb_servicio.tipo_servicio === 'FITOL') {
					result.suma_tarifa_monto_citas_FITOL += cita.tarifa_monto;
					result.cantidad_citas_FITOL += 1;
				} else if (cita.tb_servicio.tipo_servicio === 'NUTRI') {
					result.suma_tarifa_monto_citas_NUTRI += cita.tarifa_monto;
					result.cantidad_citas_NUTRI += 1;
				}
			});
		}

		// Procesar detalle_ventaMembresia
		if (dato.detalle_ventaMembresia && dato.detalle_ventaMembresia.length > 0) {
			dato.detalle_ventaMembresia.forEach((membresia) => {
				result.suma_tarifa_monto_membresia += membresia.tarifa_monto;
				result.cantidad_membresia += 1;
			});
		}

		// Procesar detalle_ventaProductos
		if (dato.detalle_ventaProductos && dato.detalle_ventaProductos.length > 0) {
			dato.detalle_ventaProductos.forEach((producto) => {
				if (producto.tb_producto.id_categoria === 17) {
					result.suma_tarifa_monto_suplementos += producto.tarifa_monto;
					result.cantidad_suplementos += producto.cantidad;
				} else if (producto.tb_producto.id_categoria === 18) {
					result.suma_tarifa_monto_accesorio += producto.tarifa_monto;
					result.cantidad_accesorio += producto.cantidad;
				}
			});
		}
	});

	return result;
}

function sumarDatos(array) {
	return array.map((item) => {
		// Función para sumar los valores numéricos de un array de objetos
		function sumarTarifaMonto(array) {
			return array.reduce((total, item) => {
				return total + (item.tarifa_monto || 0);
			}, 0);
		}

		// Calcular los totales para el objeto actual
		// const totalDetalleVentaPagoVenta = sumarTarifaMonto(item.detalleVenta_pagoVenta || []);
		const totalDetalleVentaCitas = sumarTarifaMonto(item.detalle_ventaCitas || []);
		const totalDetalleVentaMembresia = sumarTarifaMonto(item.detalle_ventaMembresia || []);
		const totalDetalleVentaProductos = sumarTarifaMonto(item.detalle_ventaProductos || []);
		// Calcular el total de detalle
		const totalDetalle =
			// totalDetalleVentaPagoVenta +
			totalDetalleVentaCitas + totalDetalleVentaMembresia + totalDetalleVentaProductos;

		// Devolver un nuevo objeto con los totales
		return {
			totalDetalleVentaCitas,
			totalDetalleVentaMembresia,
			totalDetalleVentaProductos,
			totalDetalle,
		};
	});
}

function sumarTotales(array) {
	const resultados = sumarDatosYcontarelementos(array);

	// Inicializar los totales y cantidades
	let totalDetalleVentaCitas = 0;
	let cantidadDetalleVentaCitas = 0;
	let totalDetalleVentaMembresia = 0;
	let cantidadDetalleVentaMembresia = 0;
	let totalDetalleVentaProductos = 0;
	let cantidadDetalleVentaProductos = 0;

	// Sumar los totales y cantidades de todos los objetos
	resultados.forEach((item) => {
		totalDetalleVentaCitas += item.totalDetalleVentaCitas || 0;
		cantidadDetalleVentaCitas += item.cantidadDetalleVentaCitas || 0;
		totalDetalleVentaMembresia += item.totalDetalleVentaMembresia || 0;
		cantidadDetalleVentaMembresia += item.cantidadDetalleVentaMembresia || 0;
		totalDetalleVentaProductos += item.totalDetalleVentaProductos || 0;
		cantidadDetalleVentaProductos += item.cantidadDetalleVentaProductos || 0;
	});

	// Devolver el objeto con los totales y cantidades sumadas
	return {
		totalDetalleVentaCitas,
		cantidadDetalleVentaCitas,
		totalDetalleVentaMembresia,
		cantidadDetalleVentaMembresia,
		totalDetalleVentaProductos,
		cantidadDetalleVentaProductos,
	};
}

function sumarDatosYcontarelementos(array) {
	return array.map((item) => {
		// Función para sumar los valores de tarifa_monto en un array de objetos
		function sumarTarifaMonto(array) {
			return array.reduce((total, item) => {
				return total + (item.tarifa_monto || 0);
			}, 0);
		}

		// Función para contar los elementos en un array
		function contarElementos(array) {
			return array.length;
		}

		// Calcular los totales para el objeto actual
		const totalDetalleVentaCitas = sumarTarifaMonto(item.detalle_ventaCitas || []);
		const totalDetalleVentaMembresia = sumarTarifaMonto(item.detalle_ventaMembresia || []);
		const totalDetalleVentaProductos = sumarTarifaMonto(item.detalle_ventaProductos || []);

		const cantidadDetalleVentaCitas = contarElementos(item.detalle_ventaCitas || []);
		const cantidadDetalleVentaMembresia = contarElementos(item.detalle_ventaMembresia || []);
		const cantidadDetalleVentaProductos = contarElementos(item.detalle_ventaProductos || []);

		// Calcular el total de detalle
		const totalDetalle =
			totalDetalleVentaCitas + totalDetalleVentaMembresia + totalDetalleVentaProductos;

		// Devolver un nuevo objeto con los totales y las cantidades
		return {
			totalDetalleVentaCitas,
			cantidadDetalleVentaCitas,
			totalDetalleVentaMembresia,
			cantidadDetalleVentaMembresia,
			totalDetalleVentaProductos,
			cantidadDetalleVentaProductos,
			totalDetalle,
		};
	});
}
