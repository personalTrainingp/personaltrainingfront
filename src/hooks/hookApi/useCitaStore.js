import { PTApi } from '@/common';
import { onGetCitas } from '@/store/calendar/calendarSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useCitaStore = () => {
	const [DataCitaxCLIENTE, setDataCitaxCLIENTE] = useState([]);
	const dispatch = useDispatch();
	
	const obtenerCitasxSERVICIO = async (UID) => {
		try {
			const { data } = await PTApi.get(`/upload/get-upload/${UID}`);
			dispatch(onGetCitas(data));
			// setprogramaPT(data)
		} catch (error) {
			console.log(error);
		}
	};
	const onPostCita = async (formState, Date) => {
		try {
			const { data } = await PTApi.post(`/cita/post-cita`, {
				...formState,
				fecha_init: Date.start,
				fecha_final: Date.end,
				status_cita: 'CONFIRMADA',
			});
			console.log(data);
			// setprogramaPT(data)
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerCitasxCliente = async (id) => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/citadisponible/${id}`);
			console.log(data);
			setDataCitaxCLIENTE(data);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerCitasxSERVICIO,
		onPostCita,
		obtenerCitasxCliente,
		DataCitaxCLIENTE,
	};
};
