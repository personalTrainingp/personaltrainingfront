import { PTApi } from '@/common';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewTerm2 } from './store/terminologiaSlice';

export const useTerminosStore = () => {
	const [dataTerm2, setdataTerm2] = useState({});
	const [isLoading, setisLoading] = useState(false);
	const dispatch = useDispatch();
	const obtenerTerms2xEmpresaxTipo = async (id_empresa, tipo) => {
		try {
			setisLoading(true);
			const { data } = await PTApi.get(`/terminologia/term2/${id_empresa}/${tipo}`);
			dispatch(onSetDataViewTerm2(data.terminologia2));
			setisLoading(false);
		} catch (error) {
			console.log(error);
			setisLoading(false);
		} finally {
			setisLoading(false);
		}
	};
	const obtenerTerms2xID = async (id) => {
		try {
			const { data } = await PTApi.get(`/terminologia/term2/id/${id}`);
			console.log({ data });

			setdataTerm2(data.terminologia2);
		} catch (error) {
			console.log(error);
		}
	};
	const postTerm2xEmpresaxTipo = async (id_empresa, tipo) => {
		try {
			await PTApi.post(`/terminologia/term2/${id_empresa}/${tipo}`);
			await obtenerTerms2xEmpresaxTipo(id_empresa, tipo);
		} catch (error) {
			console.log(error);
		}
	};
	const updateTerm2xID = async (id, formState, id_empresa, tipo) => {
		try {
			await PTApi.put(`/terminologia/term2/id/${id}`, formState);
			await obtenerTerms2xEmpresaxTipo(id_empresa, tipo);
		} catch (error) {
			console.log(error);
		}
	};
	const deleteTerm2xID = async (id, id_empresa, tipo) => {
		try {
			await PTApi.put(`/terminologia/term2/delete/id/${id}`);
			console.log({ id, id_empresa, tipo });

			await obtenerTerms2xEmpresaxTipo(id_empresa, tipo);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		isLoading,
		dataTerm2,
		updateTerm2xID,
		postTerm2xEmpresaxTipo,
		obtenerTerms2xEmpresaxTipo,
		deleteTerm2xID,
		obtenerTerms2xID,
	};
};
