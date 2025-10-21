import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useCenterArchive = () => {
	const dispatch = useDispatch();
	const onPostArchivCenter = async (formState, id_moduloVisible, id_empresa, formFile) => {
		try {
			console.log({ formState, id_moduloVisible, id_empresa, formFile });

			const { data } = await PTApi.post(
				`/fils/interno/center/${id_moduloVisible}/${id_empresa}`,
				formState
			);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerArchivosCenter = async () => {
		try {
			const { data } = await PTApi.get('/fils/interno/center');
			dispatch(onSetDataView(data.documentosInternos));
		} catch (error) {
			console.log(error);
		}
	};
	return {
		onPostArchivCenter,
		obtenerArchivosCenter,
	};
};
