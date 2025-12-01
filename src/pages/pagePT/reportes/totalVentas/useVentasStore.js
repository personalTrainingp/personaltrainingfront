import { PTApi } from '@/common';

export const useVentasStore = () => {
	const obtenerVentasTotales = async (rangeDate) => {
		try {
			const { data } = await PTApi.get('', {
				params: {
					rangeDate,
				},
			});
		} catch (error) {
			console.log(error);
		}
	};

	return {
		obtenerVentasTotales,
	};
};
