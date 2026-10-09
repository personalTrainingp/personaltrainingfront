import { PTApi } from '@/common/api/';
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import { onSetDataView } from '@/store/data/dataSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

export const useInventarioStore = () => {
	const dispatch = useDispatch();
	const [statusData, setstatus] = useState('');
	const [message, setmessage] = useState({ msg: '', ok: false });
	const [dataHistorialCambiosxIDArticulo, setdataHistorialCambiosxIDArticulo] = useState([{}]);
	const {
		postEtiquetaxEntidadxGrupo,
		getEtiquetasxIdEntidadGrupo,
		putEtiquetaxEntidadxGrupo,
		getEtiquetasxEntidadGrupo,
	} = useTerminoStore();

	const [isLoading, setIsLoading] = useState(false);
	const [dataFechas, setdataFechas] = useState([]);
	const [articulos, setarticulos] = useState([]);
	const [articulo, setArticulo] = useState({
		// id: 0,
		// producto: '',
		// marca: '',
		// cantidad: 0,
		// lugar_compra_cotizacion: '',
		// valor_unitario_depreciado: 0,
		// valor_unitario_actual: 0,
		// observacion: '',
		// descripcion: '',
	});
	const [dataEtiquetaxIdEntidadGrupo, setdataEtiquetaxIdEntidadGrupo] = useState([]);

	const obtenerInventarioKardexxFechas = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(
				`/inventario/obtener-inventario-y-kardex-x-fechas/${id_empresa}`
			);

			setdataFechas(data.inventario_x_fechas);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerFechasInventario = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(
				`/inventario/obtener-inventario-y-kardex-x-fechas/${id_empresa}`
			);
			// dispatch(onSetDataView(data.inventario_x_fechas));
			setdataFechas(data.inventario_x_fechas);
		} catch (error) {
			console.log(error);
		}
	};
	const startRegisterArticulos = async (
		formState,
		etiquetas_busquedas,
		id_enterprice,
		selectedFile
	) => {
		try {
			setIsLoading(true);
			const { data } = await PTApi.post(
				`/inventario/post-articulo/${id_enterprice}`,
				formState
			);
			// el CHECK ID se guarda con su endpoint propio (post-articulo puede ignorar el campo)
			if (formState.id_color_subrayado && data.id_articulo) {
				try {
					await PTApi.put(`/inventario/color-subrayado-articulo/${data.id_articulo}`, {
						id_color_subrayado: Number(formState.id_color_subrayado),
					});
				} catch (error) {
					console.log(error);
				}
			}

			if (selectedFile) {
				const formData = new FormData();
				formData.append('file', selectedFile);
				await PTApi.post(
					`/storage/blob/create/${data.uid_image}?container=avatar-articulos`,
					formData
				);
			}
			if (etiquetas_busquedas.length > 0) {
				postEtiquetaxEntidadxGrupo(
					'articulo',
					'etiqueta_busqueda',
					data.id_articulo,
					etiquetas_busquedas
				);
			}
			setIsLoading(false);
			// recarga la tabla para que aparezca el articulo nuevo (con su CHECK ID)
			await obtenerArticulos(id_enterprice);
			setmessage({ msg: data.msg, ok: data.ok });
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerArticulos = async (id_enterprice) => {
		try {
			const { data } = await PTApi.get(`/inventario/obtener-inventario/${id_enterprice}`);
			const { data: dataTC } = await PTApi.get('/tipocambio/');
			const arrayEtiquetas = await getEtiquetasxEntidadGrupo('articulo', 'etiqueta_busqueda');
			console.log({ dataTC: dataTC });

			const articulos = data.articulos.map((m) => {
				const TC = dataTC.tipoCambios.find(
					(f) => new Date(f.fecha).toISOString().split('T')[0] === m.fecha_entrada
				);
				const TCu = {
					precio_venta: 3.35,
				};
				return {
					tipoCambio: TC ? TC : TCu,
					etiquetas_busquedas: arrayEtiquetas.filter((f) => f.id_fila === m.id),
					...m,
				};
			});
			console.log({ articulos });

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

	const RestaurarArticulo = async (id, id_enterprice, id_traslado) => {
		try {
			setIsLoading(true);
			const { data } = await PTApi.put(`/inventario/update-articulo/${id}`, {
				id_empresa: id_traslado,
			});
			obtenerArticulos(id_enterprice);
			setIsLoading(false);
			Swal.fire({
				icon: 'success',
				title: 'ARTICULO ACTUALIZADO CORRECTAMENTE',
				showConfirmButton: false,
				timer: 1500,
			});
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'success',
				title: 'OCURRIO UN PROBLEMA',
				showConfirmButton: false,
				timer: 1500,
			});
		}
	};
	const actualizarArticulo = async (formState, etiquetas, id, selectedFile, id_enterprice) => {
		try {
			setIsLoading(true);
			const { data } = await PTApi.put(`/inventario/update-articulo/${id}`, formState);
			await putEtiquetaxEntidadxGrupo('articulo', 'etiqueta_busqueda', id, etiquetas);

			if (selectedFile) {
				const formData = new FormData();
				formData.append('file', selectedFile);
				await PTApi.post(
					`/storage/blob/create/${data.uid_image}?container=avatar-articulos`,
					formData
				);
			}
			obtenerArticulos(id_enterprice);
			setIsLoading(false);
			Swal.fire({
				icon: 'success',
				title: 'ARTICULO ACTUALIZADO CORRECTAMENTE',
				showConfirmButton: false,
				timer: 1500,
			});
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'success',
				title: 'OCURRIO UN PROBLEMA',
				showConfirmButton: false,
				timer: 1500,
			});
		}
	};
	const actualizarOrdenArticulo = async (id, orden, id_enterprice) => {
		try {
			await PTApi.put(`/inventario/orden-articulo/${id}`, {
				orden: orden === '' || orden === null ? null : Number(orden),
			});
			obtenerArticulos(id_enterprice);
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'PROBLEMA AL ACTUALIZAR EL ORDEN',
				showConfirmButton: false,
				timer: 1500,
			});
		}
	};
	// Actualiza el color en la vista al instante (sin recargar todo el inventario,
	// que es lento y reinicia la paginacion) y lo revierte si el backend falla.
	const actualizarColorSubrayadoArticulo = async (id, id_color_subrayado, dataView) => {
		const color =
			id_color_subrayado === '' || id_color_subrayado === null
				? null
				: Number(id_color_subrayado);
		const setColor = (rows) => dispatch(onSetDataView(rows));
		setColor(
			dataView.map((m) =>
				m.id === id ? { ...m, id_color_subrayado: color, is_checking_roy: color === 1 } : m
			)
		);
		try {
			await PTApi.put(`/inventario/color-subrayado-articulo/${id}`, {
				id_color_subrayado: color,
			});
		} catch (error) {
			console.log(error);
			setColor(dataView);
			Swal.fire({
				icon: 'error',
				title: 'PROBLEMA AL ACTUALIZAR EL COLOR',
				showConfirmButton: false,
				timer: 1500,
			});
		}
	};
	const obtenerInventarioHistorialCambiosxIDARTICULO = async (idArticulo) => {
		try {
			const { data } = await PTApi.get(`/inventario/hist-cam-id/${idArticulo}`);
			console.log({ data });

			setdataHistorialCambiosxIDArticulo(data.hisCamArticuloxID);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		dataHistorialCambiosxIDArticulo,
		obtenerInventarioHistorialCambiosxIDARTICULO,
		dataFechas,
		obtenerInventarioKardexxFechas,
		obtenerFechasInventario,
		startRegisterArticulos,
		setArticulo,
		obtenerArticulos,
		obtenerArticulo,
		EliminarArticulo,
		actualizarArticulo,
		actualizarOrdenArticulo,
		actualizarColorSubrayadoArticulo,
		RestaurarArticulo,
		dataEtiquetaxIdEntidadGrupo,
		statusData,
		message,
		isLoading,
		articulo,
	};
};
