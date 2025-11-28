import { PTApi } from '@/common';
import React from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewMovimiento } from './MovimientosSlice';
import { useSelector } from 'react-redux';

export const useMovimientoArticulosStore = () => {
	const dispatch = useDispatch();
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
	const postMovimientoArticulo = async (formState, idArticulo, movimiento = '') => {
		try {
			const { data } = await PTApi.post(
				`/movimiento-articulo/${idArticulo}/${movimiento}`,
				formState
			);
			await obtenerMovimientoArticuloxIdArticulo(movimiento, idArticulo);
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
		obtenerMovimientoArticuloxIdArticulo,
		postMovimientoArticulo,
		updateMovimientoArticulo,
		deleteMovimientoArticulo,
	};
};
