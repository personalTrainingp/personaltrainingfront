import { PTApi } from '@/common';
import React from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewAportes } from '../Store/AporteSlice';

export const useGestionAportes = () => {
	const dispatch = useDispatch();
	const obtenerGestionAporte = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(`/aporte/${id_empresa}`);
			dispatch(onSetDataViewAportes(data?.aportes));
		} catch (error) {
			console.log(error);
		}
	};
	const onPostGestionAporte = async (formState, id_empresa) => {
		try {
			const { data } = await PTApi.post('/aporte/', formState);
			await obtenerGestionAporte(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		onPostGestionAporte,
		obtenerGestionAporte,
	};
};
