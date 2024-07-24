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
	const [
		ventasxPrograma_ventasDeProgramasPorSemanas,
		setventasxPrograma_ventasDeProgramasPorSemanas,
	] = useState([]);
	const [ventasxPrograma_ventasAcumuladasTickets, setventasxPrograma_ventasAcumuladasTickets] =
		useState({});
	const [ventasxPrograma_clientesFrecuentes, setventasxPrograma_clientesFrecuentes] = useState(
		{}
	);
	const dispatch = useDispatch();
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
	const obtenerReporteSeguimiento = async () => {
		try {
			const { data } = await PTApi.get('/reporte/reporte-seguimiento-membresia');
			// console.log(data.newMembresias);
			setreporteSeguimiento(data.newMembresias);
			dispatch(onSetDataView(data.newMembresias));
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
	return {
		obtenerReporteSeguimiento,
		obtenerReporteVentasPrograma_COMPARATIVACONMEJORANIO,
		obtenerReporteVentasPrograma_EstadoCliente,
		obtenerReporteVentasAcumuladas_y_Tickets,
		obtenerReporteVentasPorProgramas_x_ClientesFrecuentes,
		obtenerReporteVentasDeProgramasPorSemanas,
		obtenerReporteDeEgresos,
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
