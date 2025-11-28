import { PTApi } from '@/common';
import React from 'react';

export const useMovimientoArticulosStore = () => {
	const obtenerMovimientoArticuloxIdArticulo = async (accion, idArticulo) => {
		try {
			const { data } = await PTApi.get(
				`/movimiento-articulo/id-articulo/${idArticulo}/${accion}`
			);
		} catch (error) {
			console.log(error);
		}
	};
	const postMovimientoArticulo = async (formState, idArticulo) => {};
	const updateMovimientoArticulo = async (idArticulo, formState) => {};
	const deleteMovimientoArticulo = async (idArticulo) => {};
	return {
		obtenerMovimientoArticuloxIdArticulo,
		postMovimientoArticulo,
		updateMovimientoArticulo,
		deleteMovimientoArticulo,
	};
};
