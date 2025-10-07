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
			dispatch(onSetDataView(data));
		} catch (error) {
			console.log(error);
		}
	};
	const registrarTerminologiaxEntidadyGrupo = async (formState, entidad, grupo) => {
		try {
			const response = await PTApi.post(
				`/parametros/postRegistrar/${grupo}/${entidad}`,
				formState
			);
			await obtenerTerminologiaSistema(entidad, grupo);
		} catch (error) {
			console.log(error);
		}
	};
	const actualizarTerminologia = async (parametroPorEnviar, idTerm, entidad, grupo) => {
		try {
			const response = await PTApi.put(
				`/parametros/params-generales/${idTerm}`,
				parametroPorEnviar
			);
			await obtenerTerminologiaSistema(entidad, grupo);
		} catch (error) {
			console.log(error.message);
		}
	};
	const deleteTerminologia = async (idTerm, entidad, grupo) => {
		try {
			const response = await PTApi.put(`/parametros/params-generales/delete/${idTerm}`);
			await obtenerTerminologiaSistema(entidad, grupo);
		} catch (error) {
			console.log(error.message);
		}
	};
	return {
		onPutTerminologiaSistema,
		obtenerTerminologiaSistema,
		registrarTerminologiaxEntidadyGrupo,
		actualizarTerminologia,
		deleteTerminologia,
	};
};
