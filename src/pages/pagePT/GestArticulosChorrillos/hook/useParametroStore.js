import { PTApi } from '@/common';
import React from 'react';

export const useParametroStore = () => {
	const onPostEtiquetaxIds = async (label_param, grupo_param, entidad_param) => {
		try {
			const { data } = await PTApi.post('/parametros/postRegistrar', {
				label_param,
				grupo_param,
				entidad_param,
			});
		} catch (error) {
			console.log(error);
		}
	};
	return {
		onPostEtiquetaxIds,
	};
};
