import { PTApi } from '@/common/api/';
import { onSetDataView } from '@/store/data/dataSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

export const useInventarioStore = () => {
	const dispatch = useDispatch();
	const [statusData, setstatus] = useState('');
	const [message, setmessage] = useState({ msg: '', ok: false });
	const [isLoading, setIsLoading] = useState(false);
	const [articulo, setArticulo] = useState({
		producto: '',
		marca: '',
		cantidad: 0,
		lugar_compra_cotizacion: '',
		valor_unitario_depreciado: 0,
		valor_unitario_actual: 0,
		observacion: '',
		descripcion: '',
	});
	const startRegisterArticulos = async (formState, id_enterprice, selectedFile) => {
		try {
			setIsLoading(true);
			const { data } = await PTApi.post(
				`/inventario/post-articulo/${id_enterprice}`,
				formState
			);
			if (selectedFile) {
				const formData = new FormData();
				formData.append('file', selectedFile);
				await PTApi.post(
					`/storage/blob/create/${data.uid_image}?container=avatar-articulos`,
					formData
				);
			}
			setIsLoading(false);
			await obtenerArticulos(id_enterprice);
			setmessage({ msg: data.msg, ok: data.ok });
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerArticulos = async (id_enterprice) => {
		try {
			dispatch(onSetDataView([]));
			const { data } = await PTApi.get(`/inventario/obtener-inventario/${id_enterprice}`);
			console.log(data);
			dispatch(onSetDataView(data.articulos));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerArticulo = async (id) => {
		try {
			setstatus('loading');
			const { data } = await PTApi.get(`/inventario/obtener-articulo/${id}`);
			// console.log(data);
			setstatus('success');
			// console.log(data.proveedor);

			setArticulo(data.articulo);
		} catch (error) {
			console.log(error);
		}
	};
	const EliminarArticulo = async (ID) => {
		try {
			const { data } = await PTApi.put(`/inventario/remove-articulo/${ID}`);
			Swal.fire({
				icon: 'success',
				title: 'PROVEEDOR ELIMINADO CORRECTAMENTE',
				showConfirmButton: false,
				timer: 1500,
			});
			// console.log(id);
			// dispatch(getProveedores(data));
			// obtenerProveedores();
		} catch (error) {
			console.log(error);
		}
	};
	const actualizarArticulo = async (formState, id, selectedFile) => {
		try {
			setIsLoading(true);
			const { data } = await PTApi.put(`/inventario/update-articulo/${id}`, formState);

			if (selectedFile) {
				const formData = new FormData();
				formData.append('file', selectedFile);
				await PTApi.post(
					`/storage/blob/create/${data.uid_image}?container=avatar-articulos`,
					formData
				);
			}
			// console.log(id);
			// dispatch(getProveedores(data));
			// setmessage({ msg: data.msg, ok: data.ok });
			obtenerArticulos(599);
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
	return {
		startRegisterArticulos,
		obtenerArticulos,
		obtenerArticulo,
		EliminarArticulo,
		actualizarArticulo,
		statusData,
		message,
		isLoading,
		articulo,
	};
};
