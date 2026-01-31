import { PTApi } from '@/common';
import dayjs from 'dayjs';
import { useState } from 'react';
import { agruparPorGrupoYConcepto, aplicarTipoDeCambio } from '../helpers/agrupamientosOficiales';

function formatDateToSQLServerWithDayjs(date, isStart = true) {
	const base = dayjs(date);

	const formatted = isStart
		? base.startOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]')
		: base.endOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]');

	return formatted;
}

export const useFlujoCaja = () => {
	const [dataGastosxFecha, setdataGastosxFecha] = useState([]);
	const [dataIngresosxFecha, setdataIngresosxFecha] = useState([]);
	const obtenerEgresosxFecha = async (enterprice, arrayDate) => {
		try {
			const { data } = await PTApi.get(`/egreso/fecha-pago/${enterprice}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			const dataGastos = data.gastos.map((g) => {
				return {
					fecha_primaria: g.fecha_pago,
					...g,
				};
			});
			const { data: dataTC } = await PTApi.get('/tipoCambio/');
			console.log({ tcs: generarRangosTipoCambio(dataTC.tipoCambios) });
			console.log({
				data,
				dataGastos,
				aplicarTipoDeCambio: aplicarTipoDeCambio(
					generarRangosTipoCambio(dataTC.tipoCambios),
					dataGastos
				),
				agg: agruparPorGrupoYConcepto(
					aplicarTipoDeCambio(generarRangosTipoCambio(dataTC.tipoCambios), dataGastos)
				),
			});
			setdataGastosxFecha();
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
			setdataIngresosxFecha();
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

function generarRangosTipoCambio(tipoCambios) {
	return tipoCambios.map((e, i, arr) => {
		const posteriores = arr
			.filter((item) => new Date(item.fecha) > new Date(e.fecha))
			.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

		const termino = posteriores.length ? posteriores[0].fecha : null;

		return {
			moneda: e.monedaDestino,
			multiplicador: e.precio_compra,
			fecha_inicio_tc: e.fecha,
			fecha_fin_tc: termino,
		};
	});
}
