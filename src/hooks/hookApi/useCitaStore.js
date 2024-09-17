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
	const [loading, setloading] = useState(true);

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
		// formState,
		DateCell,
		id_cli,
		id_detallecita,
		tipo_cita,
		id_empl
		// email_cli,
		// nombres_apellidos_cli,
		// fec_servicio,
		// hora_servicio
	) => {
		try {

			const { data } = await PTApi.post(`/cita/post-cita`, {
				// ...formState,
				id_cli,
				id_detallecita,
				fecha_init: DateCell.start,
				fecha_final: DateCell.end,
				id_empl,
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
	const obtenerCitasxClientexServicio = async (id, tipo_serv) => {
		try {
			const { data } = await PTApi.get(
				`/parametros/get_params/cita-disponible/${id}/${tipo_serv}`
			);
			console.log(data.citasDisponibles);

			setDataCitaxCLIENTE(data.citasDisponibles);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerCitasxSERVICIO,
		onPostCita,
		obtenerCitasxClientexServicio,
		obtenerCitaxID,
		onPutCita,
		loading,
		dataCitaxID,
		DataCitaxCLIENTE,
		data,
	};
};
