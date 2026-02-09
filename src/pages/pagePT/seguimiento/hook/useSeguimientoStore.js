import { PTApi } from '@/common';
import { useState } from 'react';

export const useSeguimientoStore = () => {
	const [dataSeguimientos, setdataSeguimientos] = useState([]);
	const obtenerSeguimiento = async () => {
		try {
			const {data} = PTApi.get('/seguimiento/rango-fecha-vencimiento');
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerSeguimiento,
	};
};
