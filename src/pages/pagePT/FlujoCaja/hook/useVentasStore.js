import { PTApi } from '@/common';
import dayjs, { utc } from 'dayjs';
import { useState } from 'react';
import { agruparVentasPorMes } from '../helpers/agruparVentasPorFecha';

dayjs.extend(utc);
function formatDateToSQLServerWithDayjs(date, isStart = true) {
	const base = dayjs.utc(date);
	return isStart
		? base.startOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]')
		: base.endOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]');
}
export const useVentasStore = () => {
	const [dataVentasxMes, setdataVentasxMes] = useState([{}]);
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
			setdataVentasxMes(agruparVentasPorMes(data.ventas));
			// console.log({ data: agruparVentasPorMes(data.ventas) });
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerVentasxFechaxEmpresa,
		dataVentasxMes,
	};
};
