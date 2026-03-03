import { PTApi } from '@/common';

export const useGestionCambioProgramaStore = () => {
	const obtenerUltimaMembresiaxIdCli = async (id_cli) => {
		try {
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerLosCambiosMembresia = async () => {
		try {
			const { data } = await PTApi.get('');
		} catch (error) {
			console.log(error);
		}
	};
	const eliminarCambioMembresia = async(id_cambio) => {
		try {
			const { data } = await PTApi.get('');
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerLosCambiosMembresia,
		obtenerUltimaMembresiaxIdCli,
		eliminarCambioMembresia,
	};
};
