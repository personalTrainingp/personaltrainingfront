import { PTApi } from '@/common';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewComercial } from './dataComercialSlice';
import Swal from 'sweetalert2';

export const useGestionComercialStore = () => {
	const [dataEmpleados, setdataEmpleados] = useState([]);
	const [dataCanales, setdataCanales] = useState([]);
	const [dataMedioComunicacion, setdataMedioComunicacion] = useState([]);
	const [dataEstadoComercial, setdataEstadoComercial] = useState([]);
	const [dataDistritos, setdataDistritos] = useState([]);
	const [dataTareas, setdataTareas] = useState([]);
	const dispatch = useDispatch();
	const postGestionComercial = async (formState) => {
		try {
			const { data } = await PTApi.post('/prospecto/lead/', formState);
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
	const obtenerEstadosComerciales = async () => {
		try {
			const { data } = await PTApi.get('/terminologia/term1/comercial/estado');
			const dataMap = data.terminologia.map((t) => {
				return {
					label: t.label_param,
					value: t.id_param,
				};
			});
			setdataEstadoComercial(dataMap);
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
		obtenerTareasxProspecto,
		postTareaProspecto,
		dataTareas,
		obtenerDistritosxDepxProvincia,
		obtenerDistritosDeLima,
		obtenerEmpleadosVendedores,
		postGestionComercial,
		obtenerGestionComercial,
		obtenerCanales,
		obtenerMedioComunicacion,
		obtenerEstadosComerciales,
		dataDistritos,
		dataEstadoComercial,
		dataMedioComunicacion,
		dataEmpleados,
		dataCanales,
	};
};
