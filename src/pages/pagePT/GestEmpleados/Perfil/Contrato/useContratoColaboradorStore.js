import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useContratoColaboradorStore = () => {
	const dispatch = useDispatch();
	const postContratoColaborador = async (formState, uid_empleado) => {
		try {
			const { data } = await PTApi.post(`/jornada/jornada/${uid_empleado}`, formState);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerContratosxColaborador = async (id_empl) => {
		try {
			const { data } = await PTApi.get(`/jornada/jornada/${id_empl}`);
			console.log({ data, id_empl });
			dispatch(onSetDataView(data.contratos));
		} catch (error) {
			console.log(error);
		}
	};
	const postTipoContratoxDia = async (formArray) => {
		try {
			const { data } = await PTApi.post(`/jornada/diaxcontrato`, formArray);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerDiasLaborablesxContrato = async (idContrato) => {
		try {
			const { data } = await PTApi.get(`/jornada/jornada/${idContrato}`);
			
		} catch (error) {
			console.log(error);
		}
	};

	return {
		postContratoColaborador,
		obtenerContratosxColaborador,
		postTipoContratoxDia,
		obtenerDiasLaborablesxContrato,
	};
};
