import { PTApi } from '@/common';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewComercial } from './dataComercialSlice';
import Swal from 'sweetalert2';
import { arrayEstadoComercial } from '@/types/type';
import dayjs from 'dayjs';

export const useGestionComercialStore = () => {
	const [dataEmpleados, setdataEmpleados] = useState([]);
	const [dataCanales, setdataCanales] = useState([]);
	const [dataMedioComunicacion, setdataMedioComunicacion] = useState([]);
	const [dataEstadoComercial, setdataEstadoComercial] = useState([]);
	const [dataNivelInteres, setdataNivelInteres] = useState([]);
	const [dataDistritos, setdataDistritos] = useState([]);
	const [dataTareas, setdataTareas] = useState([]);
	const [dataClientes, setdataClientes] = useState([]);
	const [dataMembresiasCliente, setdataMembresiasCliente] = useState([]);
	const [dataTareasReporte, setdataTareasReporte] = useState([]);
	const [isLoadingTareasReporte, setisLoadingTareasReporte] = useState(false);
	const [isLoadingMembresias, setisLoadingMembresias] = useState(false);
	const [prospectosHastaAyer, setprospectosHastaAyer] = useState(null);
	const [dataProspectosMes, setdataProspectosMes] = useState([]);
	const dispatch = useDispatch();
	// Prospectos por redes (tb_leadsDia): total de ayer y el detalle del mes actual
	const obtenerProspectosHastaAyer = async () => {
		try {
			const { data } = await PTApi.get('/prospectos-redes');
			const ayer = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
			const mesActual = dayjs().format('YYYY-MM');
			// fecha llega como 2026-10-14T00:00:00.000Z: se compara solo el dia
			const prospectos = data.prospectosRedes.map((p) => ({
				...p,
				fecha: String(p.fecha).slice(0, 10),
				cantidad: Number(p.cantidad ?? 0),
				monto: Number(p.monto ?? 0),
			}));
			const total = prospectos.reduce((acc, p) => (p.fecha === ayer ? acc + p.cantidad : acc), 0);
			setprospectosHastaAyer(total);
			setdataProspectosMes(
				prospectos
					.filter((p) => p.fecha.startsWith(mesActual))
					.sort((a, b) => a.fecha.localeCompare(b.fecha))
			);
		} catch (error) {
			console.log(error);
		}
	};
	const postGestionComercial = async (formState) => {
		try {
			const { data } = await PTApi.post('/prospecto/lead/', formState);
			obtenerGestionComercial();
		} catch (error) {
			console.log(error);
		}
	};
	const putGestionComercial = async (id, formState) => {
		try {
			const { data } = await PTApi.put(`/prospecto/lead/id/${id}`, formState);
			obtenerGestionComercial();
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerGestionComercial = async () => {
		try {
			const { data } = await PTApi.get('/prospecto/lead/');
			dispatch(onSetDataViewComercial(data.prospectosLeads));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerEmpleadosVendedores = async () => {
		try {
			const { data } = await PTApi.get(`/empleado/departamento/2/id_empresa/598`);
			const dataMap = data.empleados.map((f) => {
				return {
					label: f.nombre_empl,
					value: f.id_empl,
				};
			});
			console.log({ data: dataMap });

			setdataEmpleados(dataMap);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerCanales = async () => {
		try {
			const { data } = await PTApi.get('/terminologia/term1/comercial/canal');
			const dataMap = data.terminologia.map((t) => {
				return {
					label: t.label_param,
					value: t.id_param,
				};
			});
			setdataCanales(dataMap);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerMedioComunicacion = async () => {
		try {
			const { data } = await PTApi.get('/terminologia/term1/comercial/medio-comunicacion');
			const dataMap = data.terminologia.map((t) => {
				return {
					label: t.label_param,
					value: t.id_param,
				};
			});
			setdataMedioComunicacion(dataMap);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerClientes = async () => {
		try {
			const { data } = await PTApi.get('/parametros/get_params/clientes/598');
			setdataClientes([{ label: 'SIN HISTORIAL', value: 0 }, ...data]);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerEstadosComerciales = async () => {
		try {
			const { data } = await PTApi.get('/terminologia/term1/comercial/estado');
			const dataMap = data.terminologia.map((t) => {
				return {
					label: t.label_param,
					value: t.id_param,
				};
			});
			setdataEstadoComercial(ordenarEstadosComerciales(dataMap));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerNivelesInteres = async () => {
		try {
			const { data } = await PTApi.get('/terminologia/term1/comercial/nivel-interes');
			const dataMap = data.terminologia.map((t) => {
				return {
					label: t.label_param,
					value: t.id_param,
				};
			});
			setdataNivelInteres(dataMap);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerDistritosDeLima = async () => {
		try {
			const { data: dataLima } = await PTApi.get(`/parametros/get_params/distritos/15/1501`);
			const { data: dataCallao } = await PTApi.get(`/parametros/get_params/distritos/7/701`);

			const dataDistritoMAP = [...dataLima, ...dataCallao];
			setdataDistritos(dataDistritoMAP);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerDistritosxDepxProvincia = async (id_provincia, id_departamento) => {
		try {
			const { data } = await PTApi.get(
				`/parametros/get_params/distritos/${id_departamento}/${id_provincia}`
			);
			setdataDistritos(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTareasReporte = async () => {
		try {
			setisLoadingTareasReporte(true);
			const { data } = await PTApi.get('/prospecto/lead/tareas/reporte');
			setdataTareasReporte(data.tareas);
		} catch (error) {
			console.log(error);
		} finally {
			setisLoadingTareasReporte(false);
		}
	};
	const obtenerMembresiasxCliente = async (id_cli) => {
		try {
			setisLoadingMembresias(true);
			setdataMembresiasCliente([]);
			const { data } = await PTApi.get(`/prospecto/lead/cliente/${id_cli}/membresias`);
			setdataMembresiasCliente(data.membresias);
		} catch (error) {
			console.log(error);
		} finally {
			setisLoadingMembresias(false);
		}
	};
	const obtenerTareasxProspecto = async (id_prospecto) => {
		try {
			setdataTareas([]);
			const { data } = await PTApi.get(`/prospecto/lead/tarea/${id_prospecto}`);
			setdataTareas(data.tareas);
		} catch (error) {
			console.log(error);
		}
	};
	const postTareaProspecto = async (formState) => {
		try {
			await PTApi.post('/prospecto/lead/tarea', formState);
			await obtenerTareasxProspecto(formState.id_prospecto);
			return true;
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'PROBLEMA AL REGISTRAR LA TAREA',
				showConfirmButton: false,
				timer: 1500,
			});
			return false;
		}
	};
	return {
		obtenerProspectosHastaAyer,
		prospectosHastaAyer,
		dataProspectosMes,
		obtenerTareasxProspecto,
		obtenerMembresiasxCliente,
		obtenerTareasReporte,
		dataTareasReporte,
		isLoadingTareasReporte,
		dataMembresiasCliente,
		isLoadingMembresias,
		postTareaProspecto,
		dataTareas,
		obtenerDistritosxDepxProvincia,
		obtenerDistritosDeLima,
		obtenerEmpleadosVendedores,
		postGestionComercial,
		putGestionComercial,
		obtenerGestionComercial,
		obtenerCanales,
		obtenerMedioComunicacion,
		obtenerEstadosComerciales,
		dataDistritos,
		dataEstadoComercial,
		obtenerNivelesInteres,
		dataNivelInteres,
		obtenerClientes,
		dataClientes,
		dataMedioComunicacion,
		dataEmpleados,
		dataCanales,
	};
};

// Ordena segun arrayEstadoComercial; los estados no listados van al final
export const ordenarEstadosComerciales = (estados) => {
	const orden = (value) => {
		const i = arrayEstadoComercial.findIndex((e) => e.value === value);
		return i === -1 ? arrayEstadoComercial.length : i;
	};
	return [...estados].sort((a, b) => orden(a.value) - orden(b.value));
};
