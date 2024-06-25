import { PTApi } from '@/common';
import { onSetServicios } from '@/store/Servicios/serviciosSlice';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useServiciosPTStore = () => {
	const dispatch = useDispatch();
	const onRegisterServiciosPT = async (formState) => {
		try {
			const { data } = await PTApi.post('/serviciospt/serviciocita/post', formState);
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	};
	const onDeleteServiciosPTxID = async (id) => {
		try {
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTodoServiciosPT = async (tipo_serv) => {
		try {
			const { data } = await PTApi.get(`/serviciospt/serviciocita/${tipo_serv}`);
			console.log(data.serviciosCITA);
			dispatch(onSetServicios(data.serviciosCITA));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerServiciosPTxID = () => {};
	const onActualizarServiciosPTxID = () => {};
	return {
		onRegisterServiciosPT,
		onDeleteServiciosPTxID,
		obtenerTodoServiciosPT,
		obtenerServiciosPTxID,
		onActualizarServiciosPTxID,
	};
};
