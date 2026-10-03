import { PTApi } from '@/common';
import { useState } from 'react';

export const useReporteSeguimientoStore = () => {
	const [dataReporte, setdataReporte] = useState(null);
	const [isLoading, setisLoading] = useState(false);
	const [error, seterror] = useState('');

	// Curva de asistencia diaria por programa + tabla unificada por DNI (clientes + huellero)
	const obtenerReporte = async (desde, hasta) => {
		try {
			setisLoading(true);
			seterror('');
			const { data } = await PTApi.get('/eventos-asistencia/reporte', { params: { desde, hasta } });
			setdataReporte(data);
		} catch (error) {
			console.log(error);
			setdataReporte(null);
			seterror(error.response?.data?.msg || 'No se pudo obtener el reporte de asistencia');
		} finally {
			setisLoading(false);
		}
	};

	return { obtenerReporte, dataReporte, isLoading, error };
};
