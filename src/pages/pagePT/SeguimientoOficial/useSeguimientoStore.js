import { PTApi } from '@/common';

export const useSeguimientoStore = () => {
	const obtenerSeguimiento = async (arrayDate) => {
		try {
			const { data } = await PTApi.get('/seguimiento/rango-fecha-vencimiento', {
                params: {
                        
                }
            });
			console.log({ data });
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerSeguimiento,
	};
};
