import { PTApi } from '@/common';
import dayjs from 'dayjs';
import { useState } from 'react';
import { agruparVentasPorMes } from '../helpers/agruparVentasPorFecha';
function formatDateToSQLServerWithDayjs(date, isStart = true) {
	const base = dayjs.utc(date);

	const formatted = isStart
		? base.startOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]')
		: base.endOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]');

	return formatted;
}
export const useVentasStore = () => {
	const [dataVentasxMes, setdataVentasxMes] = useState([{}]);
	const obtenerVentasxFechaxEmpresa = async (arrayDate, idEmpresa) => {
		try {
			console.log({
				arrayDate,
				idEmpresa,
				arrayDate: [
					formatDateToSQLServerWithDayjs(arrayDate[0], true),
					formatDateToSQLServerWithDayjs(arrayDate[1], false),
				],
			});

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
