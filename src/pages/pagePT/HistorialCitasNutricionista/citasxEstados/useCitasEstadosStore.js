import { PTApi } from '@/common';
import { useState } from 'react';

export default function useCitasEstadosStore() {
	const [dataCitas, setdataCitas] = useState([]);
	const obtenerTodaCitas = async () => {
		try {
			const { data } = await PTApi.get('/cita/get-citas-empresa/598');
			setdataCitas(data.citas);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerTodaCitas,
		dataCitas,
	};
}
