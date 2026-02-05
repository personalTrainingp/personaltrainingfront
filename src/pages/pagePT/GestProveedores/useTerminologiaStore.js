import { PTApi } from '@/common';
import React from 'react';
import { onSetDataViewTerm } from '../Terminologias/store/terminologiaSlice';
import { useDispatch } from 'react-redux';

export const useTerminologiaStore = () => {
	const dispatch = useDispatch();
	const registrarTerminologiaxEntidadyGrupo = async (formState, entidad, grupo) => {
		try {
			const response = await PTApi.post(`/terminologia/term1`, formState);

			console.log({ formState });
			await obtenerTerminologiaSistema(entidad, grupo);
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
	return {
		registrarTerminologiaxEntidadyGrupo,
		obtenerTerminologiaSistema,
	};
};
