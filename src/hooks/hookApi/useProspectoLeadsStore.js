import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import { onSetProspectos } from '@/store/usuario/usuarioProspectoSlice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export const useProspectoLeadsStore = () => {
	const dispatch = useDispatch();
	const [prospectoxID, setprospecto] = useState({});

	const obtenerProspectosLeads = async () => {
		try {
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
			const { data } = await PTApi.get(`/prospecto/get-prospecto/${id}`);
			setprospecto(data.prospecto);
		} catch (error) {
			console.log(error);
		}
	};
	const startUpdateProspecto = async (id) => {
		try {
			const {} = await PTApi.put('/prospecto/lead/put-prospecto-lead/');
		} catch (error) {
			console.log(error);
		}
	};
	const startDeleteProspecto = (id) => {};
	return {
		obtenerProspectosLeads,
		startRegisterProspectoLead,
		startUpdateProspecto,
		startDeleteProspecto,
		obtenerProspectoxID,
		prospectoxID,
	};
};