import { PTApi } from '@/common';

export const useGestVentasStore = () => {
	const putVentas = async (id_origen, id_venta, obtenerVentaxID) => {
		try {
			await PTApi.put(`/venta/put-venta/${id_venta}`, {
				id_origen: id_origen,
			});
			obtenerVentaxID(id_venta);
		} catch (error) {
			console.log(error);
		}
	};
	return { putVentas };
};
