import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useGestionLeadStore = () => {
	const dispatch = useDispatch();
	const postLead = async (id_empresa, formState) => {
		try {
			const { data } = await PTApi.post(`/lead/${id_empresa}`, formState);
			await obtenerLeads(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerLeads = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(`/lead/${id_empresa}`);
			dispatch(onSetDataView(data.leads));
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerLeads,
		postLead,
	};
};
