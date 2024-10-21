import { PTApi } from '@/common/api/';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

export const useVentasStore = () => {
	const dispatch = useDispatch();
	const [statusData, setstatus] = useState('');
	const [message, setmessage] = useState({ msg: '', ok: false });
	const [isLoading, setIsLoading] = useState(false);
	const [proveedor, setProveedor] = useState({
		producto: '',
		marca: '',
		cantidad: 0,
		lugar_compra_cotizacion: '',
		valor_unitario_depreciado: 0,
		valor_unitario_actual: 0,
		observacion: '',
		descripcion: '',
	});
	const startRegisterProveedor = async (formState) => {
		try {
			setIsLoading(true);
			const { data } = await PTApi.post('/inventario/post-articulo', formState);
			setIsLoading(false);
			setmessage({ msg: data.msg, ok: data.ok });
			obtenerParametrosProveedor();
			obtenerProveedores();
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerArticulos = async (estado_prov) => {
		try {
			const { data } = await PTApi.get('/proveedor/obtener-proveedores', {
				params: {
					estado_prov: estado_prov,
				},
			});
			dispatch(onSetProveedores(data.proveedores));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerArticulo = async (id) => {
		try {
			setstatus('loading');
			const { data } = await PTApi.get(`/proveedor/obtener-proveedor/${id}`);
			// console.log(data);
			setstatus('success');
			// console.log(data.proveedor);

			setProveedor({ proveedor: data.proveedor });
		} catch (error) {
			console.log(error);
		}
	};
	const EliminarArticulo = async (id_prov) => {
		try {
			const { data } = await PTApi.put(`/proveedor/remove-proveedor/${id_prov}`);
			Swal.fire({
				icon: 'success',
				title: 'PROVEEDOR ELIMINADO CORRECTAMENTE',
				showConfirmButton: false,
				timer: 1500,
			});
			// console.log(id);
			// dispatch(getProveedores(data));
			obtenerProveedores();
		} catch (error) {
			console.log(error);
		}
	};
	const actualizarArticulo = async (formState, id) => {
		try {
			setIsLoading(true);
			const { data } = await PTApi.put(`/proveedor/update-proveedor/${id}`, formState);
			// console.log(id);
			// dispatch(getProveedores(data));
			setmessage({ msg: data.msg, ok: data.ok });
			setIsLoading(false);
			obtenerProveedores();
			Swal.fire({
				icon: 'success',
				title: 'PROVEEDOR ACTUALIZADO CORRECTAMENTE',
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
		startRegisterProveedor,
		obtenerArticulos,
		obtenerArticulo,
		EliminarArticulo,
		actualizarArticulo,
		obtenerProveedor,
		EliminarProveedor,
		actualizarProveedor,
		statusData,
		message,
		isLoading,
		proveedor,
	};
};
