import { PTApi } from '@/common';
import { onSetModulos, onSetSections } from '@/store/sections/RutasSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useRoleStore = () => {
	const dispatch = useDispatch();
	const obtenerModulos = async () => {
		try {
			const uid = localStorage.getItem('uid-user');
			const { data } = await PTApi.get(`/rol/get-module-x-rol/${uid}`);
			console.log(data);
			
			dispatch(onSetModulos(data.MODULOS_ITEMS));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerSeccions = async (modulo) => {
		try {
			const { data } = await PTApi.get(`/rol/get-section-x-module/${modulo?.key}`);
			dispatch(onSetSections(data.MENU_ITEMS));
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerModulos,
		obtenerSeccions,
	};
};
