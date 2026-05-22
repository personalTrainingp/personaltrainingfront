import { PTApi } from '@/common';
import { useDispatch } from 'react-redux';
import { onSetCambioPrograma } from './cambioProgramaSlice';

export const useGestionCambioProgramaStore = () => {
	const dispatch = useDispatch();
	const obtenerUltimaMembresiaxIdCli = async (id_cli) => {
		try {
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerLosCambiosMembresia = async () => {
		try {
			const { data } = await PTApi.get('/cambio-programa');
			console.log({ data });

			dispatch(onSetCambioPrograma(data.data));
		} catch (error) {
			console.log(error);
		}
	};
	const eliminarCambioMembresia = async (id_cambio) => {
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
