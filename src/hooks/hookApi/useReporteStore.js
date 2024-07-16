import { PTApi } from '@/common';
import { useState } from 'react';

export const useReporteStore = () => {
	const [reporteSeguimiento, setreporteSeguimiento] = useState([]);
	const [programa_comparativa_mejoranio, setprograma_comparativa_mejoranio] = useState([]);
	const [programa_estado_cliente, setprograma_estado_cliente] = useState({});
	const [
		ventasxPrograma_ventasDeProgramasPorSemanas,
		setventasxPrograma_ventasDeProgramasPorSemanas,
	] = useState([]);
	const [ventasxPrograma_ventasAcumuladasTickets, setventasxPrograma_ventasAcumuladasTickets] =
		useState({});
	const [ventasxPrograma_clientesFrecuentes, setventasxPrograma_clientesFrecuentes] = useState(
		{}
	);
	const obtenerReporteSeguimiento = async () => {
		const { data } = await PTApi.get('/reporte/reporte-seguimiento-membresia');
		setreporteSeguimiento(data);
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
		ventasxPrograma_ventasDeProgramasPorSemanas,
		programa_comparativa_mejoranio,
		programa_estado_cliente,
		ventasxPrograma_clientesFrecuentes,
		ventasxPrograma_ventasAcumuladasTickets,
	};
};
