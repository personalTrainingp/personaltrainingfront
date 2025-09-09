import { PTApi } from '@/common';
import { useTipoCambioStore } from '@/hooks/hookApi/useTipoCambioStore';
import dayjs from 'dayjs';
import React, { useState } from 'react';

function formatDateToSQLServerWithDayjs(date) {
	console.log(dayjs.utc(date).format('YYYY-MM-DD'), 'dame');

	return dayjs.utc(date).format('YYYY-MM-DD'); // Asegurar que esté en UTC
	// .format('YYYY-MM-DD HH:mm:ss.SSS0000 +00:00');
}
export const useReportePuntoEquilibrioStore = () => {
	const [dataPorPagar, setdataPorPagar] = useState([]);
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
			const { data: dataTC } = await PTApi.get('/tipoCambio/');
			const dataTCs = dataTC.tipoCambios.map((e, i, arr) => {
				const posteriores = arr
					.filter((item) => new Date(item.fecha) > new Date(e.fecha))
					.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

				const termino = posteriores.length ? posteriores[0].fecha : null;
				return {
					moneda: e.monedaDestino,
					multiplicador: e.precio_compra,
					// monedaOrigen: e.monedaOrigen,
					fecha_inicio_tc: e.fecha,
					fecha_fin_tc: termino, // null si no hay próximo cambio
				};
			});
			setdataPorPagar(
				agruparPorGrupoYConcepto(
					dataGastos.gastos.filter((gasto) => gasto.id_estado_gasto === 1424),
					dataParametrosGastos.termGastos
				).filter((e) => e.grupo !== 'PRESTAMOS')
			);
			// const {data: dataVentas} = await PTApi
			setdataGastos(
				agruparPorGrupoYConcepto(
					aplicarTipoDeCambio(dataTCs, dataGastos.gastos).filter(
						(e) => e.id_estado_gasto === 1423
					),
					dataParametrosGastos.termGastos
				).filter((e) => e.grupo !== 'PRESTAMOS')
			);
			setdataPrestamos(
				agruparPorGrupoYConcepto(
					aplicarTipoDeCambio(dataTCs, dataGastos.gastos).filter(
						(e) => e.id_estado_gasto === 1423
					),
					dataParametrosGastos.termGastos
				).filter((e) => e.grupo === 'PRESTAMOS')
			);
			// console.log({
			// 	data99: agruparPorGrupoYConcepto(
			// 		aplicarTipoDeCambio(dataTCs, dataGastos.gastos).filter(
			// 			(e) => e.id_estado_gasto === 1423
			// 		),
			// 		dataParametrosGastos.termGastos
			// 	).filter((e) => e.grupo !== 'PRESTAMOS'),
			// });
		} catch (error) {
			console.log(error);
		}
	};

	return {
		obtenerGastosxFecha,
		dataGastos,
		dataPrestamos,
		dataPorPagar,
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
		const montoTotalEnSoles = gastosDelGrupo.reduce((sum, g) => sum + g.monto * g.tc, 0);
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
			montoTotalEnSoles,
			conceptos,
		};
	});

	console.log({ resultado });
	return resultado;
}

function aplicarTipoDeCambio(dataTC, dataGastos) {
	return dataGastos.map((gasto) => {
		const fechaGasto = new Date(gasto.fec_pago);

		const tcMatch = dataTC.find((tc) => {
			if (tc.moneda === gasto.moneda) return false;

			const inicio = new Date(tc.fecha_inicio_tc);
			// Debe ser posterior o igual al inicio
			if (fechaGasto < inicio) return false;

			// Si hay fecha_fin_tc, también debe ser ≤ fin
			if (tc.fecha_fin_tc) {
				const fin = new Date(tc.fecha_fin_tc);
				if (fechaGasto > fin) return false;
			}
			// Si fecha_fin_tc es null, este tramo sigue abierto
			return true;
		});

		const resultado = { tc: 1, ...gasto };
		if (tcMatch) resultado.tc = tcMatch.multiplicador;
		return resultado;
	});
}
