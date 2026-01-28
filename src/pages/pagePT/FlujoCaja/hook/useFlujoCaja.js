import { PTApi } from '@/common';
import dayjs from 'dayjs';
import { agruparPorGrupoYConcepto, aplicarTipoDeCambio } from '../helpers/agrupamientos';
import { useState } from 'react';

function formatDateToSQLServerWithDayjs(date, isStart = true) {
	const base = dayjs(date);

	const formatted = isStart
		? base.startOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]')
		: base.endOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]');

	return formatted;
}

export const useFlujoCaja = () => {
	const [dataGastosxFecha, setdataGastosxFecha] = useState([]);
	const obtenerEgresosxFecha = async (enterprice, arrayDate) => {
		try {
			const { data } = await PTApi.get(`/egreso/range-date/${enterprice}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			const { data: dataParametrosGastos } = await PTApi.get(
				`/terminologia/terminologiaxEmpresa/${enterprice}/1573`
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
			setdataGastosxFecha(
				agruparPorGrupoYConcepto(
					aplicarTipoDeCambio(dataTCs, data.gastos).filter(
						(e) => e.id_estado_gasto === 1423
					),
					dataParametrosGastos.termGastos
				)
			);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerIngresosxFecha = async (enterprice, arrayDate) => {
		try {
			const { data } = await PTApi.get(`/egreso/range-date/${enterprice}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			const { data: dataParametrosGastos } = await PTApi.get(
				`/terminologia/terminologiaxEmpresa/${enterprice}/1573`
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
			setdataGastosxFecha(
				agruparPorGrupoYConcepto(
					aplicarTipoDeCambio(dataTCs, data.gastos).filter(
						(e) => e.id_estado_gasto === 1423
					),
					dataParametrosGastos.termGastos
				)
			);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerEgresosxFecha,
		dataGastosxFecha,
		obtenerIngresosxFecha,
	};
};
