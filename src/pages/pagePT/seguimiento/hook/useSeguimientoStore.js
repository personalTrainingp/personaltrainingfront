import { PTApi } from '@/common';
import { useState } from 'react';

export const useSeguimientoStore = () => {
	const [dataSeguimientos, setdataSeguimientos] = useState([]);
	const obtenerSeguimiento = async () => {
		try {
            const { } = PTApi.get('/')
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerSeguimiento,
	};
};
