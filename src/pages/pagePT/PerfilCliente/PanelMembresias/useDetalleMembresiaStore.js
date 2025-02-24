const { PTApi } = require('@/common');

export const useDetalleMembresiaStore = () => {
	const obtenerDetalleMembresiaxIDVENTA = async (id_venta) => {
		try {
			const { data } = await PTApi.get('');
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerDetalleMembresiaxIDVENTA,
	};
};
