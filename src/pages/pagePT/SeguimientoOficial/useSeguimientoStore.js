import { PTApi } from '@/common';
import { useState } from 'react';

export const useSeguimientoStore = () => {
	const [dataSeguimientoxFecha, setdataSeguimientoxFecha] = useState([]);
	const obtenerSeguimientoxFecha = async (arrayDate) => {
		try {
			const { data } = await PTApi.get('/seguimiento/rango-fecha-vencimiento', {
				params: {
					arrayDate: [arrayDate[0], arrayDate[1]],
				},
			});
			setdataSeguimientoxFecha(data.dataSeguimiento);
			console.log({ data });
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerSeguimientos = async () => {
		try {
			const { data } = await PTApi.get('/seguimiento/');
			console.log({ data });
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerSeguimientoxFecha,
		obtenerSeguimientos,
		dataSeguimientoxFecha
	};
};
