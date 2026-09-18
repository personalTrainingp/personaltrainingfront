import { PTApi } from '@/common';
import { useState } from 'react';

export const useDetalleMembresiaStore = () => {
	const [dataSeguimientos, setdataSeguimientos] = useState([]);
	const obtenerSeguimientosxUid = async (uid) => {
		try {
			const { data } = await PTApi.get(`/seguimiento/uid/${uid}`);
			setdataSeguimientos(data.seguimientos);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		dataSeguimientos,
		obtenerSeguimientosxUid,
	};
};
