import { PTApi } from '@/common';
import { getSocket } from '@/common/socket';
import { onGetCitas } from '@/store/calendar/calendarSlice';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

export const useCitaStore = () => {
	const [DataCitaxCLIENTE, setDataCitaxCLIENTE] = useState([]);
	const { data } = useSelector((e) => e.calendar);
	const dispatch = useDispatch();
	const [dataCitaxID, setdataCitaxID] = useState({});
	const [dataCitaxCliente, setdataCitaxCliente] = useState([]);
	const [loading, setloading] = useState(true);
	const [loadingAction, setloadingAction] = useState(false);

	// Header para que el backend sepa qué socket hizo el cambio y no se lo reenvíe como "remoto"
	const headersSocket = () => ({ headers: { 'x-socket-id': getSocket().id || '' } });

	// silencioso: recarga sin poner loading (evita que el calendario parpadee con cambios de otros usuarios)
	const obtenerCitasxSERVICIO = async (tipo_serv, { silencioso = false } = {}) => {
		try {
			if (!silencioso) setloading(true);
			const { data } = await PTApi.get(`/cita/get-citas/${tipo_serv}`);
			dispatch(onGetCitas(data.citas));
			setloading(false);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerCitasNutricionalesxCliente = async (id_cli, fecha_param) => {
		try {
			setloading(true);
			const { data } = await PTApi.get(
				`/parametros/get_params/citas-nutricionales/${id_cli}`,
				{
					params: {
						fecha_param,
					},
				}
			);

			const citasDisponibles = data.citasDisponibles.map((c) => {
				return {
					value: c.id,
					label: c.label_membresia || c.label_venta_cita,
				};
			});
			setdataCitaxCliente(citasDisponibles);
			// dispatch(onGetCitas(data.citasDisponibles));
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
		id_cita_adquirida,
		tipo_cita,
		id_empl
		// email_cli,
		// nombres_apellidos_cli,
		// fec_servicio,
		// hora_servicio
	) => {
		try {
			setloadingAction(true);
			const { data } = await PTApi.post(`/cita/post-cita`, {
				// ...formState,
				id_cli,
				id_cita_adquirida,
				fecha_init: DateCell.start,
				fecha_final: DateCell.end,
				id_empl,
				status_cita: 500,
			}, headersSocket());
			obtenerCitasxSERVICIO(tipo_cita);
			setloadingAction(true);
			// setprogramaPT(data)
		} catch (error) {
			console.log(error);
		}
	};
	const onPutCita = async (formState, tipo_cita) => {
		const { id } = formState;
		try {
			setloadingAction(true);
			const { data } = await PTApi.put(`/cita/put-cita/${id}`, {
				...formState,
			}, headersSocket());
			obtenerCitasxSERVICIO(tipo_cita);
			setloadingAction(false);
		} catch (error) {
			console.log(error);
		}
	};
	const onDeleteCitaxId = async (id) => {
		try {
			setloadingAction(true);
			const { data } = await PTApi.put(`/cita/delete-cita/${id}`, {}, headersSocket());
			obtenerCitasxSERVICIO('NUTRI');
			setloadingAction(false);
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
		onDeleteCitaxId,
		obtenerCitasNutricionalesxCliente,
		loadingAction,
		dataCitaxCliente,
		loading,
		dataCitaxID,
		DataCitaxCLIENTE,
		data,
	};
};
