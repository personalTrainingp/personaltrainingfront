import { PTApi } from '@/common';
import React from 'react';

export const useArticuloStore = () => {
	const onPostArticulo = async () => {};
	const onObtenerArticuloxID = async () => {};
	const onDeleteArticuloxID = async () => {};
	const onUpdateArticuloxID = async () => {};
	const obtenerArticuloxID = async (id) => {
		try {
			const { data } = await PTApi.get('');
		} catch (error) {
			console.log(error);
		}
	};
	return {
		onPostArticulo,
		onObtenerArticuloxID,
		onDeleteArticuloxID,
		onUpdateArticuloxID,
	};
};
