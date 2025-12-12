import { PTApi } from '@/common';
import React from 'react';

export const useArticulosStore = () => {
	const updateArticuloxID = (idArticulo, formState) => {
		try {
			const {} = PTApi.put(`${idArticulo}`, formState);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		updateArticuloxID,
	};
};
