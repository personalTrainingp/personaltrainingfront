import { PTApi } from '@/common';
import dayjs, { utc } from 'dayjs';
import { useState } from 'react';
import { agruparVentasPorMes } from '../helpers/agruparIngresosPorFecha';
import { agruparPorGrupoYConcepto, aplicarTipoDeCambio } from '../helpers/agrupamientos';

dayjs.extend(utc);
function formatDateToSQLServerWithDayjs(date, isStart = true) {
	const base = dayjs.utc(date);
	return isStart
		? base.startOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]')
		: base.endOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]');
}
export const useVentasStore = () => {
	const [dataVentasxMes, setdataVentasxMes] = useState([{}]);
	const [dataIngresosxMes, setdataIngresosxMes] = useState([{}]);
	const obtenerVentasxFechaxEmpresa = async (arrayDate, idEmpresa) => {
		try {
			const { data } = await PTApi.get(`/venta/get-ventas-x-fecha/${idEmpresa}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			// setdataVentasxMes(agruparVentasPorMes(data.ventas));
			// console.log({ data: agruparVentasPorMes(data.ventas) });
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerIngresosxFechaxEmpresa = async (arrayDate, idEmpresa) => {
		try {
			const { data } = await PTApi.get(`/ingreso/fecha/${idEmpresa}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			const { data: dataParametrosGastos } = await PTApi.get(
				`/terminologia/terminologiaxEmpresa/${idEmpresa}/1574`
			);
			console.log({ dataParametrosGastos });

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
			console.log({ daa: data.ingresos, idEmpresa });

			setdataIngresosxMes(
				agruparPorGrupoYConcepto(
					aplicarTipoDeCambio(dataTCs, data.ingresos),
					dataParametrosGastos.termGastos
				)
			);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerVentasxFechaxEmpresa,
		obtenerIngresosxFechaxEmpresa,
		dataVentasxMes,
		dataIngresosxMes,
	};
};
