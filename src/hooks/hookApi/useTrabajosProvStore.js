import { PTApi } from '@/common/api/';
import { onSetProveedores, onSetProveedoresCOMBO } from '@/store/dataProveedor/proveedorSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useTrabajosProvStore = () => {
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
	});
	const startRegisterProveedor = async (formState) => {
		try {
			setIsLoading(true);
			const { data } = await PTApi.post('/proveedor/post-proveedor', formState);
			setmessage({ msg: data.msg, ok: data.ok });
			setIsLoading(false);
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
			console.log(data);
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
			setIsLoading(true);
			const { data } = await PTApi.put(`/proveedor/update-proveedor/${id}`, formState);
			// console.log(id);
			// dispatch(getProveedores(data));
			setmessage({ msg: data.msg, ok: data.ok });
			setIsLoading(false);
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
		obtenerParametrosProveedor,
		isLoading,
		statusData,
		proveedor,
		message,
	};
};
