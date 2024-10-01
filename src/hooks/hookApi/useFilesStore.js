import { PTApi } from '@/common';
import { onSetDataFileAdj } from '@/store/usuario/usuarioClienteSlice';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useFilesStore = () => {
	const dispatch = useDispatch();
	const postFiles = async (uid_file, formState, formFile) => {
		try {
			const { data: dataFiles } = await PTApi.post(`/fils/post-file/${uid_file}`, {
				...formState,
			});
			await PTApi.post(
				`/storage/blob/create/${dataFiles.UID}?container=files-adjuntos-clientes`,
				formFile
			);
			obtenerFilesxUIDLOCATION(uid_file);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerFilesxUIDLOCATION = async (uid_files) => {
		try {
			const { data } = await PTApi.get(`/fils/get-files/${uid_files}`);
			dispatch(onSetDataFileAdj(data.all));
		} catch (error) {
			console.log(error);
		}
	};
	const onDeleteFilesxID = async (id, uid_files) => {
		try {
			const { data } = await PTApi.put(`/fils/delete-file/${id}`);
			obtenerFilesxUIDLOCATION(uid_files);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		onDeleteFilesxID,
		postFiles,
		obtenerFilesxUIDLOCATION,
	};
};
