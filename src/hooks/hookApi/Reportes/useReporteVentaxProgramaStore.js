import { PTApi } from '@/common';
import { useState } from 'react';

export const useReporteVentaxProgramaStore = () => {
	const [membresiasxFechaxPrograma, setmembresiasxFechaxPrograma] = useState([]);
	const obtenerMembresiasxFechaxPrograma = async (id_programa, rangoDate) => {
		try {
			const { data } = await PTApi.get(
				'/reporte/programa/obtener-membresias-x-fecha-x-programa',
				{
					params: {
						rangoDate,
						id_programa,
					},
				}
			);
			setmembresiasxFechaxPrograma(data.membresias);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerMembresiasxFechaxPrograma,
		membresiasxFechaxPrograma,
	};
};
