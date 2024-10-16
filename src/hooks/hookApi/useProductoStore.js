import { PTApi } from '@/common';
import { onGetProductos } from '@/store/dataProducto/productoSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useProductoStore = () => {
	const dispatch = useDispatch();
	const obtenerProductos = async () => {
		try {
			const { data } = await PTApi.get('/producto/get-tb-productos');
			dispatch(onGetProductos(data.producto));
		} catch (error) {
			console.log(error);
		}
	};
	const startRegisterProducto = async (formState) => {
		try {
			const { data } = await PTApi.post('/producto/post-producto', formState);
			obtenerProductos();
		} catch (error) {
			console.log(error);
		}
	};
	const startUpdateProducto = async ({
		id_prodInv,
		id_articulo,
		id_usoArt,
		id_clasificacion,
		id_almacen,
		id_unidMedida,
		stock_prodInv,
		precio_prodInv,
	}) => {
		try {
			const { data } = await PTApi.put(
				`/inventario/update-producto-inventario/${id_prodInv}`,
				{
					id_articulo,
					id_usoArt,
					id_clasificacion,
					id_almacen,
					id_unidMedida,
					stock_prodInv,
					precio_prodInv,
				}
			);
			obtenerProductos();
		} catch (error) {
			console.log(error);
		}
	};
	// const startDeleteProducto = async ({ id_articulo }) => {
	// 	try {
	// 		const { data } = await PTApi.put(
	// 			`/inventario/delete-producto-inventario/${id_articulo}`
	// 		);
	// 		obtenerProductos();
	// 	} catch (error) {
	// 		console.log('Error en useProductoStore', error);
	// 	}
	// };
	// const startObtenerProductoxID = async (id_prodInv) => {
	// 	try {
	// 		const { data } = await PTApi.get(
	// 			`/inventario/obtener-producto-inventario/${id_prodInv}`
	// 		);
	// 	} catch (error) {
	// 		console.log('Error en useProductoStore', error);
	// 	}
	// };

	return {
		obtenerProductos,
		startRegisterProducto,
		startUpdateProducto,
	};
};
