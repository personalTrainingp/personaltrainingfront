import { PTApi } from '@/common';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataView } from './store/colaboradoresSlice';

export const useEmpleadosStore = () => {
	const [dataParientes, setdataParientes] = useState([]);
	const [dataDocumentosInternosEmpl, setdataDocumentosInternosEmpl] = useState([]);
	const dispatch = useDispatch();
	const obtenerParientesEmpleados = async () => {
		try {
			const { data } = await PTApi.get('/usuario/pariente/entidad/EMPLEADO');

			setdataParientes(data.contactosEmergencia);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerDocumentosDeEmpleados = async () => {
		try {
			const { data } = await PTApi.get('/fils/interno/tb/1517');

			setdataDocumentosInternosEmpl(data.documentosInternos);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerEmpleadosxidempresaxEstado = async (id_empresa, id_estado) => {
		try {
			const { data } = await PTApi.get(
				`/empleado/id_estado/${id_estado}/id_empresa/${id_empresa}`
			);
			console.log({ d: data.empleados });

			dispatch(onSetDataView(data.empleados));
		} catch (error) {
			console.log(error);
		}
	};
	const postEmpleado = async (formState, formDataAvatar, id_empresa, id_estado) => {
		try {
			const { data } = await PTApi.post('/empleado/', formState);
			if (formDataAvatar) {
				const formData = new FormData();
				formData.append('file', formDataAvatar);
				await PTApi.post(
					`/storage/blob/create/${data.uid_image}?container=avatar-empleado`,
					formData
				);
			}
			obtenerEmpleadosxidempresaxEstado(id_empresa, id_estado);
		} catch (error) {
			console.log(error);
		}
	};
	const updateEmpleadoxID = async (id, formState, id_empresa, id_estado) => {
		try {
			const { data } = await PTApi.put(`/empleado/id/${id}`, formState);
			obtenerEmpleadosxidempresaxEstado(id_empresa, id_estado);
		} catch (error) {
			console.log(error);
		}
	};
	const deleteEmpleadoxID = async (id, id_empresa, id_estado) => {
		try {
			const { data } = await PTApi.put(`/empleado/delete/id/${id}`);
			obtenerEmpleadosxidempresaxEstado(id_empresa, id_estado);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerEmpleadosxidempresaxEstado,
		deleteEmpleadoxID,
		updateEmpleadoxID,
		obtenerParientesEmpleados,
		obtenerDocumentosDeEmpleados,
		postEmpleado,
		dataDocumentosInternosEmpl,
		dataParientes,
	};
};
