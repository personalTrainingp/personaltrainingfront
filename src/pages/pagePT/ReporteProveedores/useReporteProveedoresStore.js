import { PTApi } from '@/common';
import { aplicarTipoDeCambio } from '@/helper/aplicarTipoCambio';
import { formatDateToSQLServerWithDayjs } from '@/helper/formatDateToSQLServerWithDayjs';
import { obtenerTipoDeCambio } from '@/middleware/obtenerTipoDeCambio';
import { useState } from 'react';

export const useReporteProveedoresStore = () => {
	const [dataGastosxFecha, setdataGastosxFecha] = useState([]);
	const obtenerGastosxFecha = async (id_empresa, arrayDate) => {
		try {
			const { data } = await PTApi.get(`/egreso/fecha-comprobante/${id_empresa}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			const dataGastos = data.gastos.map((g) => {
				return {
					fecha_primaria: g.fecha_comprobante,
					...g,
				};
			});
			const dataTipoTC = await obtenerTipoDeCambio();
			setdataGastosxFecha(aplicarTipoDeCambio(dataTipoTC, dataGastos));
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerGastosxFecha,
		dataGastosxFecha,
	};
};
