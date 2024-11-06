import { PTApi } from '@/common/api/';
import {
	onDataPerfil,
	onSetProveedores,
	onSetProveedoresCOMBO,
	onViewContratoxProv,
} from '@/store/dataProveedor/proveedorSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

export const useProveedorStore = () => {
	const dispatch = useDispatch();
	const [statusData, setstatus] = useState('');
	const [message, setmessage] = useState({ msg: '', ok: false });
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingContratoProv, setisLoadingContratoProv] = useState(false);
	const [gastosxContratoProv, setgastosxContratoProv] = useState([]);
	const [dataContrato, setdataContrato] = useState([]);
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
		parametro_oficio: { label_param: '' },
		parametro_marca: { label_param: '' },
		tb_images: [{ name_image: '' }],
		id_oficio: 0,
	});
	const startRegisterProveedor = async (formState, estado_prov, agente, selectedFile) => {
		try {
			setIsLoading(true);
			const { data } = await PTApi.post('/proveedor/post-proveedor', {
				...formState,
				id_empresa: 598,
			});
			if (selectedFile) {
				const formData = new FormData();
				formData.append('file', selectedFile);
				await PTApi.post(
					`/storage/blob/create/${data.uid_avatarProv}?container=avatar-proveedores`,
					formData
				);
			}
			setIsLoading(false);
			setmessage({ msg: data.msg, ok: data.ok });
			// obtenerParametrosProveedor();
			await obtenerProveedores(estado_prov, agente);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerProveedores = async (estado_prov, agente) => {
		try {
			const { data } = await PTApi.get('/proveedor/obtener-proveedores', {
				params: {
					estado_prov: estado_prov,
					es_agente: false,
					id_empresa: 598,
				},
			});
			dispatch(onSetProveedores(data.proveedores));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerAgentes = async () => {
		try {
			const { data } = await PTApi.get('/proveedor/obtener-agentes', {
				params: {
					es_agente: true,
					id_empresa: 598,
				},
			});
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
			dispatch(onDataPerfil(data.proveedor));
			setProveedor({ proveedor: data.proveedor });
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerProveedorxUID = async (uid) => {
		try {
			setIsLoading(false);
			const { data } = await PTApi.get(`/proveedor/obtener-proveedor-uid/${uid}`);
			console.log(data);

			dispatch(onDataPerfil(data.proveedor));
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
	const actualizarProveedor = async (formState, id, avatarFile, uid) => {
		try {
			setIsLoading(true);
			const { data } = await PTApi.put(`/proveedor/update-proveedor/${id}`, {
				...formState,
				avatarFile,
			});
			console.log(data.proveedor);

			if (avatarFile) {
				const formData = new FormData();
				formData.append('file', avatarFile);
				await PTApi.post(
					`/storage/blob/create/${data.proveedor.uid_perfil_image}?container=avatar-proveedores`,
					formData
				);
			}
			await obtenerProveedorxUID(uid);
			// console.log(id);
			// dispatch(getProveedores(data));
			setmessage({ msg: data.msg, ok: data.ok });
			setIsLoading(false);
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
	//CONTRATO
	const postContratoProv = async (formState, id_prov, formFile) => {
		try {
			setisLoadingContratoProv(true);
			const { data } = await PTApi.post('/proveedor/post-contrato-prov', {
				...formState,
				id_prov: id_prov,
			});
			if (formFile) {
				await PTApi.post(
					`/storage/blob/create/${data.uid_presupuesto}?container=presupuestos-proveedores`,
					formFile
				);
			}
			setisLoadingContratoProv(false);
			setmessage({ msg: data.msg, ok: data.ok });
			// obtenerProveedores();
			ObtenerContratosProvxID(id_prov);
		} catch (error) {
			console.log(error);
		}
	};
	const ObtenerContratosProvxID = async (id_prov) => {
		try {
			const { data } = await PTApi.get(`/proveedor/obtener-contratos/${id_prov}`);
			dispatch(onViewContratoxProv(data.contratosxProv));
		} catch (error) {
			console.log(error);
		}
	};
	const ObtenerContratoxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/proveedor/obtener-contrato/${id}`);
			setdataContrato(data.contratosProv);
		} catch (error) {
			console.log(error);
		}
	};
	const EliminarContratoProvxID = async (id_prov) => {};
	const obtenerEgresosPorCodigoProv = async (cod_contrato, tipo_moneda) => {
		try {
			const { data } = await PTApi.get(
				`/proveedor/obtener-gastos/${cod_contrato}/${tipo_moneda}`
			);
			setgastosxContratoProv(data.gastosxCodTrabajo);
		} catch (error) {
			console.log(error);
		}
	};
	const descargarContratoProvxID = async (id_prov) => {
		try {
			const response = await PTApi.get('/proveedor/obtener-contrato-prov/1', {
				responseType: 'blob', // Establecer el tipo de respuesta como blob (archivo binario)
			});
			// Crear un objeto URL para el archivo PDF
			const url = window.URL.createObjectURL(new Blob([response.data]));
			// Crear un enlace <a> temporal y simular un clic para descargar el archivo PDF
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'CONTRATO-PROVEEDOR.pdf');
			document.body.appendChild(link);
			link.click();

			// Liberar el objeto URL
			window.URL.revokeObjectURL(url);
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
		obtenerProveedorxUID,
		ObtenerContratoxID,
		obtenerAgentes,
		gastosxContratoProv,
		isLoadingContratoProv,
		isLoading,
		statusData,
		proveedor,
		message,
		postContratoProv,
		ObtenerContratosProvxID,
		EliminarContratoProvxID,
		obtenerEgresosPorCodigoProv,
		descargarContratoProvxID,
	};
};
