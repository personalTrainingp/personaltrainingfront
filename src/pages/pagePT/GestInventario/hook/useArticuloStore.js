import { PTApi } from '@/common';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useArticuloStore = () => {
	const [dataArticuloxID, setdataArticuloxID] = useState({});
	const dispatch = useDispatch()
	const onPostArticulo = async () => {};
	const obtenerArticulosxEmpresa = async (idEmpresa) => {
		try {
			const { data } = await PTApi.get(`/articulo/${idEmpresa}`);
			dispatch()
		} catch (error) {
			console.log(error);
		}
	};
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
		obtenerArticulosxEmpresa,
		dataArticuloxID,
		onPostArticulo,
		onObtenerArticuloxID,
		onDeleteArticuloxID,
		onUpdateArticuloxID,
	};
};
