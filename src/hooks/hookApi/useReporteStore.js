import { PTApi } from '@/common';
import { useState } from 'react';

export const useReporteStore = () => {
	const [reporteSeguimiento, setreporteSeguimiento] = useState([]);
	console.log('aquii');
	const obtenerReporteSeguimiento = async () => {
		const { data } = await PTApi.get('/reporte/reporte-seguimiento-membresia');
		setreporteSeguimiento(data);
	};
	return {
		obtenerReporteSeguimiento,
		reporteSeguimiento,
	};
};
