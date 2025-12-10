import { PTApi } from '@/common';
import React, { useState } from 'react';

export const useArticuloStore = () => {
	const [dataArticuloxID, setdataArticuloxID] = useState({});
	const onPostArticulo = async () => {};
	const onObtenerArticulos = async(idEmpresa)=>{

	}
	const onObtenerArticuloxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/articulo/id/${id}`);
			setdataArticuloxID(data.articulo);
		} catch (error) {
			console.log(error);
		}
	};
	const onDeleteArticuloxID = async (id) => {
		try {
			const { data } = await PTApi.put(`/articulo/id/${id}`);
		} catch (error) {
			console.log(error);
		}
	};
	const onUpdateArticuloxID = async (id) => {
		try {
			const { data } = await PTApi.put(`/articulo/id/${id}`);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		dataArticuloxID,
		onPostArticulo,
		onObtenerArticuloxID,
		onDeleteArticuloxID,
		onUpdateArticuloxID,
	};
};
