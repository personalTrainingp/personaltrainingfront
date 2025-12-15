import { PTApi } from '@/common';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewArticulos } from '../store/ArticulosSlice';
import { useSelector } from 'react-redux';
import { useImageStore } from '@/hooks/hookApi/useImageStore';

export const useArticuloStore = () => {
	const [dataArticuloxID, setdataArticuloxID] = useState({});
	const { dataView } = useSelector((e) => e.ARTICULO);
	const dispatch = useDispatch();
	const { postImagexUIDIMAGE } = useImageStore();
	const onPostArticulo = async (formState, formData, id_enterprice) => {
		try {
			const { data } = await PTApi.post(`/articulo/${id_enterprice}`, formState);
			await postImagexUIDIMAGE(data.uid_image, formData, 'avatar-articulos');
			await obtenerArticulosxEmpresa(id_enterprice);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerArticulosxEmpresa = async (idEmpresa) => {
		try {
			const { data } = await PTApi.get(`/articulo/${idEmpresa}`);
			dispatch(onSetDataViewArticulos(data.articulos));
		} catch (error) {
			console.log(error);
		}
	};
	const onObtenerArticuloxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/articulo/id/${id}`);
			// await obtenerImages(data.articulo.uid_image);
			setdataArticuloxID({
				...data.articulo,
				nameavatar_articulo:
					data.articulo.tb_images[data.articulo.tb_images.length - 1]?.name_image,
			});
		} catch (error) {
			console.log(error);
		}
	};
	const onDeleteArticuloxID = async (id, idEmpresa) => {
		try {
			const { data } = await PTApi.put(`/articulo/delete/id/${id}`);
			await obtenerArticulosxEmpresa(idEmpresa);
		} catch (error) {
			console.log(error);
		}
	};
	const onUpdateArticuloxID = async (formState, id, idEmpresa, formData) => {
		try {
			const { data } = await PTApi.put(`/articulo/id/${id}`, formState);
			console.log({ data, formData });
			await postImagexUIDIMAGE(data.uid_image, formData, 'avatar-articulos');
			await obtenerArticulosxEmpresa(idEmpresa);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerArticulosxEmpresa,
		dataView,
		dataArticuloxID,
		onPostArticulo,
		onObtenerArticuloxID,
		onDeleteArticuloxID,
		onUpdateArticuloxID,
	};
};
