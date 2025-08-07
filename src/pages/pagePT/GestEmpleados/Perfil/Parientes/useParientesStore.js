import { PTApi } from '@/common';
import React from 'react';

export const useParientesStore = () => {
	const onPostParientes = async (formState) => {
		try {
			const { data } = await PTApi.post('/usuario/pariente', formState);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParientesxTipoxId = async () => {
		try {
			const { data } = await PTApi.get('/usuario/parientes/tipo/id');
		} catch (error) {
			console.log(error);
		}
	};
	return {
		onPostParientes,
	};
};
