import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useCenterArchive = () => {
	const dispatch = useDispatch();
	const [dataxID, setdataxID] = useState({});
	const onPostArchivCenter = async (
		formState,
		id_moduloVisible,
		id_empresa,
		formFile,
		idEmpresa
	) => {
		try {
			const { data } = await PTApi.post(
				`/fils/interno/center/${id_moduloVisible}/${id_empresa}`,
				formState
			);
			await PTApi.post(
				`/storage/blob/create/${data.uid_file}?container=docs-general`,
				formFile
			);
			await obtenerArchivosCenter(idEmpresa);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerArchivosCenter = async (idEmpresa) => {
		try {
			console.log({ idEmpresa });

			const { data } = await PTApi.get(`/fils/interno/center/${idEmpresa}`);
			dispatch(onSetDataView(data.documentosInternos));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerArchivoxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/fils/interno/center/id/${id}`);
			setdataxID(data.documentosInternos);
		} catch (error) {
			console.log(error);
		}
	};
	const onDeleteArchivo = async (id, idEmpresa) => {
		try {
			const { data } = await PTApi.put(`/fils/interno/center/delete/id/${id}`);
			await obtenerArchivosCenter(idEmpresa);
		} catch (error) {
			console.log(error);
		}
	};
	const onUpdateArchivo = async (id, idEmpresa, formState) => {
		try {
			const { data } = await PTApi.put(`/fils/interno/center/id/${id}`, formState);
			await obtenerArchivosCenter(idEmpresa);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		onUpdateArchivo,
		onPostArchivCenter,
		obtenerArchivosCenter,
		onDeleteArchivo,
		obtenerArchivoxID,
		dataxID,
	};
};
