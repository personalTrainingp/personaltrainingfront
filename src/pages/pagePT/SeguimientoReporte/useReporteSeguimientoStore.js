import { PTApi } from '@/common';
import { useState } from 'react';

export const useReporteSeguimientoStore = () => {
	const [clientes, setclientes] = useState([]);
	const [isLoading, setisLoading] = useState(false);
	const [error, seterror] = useState('');

	// Socios activos a la fecha 'YYYY-MM-DD' (su ultima membresia vence ese dia o despues); uno por cliente
	const obtenerReporte = async (fecha) => {
		try {
			setisLoading(true);
			seterror('');
			const { data } = await PTApi.get('/seguimiento/reporte', { params: { fecha } });
			setclientes(data.clientes || []);
		} catch (err) {
			console.log(err);
			setclientes([]);
			seterror(err.response?.data?.msg || 'No se pudo obtener el reporte');
		} finally {
			setisLoading(false);
		}
	};

	return { clientes, isLoading, error, obtenerReporte };
};
