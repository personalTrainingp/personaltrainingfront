import { PTApi } from '@/common/api/';
import { onSetProveedores } from '@/store/dataProveedor/proveedorSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useProveedorStore = () => {
	const dispatch = useDispatch();
	const [statusData, setstatus] = useState('');
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
	});
	const startRegisterProveedor = async (formState) => {
		try {
			const { data } = await PTApi.post('/proveedor/post-proveedor', formState);
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
	const obtenerProveedor = async (id) => {
		try {
			setstatus('loading');
			const { data } = await PTApi.get(`/proveedor/obtener-proveedor/${id}`);
			// console.log(data);
			setstatus('success');

			setProveedor(data.proveedor);
		} catch (error) {
			console.log(error);
		}
	};
	const EliminarProveedor = async (id_prov) => {
		try {
			const { data } = await PTApi.put(`/proveedor/remove-proveedor/${id_prov}`);
			// console.log(id);
			// dispatch(getProveedores(data));
			obtenerProveedores();
		} catch (error) {
			console.log(error);
		}
	};
	const actualizarProveedor = async (formState, id) => {
		try {
			const { data } = await PTApi.put(`/proveedor/update-proveedor/${id}`, formState);
			// console.log(id);
			// dispatch(getProveedores(data));
			obtenerProveedores();
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerProveedores,
		startRegisterProveedor,
		obtenerProveedor,
		EliminarProveedor,
		actualizarProveedor,
		statusData,
		proveedor,
	};
};
