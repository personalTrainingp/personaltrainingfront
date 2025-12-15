import { PTApi } from '@/common';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewMovimiento } from './MovimientosSlice';
import { useSelector } from 'react-redux';
import { useArticuloStore } from '../GestInventario/hook/useArticuloStore';

export const useMovimientoArticulosStore = () => {
	const dispatch = useDispatch();
	const [dataArticuloxIDARTICULO, setdataArticuloxIDARTICULO] = useState({});
	const { obtenerArticulosxEmpresa } = useArticuloStore()
	const onObtenerArticuloxIDARTICULO = async (id) => {
		try {
			const { data } = await PTApi.get(`/articulo/id/${id}`);
			// await obtenerImages(data.articulo.uid_image);
			setdataArticuloxIDARTICULO({
				...data.articulo,
			});
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerMovimientoArticuloxIdArticulo = async (accion, idArticulo) => {
		try {
			const { data } = await PTApi.get(
				`/movimiento-articulo/id-articulo/${idArticulo}/${accion}`
			);
			dispatch(onSetDataViewMovimiento(data.movimientoArticulo));
		} catch (error) {
			console.log(error);
		}
	};
	const postMovimientoArticulo = async (formState, idArticulo, movimiento = '', idEmpresa) => {
		try {
			const { data } = await PTApi.post(
				`/movimiento-articulo/${idArticulo}/${movimiento}`,
				formState
			);
			await obtenerMovimientoArticuloxIdArticulo(movimiento, idArticulo);
			await obtenerArticulosxEmpresa(idEmpresa)
		} catch (error) {
			console.log(error);
		}
	};
	const updateMovimientoArticulo = async (id, formState, movimiento, idArticulo) => {
		try {
			const { data } = await PTApi.put(`/movimiento-articulo/${id}`, formState);
			await obtenerMovimientoArticuloxIdArticulo(movimiento, idArticulo);
		} catch (error) {
			console.log(error);
		}
	};
	const deleteMovimientoArticulo = async (id, movimiento, idArticulo) => {
		try {
			const { data } = await PTApi.put(`/movimiento-articulo/delete/${id}`);
			await obtenerMovimientoArticuloxIdArticulo(movimiento, idArticulo);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		dataArticuloxIDARTICULO,
		onObtenerArticuloxIDARTICULO,
		obtenerMovimientoArticuloxIdArticulo,
		postMovimientoArticulo,
		updateMovimientoArticulo,
		deleteMovimientoArticulo,
	};
};
