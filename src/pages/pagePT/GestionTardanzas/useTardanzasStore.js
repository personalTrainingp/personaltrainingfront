import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useTardanzasStore = () => {
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
			console.log({data});
			
			const dataAlter = data.empleados.map((e) => {
				return {
					label: e.nombre_empl,
					value: e.id_empl,
					id_empresa: e.id_empresa,
				};
			});
			setdataEmpleados(dataAlter);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTardanzas = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(
				`/recursosHumanos/tiempos-especiales/${id_empresa}/tardanza`
			);
			const dataAlter = data.tiempoEspeciales.map((d) => {
				return {
					...d,
					nombre_colaborador: `${d._empl.nombre_empl} ${d._empl.apPaterno_empl} ${d._empl.apMaterno_empl}`,
					id_empresa: d._empl.id_empresa,
				};
			});
			dispatch(onSetDataView(dataAlter));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTardanzasxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/recursosHumanos/tiempos-especiales/id/${id}`);
		} catch (error) {
			console.log(error);
		}
	};
	const postTardanzas = async (formState, id_empresa) => {
		try {
			const { data } = await PTApi.post(
				'/recursosHumanos/tiempos-especiales/tardanza',
				formState
			);
			await obtenerTardanzas(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};
	const deleteTardanzasxID = async (id, id_empresa) => {
		try {
			const { data } = await PTApi.put(`/recursosHumanos/tiempos-especiales/delete/${id}`);
			await obtenerTardanzas(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};
	const updateTardanzasxID = async (id, id_empresa) => {
		try {
			const { data } = await PTApi.put(`/recursosHumanos/tiempos-especiales/${id}`);
			await obtenerTardanzas(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		updateTardanzasxID,
		deleteTardanzasxID,
		postTardanzas,
		obtenerTardanzas,
		obtenerTardanzasxID,
		obtenerEmpleadosActivos,
		dataEmpleados,
	};
};
