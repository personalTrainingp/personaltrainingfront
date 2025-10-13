import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useParientesStore = () => {
	const dispatch = useDispatch();
	const [dataPariente, setdataPariente] = useState({});
	const onPostParientes = async (formState, uid_location, entidad) => {
		try {
			const { data } = await PTApi.post('/usuario/pariente', formState, {
				params: {
					uid_location,
					entidad,
				},
			});
			await obtenerParientesxUidLocation(uid_location, entidad);
			// dispatch(onSetDataView(data))
		} catch (error) {
			console.log(error);
		}
	};
	const onUpdatePariente = async (formState, id, uid_location, entidad) => {
		try {
			const { data } = await PTApi.put(`/usuario/pariente/${id}`, formState);
			await obtenerParientesxUidLocation(uid_location, entidad);
			// dispatch(onSetDataView(data))
		} catch (error) {
			console.log(error);
		}
	};
	const onGetParientexId = async (id) => {
		try {
			const { data } = await PTApi.get(`/usuario/pariente/${id}`);

			// await obtenerParientesxUidLocation(uid_location, entidad);
			setdataPariente(data.contactoEmergencia);
			// dispatch(onSetDataView(data))
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParientesxUidLocation = async (uid_location, entidad) => {
		try {
			const { data } = await PTApi.get(`/usuario/pariente/${uid_location}/${entidad}`);
			dispatch(onSetDataView(data.contactosEmergencia));
		} catch (error) {
			console.log(error);
		}
	};
	const onDeleteParientexId = async (id, uid_location, entidad) => {
		try {
			const { data } = await PTApi.put(`/usuario/pariente/delete/${id}`);
			await obtenerParientesxUidLocation(uid_location, entidad);
			// dispatch(onSetDataView(data))
		} catch (error) {
			console.log(error);
		}
	};
	return {
		onPostParientes,
		obtenerParientesxUidLocation,
		onUpdatePariente,
		onGetParientexId,
		onDeleteParientexId,
		dataPariente,
	};
};
