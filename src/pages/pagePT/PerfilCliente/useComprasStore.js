import { PTApi } from '@/common';
import { useState } from 'react';

export const useComprasStore = () => {
	const [dataMembresias, setdataMembresias] = useState([]);
	const obtenerMembresiasxCli = async (id_cli) => {
		try {
			const { data } = await PTApi.get(`/venta/obtener-membresias-x-cli/${id_cli}`);
			setdataMembresias(data.membresias);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerMembresiasxCli,
		dataMembresias,
	};
};
