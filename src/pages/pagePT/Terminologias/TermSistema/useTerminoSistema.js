import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import { useDispatch } from 'react-redux';
import { onSetDataViewTerm } from '../store/terminologiaSlice';
import { useState } from 'react';

export const useTerminoSistema = () => {
	const dispatch = useDispatch();
	const [dataTerminoxID, setdataTerminoxID] = useState({});
	const onPutTerminologiaSistema = async (id, formState) => {
		try {
			const termino = await PTApi.post(`/params-generales/${id}`, formState);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTerminologiaSistemaxID = async (id_param) => {
		try {
			const { data } = await PTApi.get(`/terminologia/term1/${id_param}`);
			setdataTerminoxID(data.terminologia);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTerminologiaSistemaxEntidadxGrupo = async (entidad, grupo) => {
		try {
			const { data } = await PTApi.get(
				`/parametros/get-parametros-generales/${entidad}/${grupo}`
			);
			dispatch(onSetDataView(data));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTerminologiaSistema = async (entidad, grupo) => {
		try {
			const { data } = await PTApi.get(`/terminologia/term1/${entidad}/${grupo}`);
			dispatch(onSetDataViewTerm(data.terminologia));
		} catch (error) {
			console.log(error);
		}
	};
	const registrarTerminologiaxEntidadyGrupo = async (formState, entidad, grupo) => {
		try {
			const response = await PTApi.post(`/terminologia/term1`, formState);
			await obtenerTerminologiaSistema( entidad, grupo);
		} catch (error) {
			console.log(error);
		}
	};
	const actualizarTerminologia = async (formState, idTerm,  entidad, grupo) => {
		try {
			const response = await PTApi.put(`/terminologia/term1/id/${idTerm}`, formState);
			await obtenerTerminologiaSistema( entidad, grupo);
		} catch (error) {
			console.log(error.message);
		}
	};
	const deleteTerminologia = async (idTerm,  entidad, grupo) => {
		try {
			const response = await PTApi.put(`/terminologia/term1/delete/id/${idTerm}`);
			await obtenerTerminologiaSistema( entidad, grupo);
		} catch (error) {
			console.log(error.message);
		}
	};
	return {
		obtenerTerminologiaSistema,
		onPutTerminologiaSistema,
		obtenerTerminologiaSistemaxEntidadxGrupo,
		registrarTerminologiaxEntidadyGrupo,
		actualizarTerminologia,
		deleteTerminologia,
		obtenerTerminologiaSistemaxID,
		dataTerminoxID,
	};
};
