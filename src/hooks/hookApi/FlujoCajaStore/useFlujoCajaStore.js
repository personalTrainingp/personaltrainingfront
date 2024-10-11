import { PTApi } from '@/common';
import { useState } from 'react';

export const useFlujoCajaStore = () => {
	const [dataIngresos_FC, setdataIngresos_FC] = useState([]);
	const obtenerIngresosxMes = async (mes, anio) => {
		try {
			const { data } = await PTApi.get('/flujo-caja/ingresos', {
				params: {
					mes,
					anio,
				},
			});
			console.log(data.data);

			setdataIngresos_FC(data.data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerGastosxMes = async (anio) => {
		try {
			const { data } = await PTApi.get('/flujo-caja/gastos', {
				params: {
					anio,
				},
			});
		} catch (error) {
			console.log(error);
		}
	};

	return {
		obtenerIngresosxMes,
		obtenerGastosxMes,
		dataIngresos_FC,
	};
};
