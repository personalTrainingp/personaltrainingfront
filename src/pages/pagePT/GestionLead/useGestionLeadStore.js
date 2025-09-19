import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import React, { useState } from 'react';
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
			const { data } = await PTApi.get(`/lead/leads/${id_empresa}`);

			dispatch(onSetDataView(data.leads));
		} catch (error) {
			console.log(error);
		}
	};
	const updateLead = async (id, formState, id_empresa) => {
		try {
			const { data } = await PTApi.put(`/lead/${id}`, formState);
			await obtenerLeads(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};
	const deleteLead = async (id, id_empresa) => {
		try {
			const { data } = await PTApi.put(`/lead/delete/${id}`);
			await obtenerLeads(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerLeads,
		postLead,
		updateLead,
		deleteLead,
	};
};
