import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import { useDispatch } from 'react-redux';

export const useTerminoSistema = () => {
	const dispatch = useDispatch();
	const onPutTerminologiaSistema = async (id, formState) => {
		try {
			const termino = await PTApi.post(`/params-generales/${id}`, formState);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTerminologiaSistema = async (entidad, grupo) => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/${entidad}/${grupo}`);
			dispatch(onSetDataView(data?.parametros));
		} catch (error) {
			console.log(error);
		}
	};
	return {
		onPutTerminologiaSistema,
		obtenerTerminologiaSistema,
	};
};
