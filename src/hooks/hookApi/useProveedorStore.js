import { PTApi } from '@/common/api/';
import { onSetProveedores, onSetProveedoresCOMBO } from '@/store/dataProveedor/proveedorSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

export const useProveedorStore = () => {
	const dispatch = useDispatch();
	const [statusData, setstatus] = useState('');
	const [message, setmessage] = useState({ msg: '', ok: false });
	const [isLoading, setIsLoading] = useState(false);
	const [proveedor, setProveedor] = useState({
		id: 0,
		ruc_prov: '',
		razon_social_prov: '',
		tel_prov: '',
		cel_prov: '',
		email_prov: '',
		direccion_prov: '',
		dni_vend_prov: '',
		nombre_vend_prov: '',
		tel_vend_prov: '',
		email_vend_prov: '',
		estado_prov: true,
		uid_comentario: '',
		uid_contrato_proveedor: '',
		uid_presupuesto_proveedor: '',
		uid_documentso_proveedor: '',
		parametro_oficio: {label_param: ''},
		id_oficio: 0,
	});
	const startRegisterProveedor = async (formState) => {
		try {
			setIsLoading(true);
			const { data } = await PTApi.post('/proveedor/post-proveedor', formState);
			setIsLoading(false);
			setmessage({ msg: data.msg, ok: data.ok });
			obtenerParametrosProveedor();
			obtenerProveedores();
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerProveedores = async () => {
		try {
			const { data } = await PTApi.get('/proveedor/obtener-proveedores');
			dispatch(onSetProveedores(data.proveedores));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametrosProveedor = async () => {
		try {
			// setIsLoading(true);
			const { data } = await PTApi.get(`/parametros/get_params/producto/proveedor`);
			// setDataProducProveedor(data);
			dispatch(onSetProveedoresCOMBO(data));
			// setIsLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerProveedor = async (id) => {
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
	const obtenerProveedorxUID = async (uid) => {
		try {
			setIsLoading(false);
			const { data } = await PTApi.get(`/proveedor/obtener-proveedor-uid/${uid}`);

			setProveedor(data.proveedor);
			setIsLoading(true);
		} catch (error) {
			console.log(error);
		}
	};
	const EliminarProveedor = async (id_prov) => {
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
	const actualizarProveedor = async (formState, id) => {
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
		obtenerProveedores,
		startRegisterProveedor,
		obtenerProveedor,
		EliminarProveedor,
		actualizarProveedor,
		obtenerParametrosProveedor,
		obtenerProveedorxUID,
		isLoading,
		statusData,
		proveedor,
		message,
	};
};
