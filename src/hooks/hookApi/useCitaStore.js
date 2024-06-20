import { PTApi } from '@/common';
import { onGetCitas } from '@/store/calendar/calendarSlice';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

export const useCitaStore = () => {
	const [DataCitaxCLIENTE, setDataCitaxCLIENTE] = useState([]);
	const { data } = useSelector((e) => e.calendar);
	const dispatch = useDispatch();

	const obtenerCitasxSERVICIO = async () => {
		try {
			const { data } = await PTApi.get(`/cita/get-citas`);
			dispatch(onGetCitas(data.citas));
			// setprogramaPT(data)
		} catch (error) {
			console.log(error);
		}
	};
	const onPostCita = async (formState, DateCell) => {
		try {
			const { data } = await PTApi.post(`/cita/post-cita`, {
				...formState,
				fecha_init: DateCell.start,
				fecha_final: DateCell.end,
				status_cita: 'CONFIRMADA',
			});
			obtenerCitasxSERVICIO();
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
		data,
	};
};
