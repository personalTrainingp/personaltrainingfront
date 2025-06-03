import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useKardexStore = () => {
	const dispatch = useDispatch();
	const [dataMovimientos, setdataMovimientos] = useState([]);
	const obtenerKardexXArticuloXMovimiento = async (id_articulo, movimiento) => {
		try {
			const { data } = await PTApi.get(
				`/inventario/movimiento-x-articulo/${id_articulo}/${movimiento}`
			);
			const modelo = data?.movimientos.map((e) => {
				return {
					id: e?.id,
					cantidad: e?.cantidad,
					fecha_cambio: e.fecha_cambio,
					parametro_lugar_destino: {
						nombre_zona: e?.parametro_lugar_destino?.nombre_zona,
					},
					parametro_motivo: {
						label_param: e.parametro_motivo?.label_param,
					},
					observacion: e?.observacion,
				};
			});
			console.log(data, modelo, 'aqui?');
			// dispatch(onSetDataView(data?.movimiento));
			setdataMovimientos(modelo);

			// dispatch();
		} catch (error) {
			console.log(error);
		}
	};
	const postKardexxMovimientoxArticulo = async (action, id_enterprice, formState) => {
		try {
			await PTApi.post(`/inventario/post-kardex/${action}/${id_enterprice}`, {
				...formState,
			});
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
		dataMovimientos,
	};
};
