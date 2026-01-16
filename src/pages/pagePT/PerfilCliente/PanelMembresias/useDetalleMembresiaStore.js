import { PTApi } from '@/common';
import { useState } from 'react';

export const useDetalleMembresiaStore = () => {
	const [dataSeguimientos, setdataSeguimientos] = useState([]);
	const obtenerSeguimientosxIdCli = async (id_cli) => {
		try {
			const { data } = await PTApi.get(`/seguimiento/id_cli/${id_cli}`);
			console.log({ data });
			setdataSeguimientos(data.seguimientos);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		dataSeguimientos,
		obtenerSeguimientosxIdCli,
	};
};
