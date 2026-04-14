import { PTApi } from '@/common';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewOperadoresPago } from './dataOperadoresPagoSlice';

export const useGestionOperadoresPagoStore = () => {
	const dispatch = useDispatch();
	const [dataOperadorxID, setdataOperadorxID] = useState({});
	const postGestionOperadoresPago = async (formState) => {
		try {
			const { data } = await PTApi.post('/operadores-pago/', formState);
			obtenerGestionOperadoresPago();
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerGestionOperadorPagoxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/operadores-pago/id/${id}`);
			setdataOperadorxID(data.operadoresPago);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerGestionOperadoresPago = async () => {
		try {
			const { data } = await PTApi.get('/operadores-pago/');
			dispatch(onSetDataViewOperadoresPago(data.operadoresPago));
		} catch (error) {
			console.log(error);
		}
	};
	const updateGestionOperadoresPago = async (id, formState) => {
		try {
			const { data } = await PTApi.put(`/operadores-pago/${id}`, formState);
			obtenerGestionOperadoresPago();
		} catch (error) {
			console.log(error);
		}
	};
	const deleteGestionOperadoresPago = async (id) => {
		try {
			const { data } = await PTApi.put(`/operadores-pago/delete/${id}`);
			obtenerGestionOperadoresPago();
		} catch (error) {
			console.log(error);
		}
	};

	return {
		obtenerGestionOperadorPagoxID,
		deleteGestionOperadoresPago,
		postGestionOperadoresPago,
		obtenerGestionOperadoresPago,
		updateGestionOperadoresPago,
		dataOperadorxID,
	};
};
