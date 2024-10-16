import { PTApi } from '@/common';
import { onSetProspectos } from '@/store/usuario/usuarioProspectoSlice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export const useProspectoStore = () => {
	const dispatch = useDispatch();
	const [prospectoxID, setprospecto] = useState({});
	
	const obtenerProspectos = async () => {
		try {
			const { data } = await PTApi.get('/prospecto/get-prospectos');
			dispatch(onSetProspectos(data.prospectos));
		} catch (error) {
			console.log(error);
		}
	};
	const startRegisterProspecto = async (formState) => {
		try {
			console.log(formState);
			const { data } = await PTApi.post('/prospecto/post-prospecto', formState);
			obtenerProspectos();
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerProspectoxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/prospecto/get-prospecto/${id}`);
			setprospecto(data.prospecto);
		} catch (error) {
			console.log(error);
		}
	};
	const startUpdateProspecto = (id) => {};
	const startDeleteProspecto = (id) => {};
	return {
		obtenerProspectos,
		startRegisterProspecto,
		startUpdateProspecto,
		startDeleteProspecto,
		obtenerProspectoxID,
		prospectoxID,
	};
};
