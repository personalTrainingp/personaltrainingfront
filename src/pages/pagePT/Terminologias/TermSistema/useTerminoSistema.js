import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import { useDispatch } from 'react-redux';
import { onSetDataViewTerm, onSetDataViewTerm4 } from '../store/terminologiaSlice';
import { useState } from 'react';

export const useTerminoSistema = () => {
	const dispatch = useDispatch();
	const [dataTerminoxID, setdataTerminoxID] = useState({});
	const [dataGrupo, setdataGrupo] = useState([]);
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
			console.log({ entidad, grupo });
			const { data } = await PTApi.get(`/terminologia/term1/${entidad}/${grupo}`);
			dispatch(onSetDataViewTerm(data.terminologia));
		} catch (error) {
			console.log(error);
		}
	};
	const registrarTerminologiaxEntidadyGrupo = async (formState, entidad, grupo) => {
		try {
			const response = await PTApi.post(`/terminologia/term1`, {
				...formState,
				entidad_param: entidad,
				grupo_param: grupo,
			});
			await obtenerTerminologiaSistema(entidad, grupo);
		} catch (error) {
			console.log(error);
		}
	};
	const actualizarTerminologia = async (formState, idTerm, entidad, grupo) => {
		try {
			const response = await PTApi.put(`/terminologia/term1/id/${idTerm}`, formState);
			await obtenerTerminologiaSistema(entidad, grupo);
		} catch (error) {
			console.log(error.message);
		}
	};
	const deleteTerminologia = async (idTerm, entidad, grupo) => {
		try {
			const response = await PTApi.put(`/terminologia/term1/delete/id/${idTerm}`);
			await obtenerTerminologiaSistema(entidad, grupo);
		} catch (error) {
			console.log(error.message);
		}
	};
	const obtenerGruposxEmpresa = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(`/terminologia/grupo/id_empresa/${id_empresa}`);
			console.log({ data });

			dispatch(onSetDataViewTerm4(data.dataGrupo));
		} catch (error) {
			console.log(error);
		}
	};
	const postTerminoGrupo = async (id_empresa, formState) => {
		try {
			const response = await PTApi.post(`/terminologia/grupo/${id_empresa}`, {
				...formState,
				id_empresa,
			});
			await obtenerGruposxEmpresa(id_empresa);
		} catch (error) {
			console.log(error.message);
		}
	};
	const updateTerminoGrupo = async (id, formState, id_empresa) => {
		try {
			const response = await PTApi.put(`/terminologia/grupo/id/${id}`, {
				...formState,
			});
			await obtenerGruposxEmpresa(id_empresa);
		} catch (error) {
			console.log(error.message);
		}
	};
	const deleteTerminoGrupoxID = async (id, id_empresa) => {
		try {
			const response = await PTApi.put(`/terminologia/grupo/delete/id/${id}`);
			await obtenerGruposxEmpresa(id_empresa);
		} catch (error) {
			console.log(error.message);
		}
	};
	const obtenerTerminoGrupoxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/terminologia/grupo/id/${id}`);
			setdataGrupo(data.Termgrupo);
		} catch (error) {
			console.log(error.message);
		}
	};
	return {
		dataGrupo,
		obtenerTerminoGrupoxID,
		deleteTerminoGrupoxID,
		updateTerminoGrupo,
		obtenerGruposxEmpresa,
		postTerminoGrupo,
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
