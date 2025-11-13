import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useFeriadosStore = () => {
	const dispatch = useDispatch();
	const [dataEmpleados, setdataEmpleados] = useState([]);
	const obtenerEmpleadosActivos = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(`/usuario/get-empleados`, {
				params: {
					id_empresa: id_empresa,
					id_estado: true,
				},
			});
			const dataAlter = data.empleados.map((e) => {
				return {
					label: e.nombre_empl,
					value: e.id_empl,
				};
			});
			setdataEmpleados(dataAlter);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerFeriados = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(
				`/recursosHumanos/tiempos-especiales/${id_empresa}/feriado`
			);

			const dataAlter = data.tiempoEspeciales.map((d) => {
				return {
					...d,
					id_empresa: d.id_empresa,
				};
			});
			console.log({ data, dataAlter });
			dispatch(onSetDataView(dataAlter));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerFeriadosxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/recursosHumanos/tiempos-especiales/id/${id}`);
		} catch (error) {
			console.log(error);
		}
	};
	const postFeriados = async (formState, id_empresa) => {
		try {
			const { data } = await PTApi.post(
				`/recursosHumanos/tiempos-especiales/${id_empresa}/feriado`,
				formState
			);
			await obtenerFeriados(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};
	const deleteFeriadosxID = async (id, id_empresa) => {
		try {
			const { data } = await PTApi.put(`/recursosHumanos/tiempos-especiales/delete/${id}`);
			await obtenerFeriados(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};
	const updateFeriadosxID = async (id, id_empresa) => {
		try {
			const { data } = await PTApi.put(`/recursosHumanos/tiempos-especiales/${id}`);
			await obtenerFeriados(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		updateFeriadosxID,
		deleteFeriadosxID,
		postFeriados,
		obtenerFeriados,
		obtenerFeriadosxID,
		obtenerEmpleadosActivos,
		dataEmpleados,
	};
};
