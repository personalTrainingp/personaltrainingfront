import { PTApi } from '@/common';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewTerm, onSetDataViewTerm2 } from '../store/terminologiaSlice';

export const useTerminologias = () => {
	const dispatch = useDispatch();
	const [dataTerm2, setdataTerm2] = useState({});
	const obtenerTerms2 = async (id_empresa, tipo) => {
		try {
			const { data } = await PTApi.get(`/terminologia/term2/${id_empresa}/${tipo}`);
			dispatch(onSetDataViewTerm2(data.terminologia2));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTerm2 = async (id) => {
		try {
			const { data } = await PTApi.get(`/terminologia/term2/id/${id}`);
			console.log({ t2: id });

			setdataTerm2(data.terminologia2);
		} catch (error) {
			console.log(error);
		}
	};
	const postTerm2 = async (id_empresa, tipo, formState) => {
		try {
			const { data } = await PTApi.post(
				`/terminologia/term2/${id_empresa}/${tipo}`,
				formState
			);
			await obtenerTerms2(id_empresa, tipo);
		} catch (error) {
			console.log(error);
		}
	};
	const updateTerm2xID = async (id, id_empresa, tipo, formState) => {
		try {
			const { data } = await PTApi.put(`/terminologia/term2/id/${id}`, formState);
			await obtenerTerms2(id_empresa, tipo);
		} catch (error) {
			console.log(error);
		}
	};
	const deleteTerm2xID = async (id, id_empresa, tipo) => {
		try {
			const { data } = await PTApi.put(`/terminologia/term2/delete/id/${id}`);
			await obtenerTerms2(id_empresa, tipo);
		} catch (error) {
			console.log(error);
		}
	};
	// TERM 1
	const obtenerTerm1 = async () => {
		try {
			const { data } = await PTApi.get(`/terminologia/term1`);
			dispatch(onSetDataViewTerm(data.terminologia));
		} catch (error) {
			console.log(error);
		}
	};
	const postTerm1 = async (formState) => {
		try {
			const { data } = await PTApi.post(`/terminologia/term1`, formState);
			await obtenerTerm1();
		} catch (error) {
			console.log(error);
		}
	};
	const updateTerm1xID = async (id) => {
		try {
			const { data } = await PTApi.put(`/terminologia/term1/id/${id}`, formState);
			await obtenerTerm1();
		} catch (error) {
			console.log(error);
		}
	};
	const deleteTerm1xID = async (id) => {
		try {
			const { data } = await PTApi.put(`/terminologia/term2/delete/id/${id}`);
			await obtenerTerm1();
		} catch (error) {
			console.log(error);
		}
	};
	return {
		dataTerm2,
		obtenerTerm2,
		postTerm2,
		updateTerm2xID,
		deleteTerm2xID,
		obtenerTerms2,
		postTerm1,
		updateTerm1xID,
		deleteTerm1xID,
		obtenerTerm1,
	};
};
