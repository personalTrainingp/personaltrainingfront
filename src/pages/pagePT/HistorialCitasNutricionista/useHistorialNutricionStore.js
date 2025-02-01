import { PTApi } from '@/common';
import { onGetCitas } from '@/store/calendar/calendarSlice';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

export const useHistorialNutricionStore = () => {
	const [DataCitaxCLIENTE, setDataCitaxCLIENTE] = useState([]);
	const { data } = useSelector((e) => e.calendar);
	const dispatch = useDispatch();
	const [dataCitaxID, setdataCitaxID] = useState({});
	const [dataCitaxCliente, setdataCitaxCliente] = useState([]);
	const [loading, setloading] = useState(true);
	const [loadingAction, setloadingAction] = useState(false);
	const [dataEmpl, setdataEmpl] = useState([]);
	const [dataCliente, setdataCliente] = useState([]);
	const obtenerCitasxSERVICIO = async (tipo_serv, formState) => {
		try {
			setloading(true);
			console.log(formState);

			const { data } = await PTApi.post(`/cita/get-citas-filter/${tipo_serv}`, {
				...formState,
			});
			console.log(data.citas, 'cicici');
			const dataAlter = data.citas.map((c) => {
				return {
					nombre_empleado: c.tb_empleado?.nombres_apellidos_empl,
					nombres_cliente: c.tb_cliente?.nombres_apellidos_cli,
					status_cita: c.status_cita,
					id_cli: c.id_cli,
					id_empl: c.id_empl,
					fecha_final: c.fecha_final,
					fecha_init: c.fecha_init,
				};
			});
			dispatch(onGetCitas(dataAlter));
			setloading(false);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerNutricionistasActivos = async () => {
		try {
			const { data: personalNutricion } = await PTApi.get(
				`/parametros/get_params/empleados/3`
			);
			setdataEmpl([...personalNutricion]);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametrosClientes = async () => {
		try {
			const { data } = await PTApi.get(`/parametros/get_params/clientes`);
			// console.log(data);
			// console.log(data);

			setdataCliente(data);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerCitasxSERVICIO,
		obtenerNutricionistasActivos,
		obtenerParametrosClientes,
		dataCliente,
		dataEmpl,
	};
};
