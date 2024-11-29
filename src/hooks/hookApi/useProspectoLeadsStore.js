import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import { onSetProspectos } from '@/store/usuario/usuarioProspectoSlice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export const useProspectoLeadsStore = () => {
	const dispatch = useDispatch();
	const [prospectoLeadxID, setprospectoLeadxID] = useState(null);

	const obtenerProspectosLeads = async () => {
		try {
			dispatch(onSetDataView([]));
			console.log("data v sin valores");
			
			const { data } = await PTApi.get('/prospecto/lead/get-prospecto-lead');
			console.log(data);

			dispatch(onSetDataView(data.prospectosLeads));
		} catch (error) {
			console.log(error);
		}
	};
	const startRegisterProspectoLead = async (formState) => {
		try {
			console.log(formState);
			const { data } = await PTApi.post('/prospecto/lead/post-prospecto-lead', formState);
			obtenerProspectosLeads();
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerProspectoxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/prospecto/lead/get-prospecto-lead/${id}`);
			setprospectoLeadxID(data.prospectoLead);
		} catch (error) {
			console.log(error);
		}
	};
	const startUpdateProspectoLead = async (id, formState) => {
		try {
			console.log(id, formState);

			const { data } = await PTApi.put(`/prospecto/lead/put-prospecto-lead/${id}`, {
				...formState,
			});
			obtenerProspectosLeads();
		} catch (error) {
			console.log(error);
		}
	};
	const startDeleteProspectoLead = async (id) => {
		try {
			const { data } = await PTApi.put(`/prospecto/lead/delete-prospecto-lead/${id}`);
			obtenerProspectosLeads();
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerProspectosLeads,
		startRegisterProspectoLead,
		startUpdateProspectoLead,
		startDeleteProspectoLead,
		obtenerProspectoxID,
		prospectoLeadxID,
	};
};
