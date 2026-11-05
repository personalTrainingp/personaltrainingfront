import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useCenterArchive = () => {
	const dispatch = useDispatch();
	const onPostArchivCenter = async (formState, formFile, uid_location) => {
		try {
			const { data } = await PTApi.post(`/fils/interno/1517/${uid_location}/599`, formState);
			if (formFile)
				await PTApi.post(
					`/storage/blob/create/${data.uid_file}?container=docs-empleados`,
					formFile
				);
			await obtenerArchivCenterxUidLocation(uid_location);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerArchivCenterxUidLocation = async (uid_location) => {
		try {
			const { data } = await PTApi.get(`/fils/interno/${uid_location}/1517`);

			dispatch(onSetDataView(data.documentosInternos));
		} catch (error) {
			console.log(error);
		}
	};
	const onUpdateArchivo = async (id, formState, uid_location) => {
		try {
			await PTApi.put(`/fils/interno/center/id/${id}`, formState);
			await obtenerArchivCenterxUidLocation(uid_location);
		} catch (error) {
			console.log(error);
		}
	};
	const onDeleteArchivo = async (id, uid_location) => {
		try {
			await PTApi.put(`/fils/interno/center/delete/id/${id}`);
			await obtenerArchivCenterxUidLocation(uid_location);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		onUpdateArchivo,
		onDeleteArchivo,
		onPostArchivCenter,
		obtenerArchivCenterxUidLocation,
	};
};
