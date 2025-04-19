import { PTApi } from '@/common';
import React from 'react';

export const useKardexStore = () => {
	const obtenerKardexXArticuloXMovimiento = async ({ id_articulo, movimiento }) => {
		try {
			const { data } = await PTApi.get(
				`/inventario/movimiento-x-articulo/${id_articulo}/${movimiento}`
			);
		} catch (error) {
			console.log(error);
		}
	};
	const postKardexxMovimientoxArticulo = async ({ id_articulo, movimiento }) => {
		try {
			const { data } = await PTApi.get(
				`/inventario/movimiento-x-articulo/${id_articulo}/${movimiento}`
			);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerArticulos = async (id_enterprice) => {
		try {
			const { data } = await PTApi.get(`/inventario/obtener-inventario/${id_enterprice}`);
			const arrayEtiquetas = await getEtiquetasxEntidadGrupo('articulo', 'etiqueta_busqueda');
			const articulos = data.articulos.map((m) => {
				return {
					etiquetas_busquedas: arrayEtiquetas.filter((f) => f.id_fila === m.id),
					...m,
				};
			});
			dispatch(onSetDataView(articulos));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerArticulo = async (id) => {
		try {
			setstatus('loading');
			const { data } = await PTApi.get(`/inventario/obtener-articulo/${id}`);
			console.log(data, 'dattaaaa');

			const { data: dataImg } = await PTApi.get(
				`/storage/blob/upload/get-upload/${data?.articulo?.uid_image}`
			);
			console.log(dataImg, 'dataimgggg');

			const dataEtiquetasxIdEntidadGrupo = await getEtiquetasxIdEntidadGrupo(
				'articulo',
				'etiqueta_busqueda',
				id
			);
			console.log({ dataEtiquetasxIdEntidadGrupo });
			// console.log(data);
			setstatus('success');
			setArticulo({
				...data.articulo,
				etiquetas_busquedas: dataEtiquetasxIdEntidadGrupo,
				dataImg,
				// dataEtiquetasxIdEntidadGrupo: dataEtiquetasxIdEntidadGrupo,
			});
			setdataEtiquetaxIdEntidadGrupo(dataEtiquetasxIdEntidadGrupo);
		} catch (error) {
			console.log(error);
		}
	};
	const EliminarArticulo = async (ID, id_enterprice) => {
		try {
			const { data } = await PTApi.put(`/inventario/remove-articulo/${ID}`);
			Swal.fire({
				icon: 'success',
				title: 'ARTICULO ELIMINADO CORRECTAMENTE',
				showConfirmButton: false,
				timer: 1500,
			});
			obtenerArticulos(id_enterprice);
			// console.log(id);
			// dispatch(getProveedores(data));
			// obtenerProveedores();
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerKardexXArticuloXMovimiento,
		postKardexxMovimientoxArticulo,
	};
};
