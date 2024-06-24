import { PTApi } from '@/common';
import { onGetCitas } from '@/store/calendar/calendarSlice';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

export const useCitaStore = () => {
	const [DataCitaxCLIENTE, setDataCitaxCLIENTE] = useState([]);
	const { data } = useSelector((e) => e.calendar);
	const dispatch = useDispatch();
	const [dataCitaxID, setdataCitaxID] = useState({});
	const [loading, setloading] = useState(false);

	const obtenerCitasxSERVICIO = async (tipo_serv) => {
		try {
			setloading(true);
			const { data } = await PTApi.get(`/cita/get-citas/${tipo_serv}`);
			dispatch(onGetCitas(data.citas));
			setloading(false);
			// setprogramaPT(data)
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerCitaxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/cita/get-cita/${id}`);
			setdataCitaxID(data.cita);
		} catch (error) {
			console.log(error);
		}
	};
	const onPostCita = async (
		formState,
		DateCell,
		tipo_cita,
		email_cli,
		nombres_apellidos_cli,
		fec_servicio,
		hora_servicio
	) => {
		try {
			const { data } = await PTApi.post(`/cita/post-cita`, {
				...formState,
				tipo_serv: tipo_cita !== 'FITOL' ? 'FITOLOGY' : 'NUTRICION',
				email_cli,
				nombres_apellidos_cli,
				fec_servicio,
				hora_servicio,
				fecha_init: DateCell.start,
				fecha_final: DateCell.end,
				status_cita: 500,
			});
			obtenerCitasxSERVICIO(tipo_cita);
			// setprogramaPT(data)
		} catch (error) {
			console.log(error);
		}
	};
	const onPutCita = async (formState, tipo_cita) => {
		console.log(formState);
		const { id } = formState;
		try {
			const { data } = await PTApi.put(`/cita/put-cita/${id}`, {
				...formState,
			});
			obtenerCitasxSERVICIO(tipo_cita);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerCitasxCliente = async (id) => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/citadisponible/${id}`);
			setDataCitaxCLIENTE(data);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerCitasxSERVICIO,
		onPostCita,
		obtenerCitasxCliente,
		obtenerCitaxID,
		onPutCita,
		loading,
		dataCitaxID,
		DataCitaxCLIENTE,
		data,
	};
};
