import { PTApi } from '@/common';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewTc } from '../store/tcSlice';

export const useTc = () => {
	const dispatch = useDispatch();
	const [dataTC, setdataTC] = useState({});
	const obtenerTC = async () => {
		try {
			const { data } = await PTApi.get('/tipocambio/');
			dispatch(onSetDataViewTc(data.tipoCambios));
		} catch (error) {
			console.log(error);
		}
	};
	const postTC = async (formState) => {
		try {
			const { data } = await PTApi.post('/tipocambio/', formState);
			obtenerTC();
		} catch (error) {
			console.log(error);
		}
	};
	const updateTCxID = async (formState, id) => {
		try {
			const data = await PTApi.put(`/tipocambio/${id}`, formState);
			await obtenerTC();
		} catch (error) {
			console.log(error);
		}
	};
	const deleteTCxID = async (id) => {
		try {
			const data = await PTApi.put(`/tipocambio/delete/${id}`);
			console.log({ data });
			await obtenerTC();
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTCxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/tipocambio/id/${id}`);
			setdataTC(data.tc);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerTC,
		postTC,
		deleteTCxID,
		updateTCxID,
		obtenerTCxID,
		dataTC,
	};
};
