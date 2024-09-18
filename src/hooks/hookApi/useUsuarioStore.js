import { PTApi } from '@/common';
import {
	onFinishSuccessStatus,
	onLoadingClient,
	onSetClient,
	onSetClientes,
} from '@/store/usuario/usuarioClienteSlice';
import {
	onLoadingEmpl,
	onSetEmpl,
	onSetEmpleados,
	onSetUsuarios,
} from '@/store/usuario/usuarioEmpleadoSlice';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useComentarioStore } from './useComentarioStore';

export const useUsuarioStore = () => {
	const dispatch = useDispatch();
	const { user } = useSelector((e) => e.auth);
	const [dataClixID, setdataClixID] = useState({});
	const [loading, setloading] = useState(false);
	const [loadingData, setLoadingData] = useState(true);

	const { obtenerComentarioxLOCATION } = useComentarioStore();
	// console.log(user);
	const startRegisterUsuarioCliente = async (form, selectedFile) => {
		const { comentario_com } = form.comentarios;
		const { dataContactsEmerg } = form;
		try {
			// const { data: dataCo } = await PTApi.post('/servicios/observacion/post', {
			// 	comentario: comentario_com,
			// });
			setloading(true);
			const { data: dataCliente } = await PTApi.post('/usuario/post-cliente', {
				...form,
			});
			if (selectedFile !== null) {
				const formData = new FormData();
				formData.append('file', selectedFile);
				await PTApi.post(
					`/storage/blob/create/${dataCliente.cliente.uid_avatar}?container=avatarclientes`,
					formData
				);
			}
			if (comentario_com.trim().length > 0) {
				await PTApi.post('/servicios/comentario/post', {
					uidLocation: dataCliente.cliente.uid_comentario,
					uid_usuario: user.uid,
					comentario_com,
				});
			}
			if (dataContactsEmerg.length > 0) {
				await PTApi.post('/servicios/contacto-emergencia/post', {
					contactosDeEmergencia: form.dataContactsEmerg,
					uidLocation: dataCliente.cliente.uid_contactsEmergencia,
				});
			}
			setloading(false);
			await obtenerUsuariosClientes();
		} catch (error) {
			console.log(error);
		}
	};
	const startUpdateUsuarioCliente = async (formState, uid) => {
		try {
			const { data } = await PTApi.put(`/usuario/put-cliente/${uid}`, formState);
			await obtenerUsuariosClientes();
			await obtenerOneUsuarioCliente(uid);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerUsuariosClientes = async () => {
		try {
			const { data } = await PTApi.get('/usuario/get-clientes');
			dispatch(onSetClientes(data.clientes));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerOneUsuarioCliente = async (uid_cliente) => {
		try {
			setLoadingData(true);
			dispatch(onLoadingClient());
			const { data } = await PTApi.get(`/usuario/get-cliente/${uid_cliente}`);
			// dispatch(onSetData(data.clientes));
			const { data: dataImg } = await PTApi.get(
				`/upload/get-upload/${data.cliente?.uid_avatar}`
			);
			await obtenerComentarioxLOCATION(data.uid_comentario);
			dispatch(
				onSetClient({
					...data.cliente,
					urlImg: dataImg ? dataImg.name_image : null,
				})
			);
			setLoadingData(false);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerClientexID = async (id_cli) => {
		try {
			const { data } = await PTApi.get(`/usuario/get-cliente/id/${id_cli}`);
			console.log(data);
			setdataClixID(data.cliente);
		} catch (error) {
			console.log(error);
		}
	};
	const eliminarOneUsuarioCliente = async (uid_cliente) => {
		try {
			dispatch(onLoadingClient());
			const { data } = await PTApi.get(`/usuario/delete-cliente/${uid_cliente}`);
			obtenerUsuariosClientes();
			dispatch(onFinishSuccessStatus());
		} catch (error) {
			console.log(error);
		}
	};
	const startRegisterUsuarioEmpleado = async (form, formData) => {
		const { comentario_com } = form.comentarios;
		const { dataContactsEmerg } = form;

		try {
			// const { data: dataCo } = await PTApi.post('/servicios/observacion/post', {
			// 	comentario: comentario_com,
			// });
			const { data: dataCliente } = await PTApi.post('/usuario/post-empleado', {
				...form,
			});
			let formDataTieneDatos = false;

			for (let pair of formData.entries()) {
				if (pair[1]) {
					formDataTieneDatos = true;
					break;
				}
			}
			if (formDataTieneDatos) {
				await PTApi.post(`/upload/avatar/${dataCliente.empleado.uid_avatar}`, formData);
			}
			if (comentario_com.trim().length > 0) {
				await PTApi.post('/servicios/comentario/post', {
					uidLocation: dataCliente.empleado.uid_comentario,
					uid_usuario: user.uid,
					comentario_com,
				});
			}
			if (dataContactsEmerg.length > 0) {
				await PTApi.post('/servicios/contacto-emergencia/post', {
					contactosDeEmergencia: form.dataContactsEmerg,
					uidLocation: dataCliente.empleado.uid_contactsEmergencia,
				});
			}
			obtenerUsuariosEmpleados();
		} catch (error) {
			console.log(error);
		}
	};
	const startUpdateUsuarioEmpleado = async (formState, uid) => {
		try {
			const { data } = await PTApi.put(`/usuario/put-empleado/${uid}`, formState);
			obtenerUsuariosEmpleados();
			console.log('success', data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerUsuariosEmpleados = async () => {
		try {
			const { data } = await PTApi.get('/usuario/get-empleados');
			dispatch(onSetEmpleados(data.empleados));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerUsuarioEmpleado = async (UID) => {
		try {
			dispatch(onLoadingEmpl());
			const { data } = await PTApi.get(`/usuario/get-empleado/${UID}`);
			// const { data: dataImg } = await PTApi.get(
			// 	`/upload/get-upload/${data.empleado?.uid_avatar}`
			// );
			// data.empleados
			dispatch(
				onSetEmpl({
					...data.empleado,
					urlImg: null,
				})
			);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerUsuariosAuth = async () => {
		try {
			const { data } = await PTApi.get('/usuario/get-tb-usuarios');
			dispatch(onSetUsuarios(data.usuarios));
		} catch (error) {
			console.log(error);
		}
	};
	const startRegisterUsuarioAuth = async (formState) => {
		try {
			const { data } = await PTApi.post('/usuario/post-usuario', formState);
			obtenerUsuariosAuth();
		} catch (error) {
			console.log(error);
		}
	};
	return {
		//Cliente
		startRegisterUsuarioCliente,
		obtenerUsuariosClientes,
		obtenerOneUsuarioCliente,
		eliminarOneUsuarioCliente,
		startUpdateUsuarioCliente,
		obtenerClientexID,
		loadingData,
		dataClixID,
		//Empleado
		startRegisterUsuarioEmpleado,
		obtenerUsuariosEmpleados,
		obtenerUsuarioEmpleado,
		startUpdateUsuarioEmpleado,
		obtenerUsuariosAuth,
		startRegisterUsuarioAuth,
		//LOADING
		loading,
	};
};
