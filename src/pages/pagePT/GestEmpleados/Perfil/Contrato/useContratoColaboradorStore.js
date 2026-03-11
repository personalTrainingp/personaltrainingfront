import { PTApi } from '@/common';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataView } from './contratoEmpSlice';

export const useContratoColaboradorStore = () => {
	const dispatch = useDispatch();
	const [dataDiasLaborablesxContrato, setdataDiasLaborablesxContrato] = useState([]);
	const postContratoColaborador = async (formState, id_empl) => {
		try {
			const { data } = await PTApi.post(`/contrato-empleado/id_empl/${id_empl}`, formState);
			obtenerContratosxColaborador(id_empl);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerContratosxColaborador = async (id_empl) => {
		try {
			const { data } = await PTApi.get(`/contrato-empleado/id_empl/${id_empl}`);
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
			const { data } = await PTApi.get(`/jornada/jornada/dias-laborables-id/${idContrato}`);
			setdataDiasLaborablesxContrato();
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
