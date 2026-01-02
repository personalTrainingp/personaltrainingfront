import { PTApi } from '@/common';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewProducto } from '../store/ProductoSlice';

export const useProductosStore = () => {
	const dispatch = useDispatch();
	const [dataProducto, setdataProducto] = useState([{}]);
	const obtenerProductoxIdProducto = async (id) => {
		try {
			const { data } = await PTApi.get(`/producto/id/${id}`);
			console.log({ data });
			setdataProducto(data.producto);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerProductosxEmpresa = async (idEmpresa) => {
		try {
			const { data } = await PTApi.get(`/producto/empresa/${idEmpresa}`);
			console.log({ data });
			dispatch(onSetDataViewProducto(data.producto));
		} catch (error) {
			console.log(error);
		}
	};
	const startRegisterProducto = async (formState, idEmpresa) => {
		try {
			const { data } = await PTApi.post('/producto/', formState);
			await obtenerProductosxEmpresa(idEmpresa);
		} catch (error) {
			console.log(error);
		}
	};
	const startUpdateProductoxIdProducto = async (formState, idEmpresa, id) => {
		try {
			const { data } = await PTApi.put(`/producto/id/${id}`, formState);
			await obtenerProductosxEmpresa(idEmpresa);
		} catch (error) {
			console.log(error);
		}
	};
	const startDeleteProductoxIdProducto = async (id, idEmpresa) => {
		try {
			const { data } = await PTApi.put(`/producto/delete/id/${id}`);
			await obtenerProductosxEmpresa(idEmpresa);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerProductosxEmpresa,
		startRegisterProducto,
		startUpdateProductoxIdProducto,
		startDeleteProductoxIdProducto,
		obtenerProductoxIdProducto,
		dataProducto,
	};
};
