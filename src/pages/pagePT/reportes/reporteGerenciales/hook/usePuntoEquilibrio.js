import { PTApi } from '@/common';
import dayjs, { utc } from 'dayjs';
import React, { useState } from 'react';
import { agruparPorGrupo, aplicarTipoDeCambio } from '../helpers/agrupamientos';

dayjs.extend(utc);
function formatDateToSQLServerWithDayjs(date, isStart = true) {
	const base = dayjs.utc(date);
	return isStart
		? base.startOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]')
		: base.endOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]');
}
export const usePuntoEquilibrio = () => {
	const [dataVentas, setdataVentas] = useState([]);
	const [dataEgresos, setdataEgresos] = useState([]);
	const obtenerVentas = async (arrayDate, idEmpresa) => {
		try {
			const { data } = await PTApi.get(`/venta/get-ventas-x-fecha/${idEmpresa}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			setdataVentas(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerEgresos = async (arrayDate, idEmpresa) => {
		try {
			const { data } = await PTApi.get(`/egreso/fecha-pago/${idEmpresa}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			const { data: dataParametrosGastos } = await PTApi.get(
				`/terminologia/terminologiaxEmpresa/${idEmpresa}/1573`
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
			setdataEgresos(
				agruparPorGrupo(
					aplicarTipoDeCambio(dataTCs, data.gastos),
					dataParametrosGastos.termGastos
				)
			);
			console.log(
				agruparPorGrupo(
					aplicarTipoDeCambio(dataTCs, data.gastos),
					dataParametrosGastos.termGastos
				)
			);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerVentas,
		obtenerEgresos,
		dataEgresos,
		dataVentas,
	};
};
