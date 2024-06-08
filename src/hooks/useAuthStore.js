//Tiene como objetivo realizar cualquier interaccion con la parte del auth en el store

import { useDispatch, useSelector } from 'react-redux';
import { PTApi } from '@/common/api/';
import { clearErrorMessage, onChecking, onLogin, onLogout } from '../store';
import { RESET_STATE_VENTA } from '@/store/uiNuevaVenta/uiNuevaVenta';
import { useEffect, useState } from 'react';
import { useRoleStore } from './hookApi/useRoleStore';

export const useAuthStore = () => {
	const { status, user, errorMessage } = useSelector((state) => state.auth);
	const [usuarioObtenido, setusuarioObtenido] = useState({});
	const dispatch = useDispatch();
	const { obtenerModulos, obtenerSeccions } = useRoleStore();
	const { modulos } = useSelector((e) => e.rutas);

	const startLogin = async ({ usuario_user, password_user }) => {
		dispatch(onChecking());

		try {
			const { data } = await PTApi.post('/usuario/login', {
				usuario_user,
				password_user,
			});
			localStorage.setItem('token', data?.token);
			localStorage.setItem('token-init-date', new Date().getTime());
			await obtenerModulos();
			console.log(modulos);
			await obtenerSeccions(modulos[0]);
			dispatch(
				onLogin({
					name: data.name,
					uid: data.uid,
					role: data.rol_user,
				})
			);
		} catch (error) {
			console.log(error);
			dispatch(onLogout('Credenciales incorrectas'));
			//Muestra el mensaje de error y despues lo quita
			setTimeout(() => {
				dispatch(clearErrorMessage());
			}, 10);
		}
	};

	const startLogout = () => {
		localStorage.clear();
		dispatch(RESET_STATE_VENTA());

		dispatch(onLogout());
	};

	// const startRegister = async ({ name, email, password }) => {
	// 	console.log({ email, password });
	// 	dispatch(onChecking());

	// 	try {
	// 		const { data } = await calendarApi.post('/auth/register', { name, email, password });

	// 		localStorage.setItem('token', data.token);
	// 		localStorage.setItem('token-init-date', new Date().getTime());
	// 		dispatch(onLogin({ name: data.name, uid: data.uid }));
	// 	} catch (error) {
	// 		console.log(error.response.data, 'errores');
	// 		dispatch(
	// 			onLogout(
	// 				error.response.data.errors
	// 					? Object.values(error.response.data.errors)[0].msg
	// 					: error.response.data.msg || '--'
	// 			)
	// 		);

	// 		//Muestra el mensaje de error y despues lo quita
	// 		setTimeout(() => {
	// 			dispatch(clearErrorMessage());
	// 		}, 10);
	// 	}
	// };

	// const checkAuthToken = async () => {
	// 	const token = localStorage.getItem('token');
	// 	if (!token) return dispatch(onLogout());
	// 	try {
	// 		const { data } = await calendarApi.get('/auth/renew');
	// 		console.log(data);
	// 		localStorage.setItem('token', data.token);
	// 		localStorage.setItem('token-init-date', new Date().getTime());
	// 		dispatch(onLogin({ name: data.name, uid: data.uid }));
	// 	} catch (error) {
	// 		localStorage.clear();
	// 		dispatch(onLogout());
	// 	}
	// };
	// const startLogout = () => {
	// 	localStorage.clear();
	// 	dispatch(onLogoutCalendar());
	// 	dispatch(onLogout());
	// };

	const checkAuthToken = async () => {
		const token = localStorage.getItem('token');
		if (!token) return dispatch(onLogout());
		try {
			const { data } = await PTApi.get('/usuario/renew');
			localStorage.setItem('token', data.token);
			localStorage.setItem('token-init-date', new Date().getTime());
			dispatch(onLogin({ name: data.name, uid: data.uid }));
		} catch (error) {
			localStorage.clear();
			dispatch(onLogout());
		}
	};
	const obtenerUser = async (uid) => {
		try {
			const { data } = await PTApi.get(`/usuario/get-usuario/${uid}`);
			setusuarioObtenido(data.usuario);
		} catch (error) {
			localStorage.clear();
			dispatch(onLogout());
		}
	};
	return {
		//*Property
		errorMessage,
		status,
		user,
		usuarioObtenido,

		//*Method

		checkAuthToken,
		startLogin,
		startLogout,
		obtenerUser,
		// startRegister,
		// startLogout,
	};
};
