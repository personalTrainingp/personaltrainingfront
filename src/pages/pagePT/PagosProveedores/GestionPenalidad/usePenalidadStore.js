import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/PenalidadSlice';
import React from 'react';
import { useDispatch } from 'react-redux';

export const usePenalidadStore = () => {
	const dispatch = useDispatch();
	const onPostPenalidad = async (formState, id_contrato) => {
		try {
			const { data } = await PTApi.post(`/penalidad/${id_contrato}`, formState);
			obtenerPenalidadesxIDCONTRATO(id_contrato);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerPenalidadesxIDCONTRATO = async (id_contrato) => {
		try {
			const { data } = await PTApi.get(`/penalidad/${id_contrato}`);
			dispatch(onSetDataView(data.penalidades));
		} catch (error) {
			console.log(error, 'en penalidad');
		}
	};
	return {
		obtenerPenalidadesxIDCONTRATO,
		onPostPenalidad,
	};
};
