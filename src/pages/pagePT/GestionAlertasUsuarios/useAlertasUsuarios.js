import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useAlertasUsuarios = () => {
	const [dataUsuarios, setdataUsuarios] = useState([]);
	const dispatch = useDispatch();
	const obtenerUsuarios = async () => {
		try {
			const { data } = await PTApi.get('/usuario/get-tb-usuarios');
			const dataAlter = data.usuarios.map((usuario) => {
				return {
					label: usuario.usuario_user,
					value: usuario.id,
				};
			});
			setdataUsuarios(dataAlter);
		} catch (error) {
			console.log(error);
		}
	};
	const onDeleteAlertaUsuario = async (id) => {
		try {
			const { data } = await PTApi.put(`/alerta-usuario/delete-alerta/${id}`);
			await obtenerAlertasUsuarios();
		} catch (error) {
			console.log(error);
		}
	};
	const onPostAlertaUsuario = async (formState) => {
		try {
			const { data } = await PTApi.post('/alerta-usuario/alerta-usuario', formState);
			await obtenerAlertasUsuarios();
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerAlertasUsuarios = async () => {
		try {
			const { data } = await PTApi.get('/alerta-usuario/get-alertas');
			dispatch(onSetDataView(data.alertas));
		} catch (error) {
			console.log(error);
		}
	};
	return {
		dataUsuarios,
		obtenerUsuarios,
		onPostAlertaUsuario,
		onDeleteAlertaUsuario,
		obtenerAlertasUsuarios,
	};
};
