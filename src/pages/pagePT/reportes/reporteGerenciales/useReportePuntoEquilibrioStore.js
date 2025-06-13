import { PTApi } from '@/common';
import dayjs from 'dayjs';
import React, { useState } from 'react';

function formatDateToSQLServerWithDayjs(date) {
	console.log(dayjs.utc(date).format('YYYY-MM-DD'), 'dame');

	return dayjs.utc(date).format('YYYY-MM-DD'); // Asegurar que esté en UTC
	// .format('YYYY-MM-DD HH:mm:ss.SSS0000 +00:00');
}
export const useReportePuntoEquilibrioStore = () => {
	const [dataGastos, setdataGastos] = useState([]);
	const [dataPrestamos, setdataPrestamos] = useState([]);
	const [dataAportes, setdataAportes] = useState([]);
	const [dataVentas, setdataVentas] = useState([]);
	const obtenerGastosxFecha = async (RANGE_DATE, id_empresa) => {
		try {
			const { data: dataGastos } = await PTApi.get(`/egreso/range-date/${id_empresa}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(RANGE_DATE[0]),
						formatDateToSQLServerWithDayjs(RANGE_DATE[1]),
					],
				},
			});
			const { data: dataParametrosGastos } = await PTApi.get(
				`/terminologia/terminologiaxEmpresa/${id_empresa}`
			);
			const { data: dataVentas } = await PTApi.get(
				'/venta/reporte/obtener-comparativo-resumen',
				{
					params: {
						arrayDate: [
							formatDateToSQLServerWithDayjs(RANGE_DATE[0]),
							formatDateToSQLServerWithDayjs(RANGE_DATE[1]),
						],
					},
				}
			);
			console.log({ dataVentas });

			// const {data: dataVentas} = await PTApi
			setdataGastos(
				agruparPorGrupoYConcepto(dataGastos.gastos, dataParametrosGastos.termGastos).filter(
					(e) => e.grupo !== 'PRESTAMOS'
				)
			);
			setdataPrestamos(
				agruparPorGrupoYConcepto(dataGastos.gastos, dataParametrosGastos.termGastos).filter(
					(e) => e.grupo === 'PRESTAMOS'
				)
			);
			console.log({
				data: agruparPorGrupoYConcepto(dataGastos.gastos, dataParametrosGastos.termGastos),
			});
		} catch (error) {
			console.log(error);
		}
	};

	return {
		obtenerGastosxFecha,
		dataGastos,
		dataPrestamos,
	};
};

function agruparPorGrupoYConcepto(dataGastos, dataGrupos) {
	// 1) Construir mapa temporal de grupos
	const gruposMapTemp = {};
	dataGrupos.forEach((entry) => {
		const nombreGrupo = entry.grupo?.trim()?.toUpperCase() || 'SIN GRUPO';
		gruposMapTemp[nombreGrupo] = gruposMapTemp[nombreGrupo] || [];
		gruposMapTemp[nombreGrupo].push(entry);
	});

	// 2) Ordenar los grupos por parametro_grupo.orden
	const gruposOrdenados = Object.entries(gruposMapTemp).sort(([, a], [, b]) => {
		const ordenA = a[0].parametro_grupo?.orden ?? 0;
		const ordenB = b[0].parametro_grupo?.orden ?? 0;
		return ordenA - ordenB;
	});

	// 3) Para cada grupo, generar su objeto de salida
	const resultado = gruposOrdenados.map(([grupoNombre, entradasDeGrupo]) => {
		// a) Ordenar conceptos dentro del grupo
		entradasDeGrupo.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

		// b) Extraer nombres únicos de concepto
		const conceptosUnicos = [];
		entradasDeGrupo.forEach((c) => {
			const nc = c.nombre_gasto?.trim()?.toUpperCase() || 'SIN CONCEPTO';
			if (!conceptosUnicos.includes(nc)) conceptosUnicos.push(nc);
		});

		// c) Para cada concepto, filtrar gastos y calcular montos
		const conceptos = conceptosUnicos.map((nombreConcepto) => {
			// todos los gastos de este grupo+concepto
			const itemsDelConcepto = dataGastos.filter((g) => {
				const pg = g.tb_parametros_gasto || {};
				return (
					pg.grupo?.trim()?.toUpperCase() === grupoNombre &&
					pg.nombre_gasto?.trim()?.toUpperCase() === nombreConcepto
				);
			});

			// totales por moneda a nivel de concepto
			const montousd = itemsDelConcepto
				.filter((g) => g.moneda === 'USD')
				.reduce((sum, g) => sum + g.monto, 0);
			const montopen = itemsDelConcepto
				.filter((g) => g.moneda === 'PEN')
				.reduce((sum, g) => sum + g.monto, 0);

			return {
				concepto: nombreConcepto,
				montousd,
				montopen,
				items: itemsDelConcepto,
			};
		});

		// d) Totales por moneda a nivel de grupo
		const gastosDelGrupo = dataGastos.filter((g) => {
			const pg = g.tb_parametros_gasto || {};
			return pg.grupo?.trim()?.toUpperCase() === grupoNombre;
		});
		const montousdGrupo = gastosDelGrupo
			.filter((g) => g.moneda === 'USD')
			.reduce((sum, g) => sum + g.monto, 0);
		const montopenGrupo = gastosDelGrupo
			.filter((g) => g.moneda === 'PEN')
			.reduce((sum, g) => sum + g.monto, 0);

		return {
			grupo: grupoNombre,
			montousd: montousdGrupo,
			montopen: montopenGrupo,
			conceptos,
		};
	});

	console.log({ resultado });
	return resultado;
}
