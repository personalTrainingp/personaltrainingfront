import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useAsistenciaStore = () => {
	const dispatch = useDispatch();
	const [dataAsistenciaManual, setdataAsistenciaManual] = useState({});
	const obtenerAsistenciasManualxFecha = async (fecha) => {
		try {
			const { data } = await PTApi.get('/recursosHumanos/asistencia-manual/598', {
				params: {
					fecha,
				},
			});
			dispatch(onSetDataView(data.asistenciaManual));
		} catch (error) {
			console.log(error);
		}
	};
	const postAsistenciaManual = async (formState, idEmpresa) => {
		try {
			const { data } = await PTApi.post(
				`/recursosHumanos/asistencia-manual/${idEmpresa}`,
				formState
			);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerAsistenciaManualxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/recursosHumanos/asistencia-manual/${id}`);
			setdataAsistenciaManual(data.asistenciaManual);
		} catch (error) {
			console.log(error);
		}
	};
	const updateAsistenciaManualxID = async (id) => {
		try {
			const { data } = await PTApi.put(`/recursosHumanos/asistencia-manual/${id}`);
			setdataAsistenciaManual(data.asistenciaManual);
		} catch (error) {
			console.log(error);
		}
	};
	const deleteAsistenciaManualxID = async (id, fecha) => {
		try {
			const { data } = await PTApi.put(`/recursosHumanos/delete/asistencia-manual/${id}`);
			obtenerAsistenciasManualxFecha(fecha);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerAsistenciasManualxFecha,
		postAsistenciaManual,
		obtenerAsistenciaManualxID,
		updateAsistenciaManualxID,
		deleteAsistenciaManualxID,
		dataAsistenciaManual,
	};
};
