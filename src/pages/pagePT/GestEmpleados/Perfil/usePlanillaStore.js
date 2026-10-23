import { PTApi } from '@/common';
import { useState } from 'react';
import Swal from 'sweetalert2';

export const usePlanillaStore = () => {
	const [dataPlanillaxEmpl, setdataPlanillaxEmpl] = useState([]);
	const [dataPlanilla, setdataPlanilla] = useState([]);
	const [asistenciaxEmplxPlanilla, setasistenciaxEmplxPlanilla] = useState([]);
	const postPlanillaxEMPL = async (formState, uid_empl) => {
		console.log(formState);

		try {
			const { data } = await PTApi.post(`/recursosHumanos/post-planilla/${uid_empl}`, {
				formState,
				id_enterprice: 598,
			});
			obtenerPlanillaxEmpl(uid_empl);
			Swal.fire({
				icon: 'success',
				title: 'PLANILLA REGISTRADA CORRECTAMENTE',
				showConfirmButton: false,
				timer: 2000,
			});
			return true;
		} catch (error) {
			console.log(error);
			Swal.fire({ icon: 'error', title: 'PROBLEMA AL REGISTRAR LA PLANILLA', showConfirmButton: false, timer: 2500 });
			return false;
		}
	};
	const actualizarPlanillaxID = async (id, formState) => {
		try {
			await PTApi.put(`/recursosHumanos/put-planilla/${id}`, formState);
			Swal.fire({
				icon: 'success',
				title: 'PLANILLA ACTUALIZADA CORRECTAMENTE',
				showConfirmButton: false,
				timer: 2000,
			});
			return true;
		} catch (error) {
			console.log(error);
			Swal.fire({ icon: 'error', title: 'PROBLEMA AL ACTUALIZAR LA PLANILLA', showConfirmButton: false, timer: 2500 });
			return false;
		}
	};
	const eliminarPlanillaxID = async (id, uid_empl) => {
		try {
			await PTApi.put(`/recursosHumanos/delete-planilla/${id}`);
			obtenerPlanillaxEmpl(uid_empl);
			Swal.fire({
				icon: 'success',
				title: 'PLANILLA ELIMINADA CORRECTAMENTE',
				showConfirmButton: false,
				timer: 2000,
			});
			return true;
		} catch (error) {
			console.log(error);
			Swal.fire({ icon: 'error', title: 'PROBLEMA AL ELIMINAR LA PLANILLA', showConfirmButton: false, timer: 2500 });
			return false;
		}
	};
	// Horario del contrato (planilla): { fecha_desde, semanas } (1 semana, o 2 si es intersemana)
	const obtenerJornadaxPlanilla = async (id) => {
		try {
			const { data } = await PTApi.get(`/recursosHumanos/jornada-planilla/${id}`);
			return data;
		} catch (error) {
			console.log(error);
			return null;
		}
	};
	const actualizarJornadaxPlanilla = async (id, semanas) => {
		try {
			await PTApi.put(`/recursosHumanos/jornada-planilla/${id}`, { semanas });
			Swal.fire({
				icon: 'success',
				title: 'JORNADA ACTUALIZADA CORRECTAMENTE',
				showConfirmButton: false,
				timer: 2000,
			});
			return true;
		} catch (error) {
			console.log(error);
			Swal.fire({ icon: 'error', title: 'PROBLEMA AL ACTUALIZAR LA JORNADA', showConfirmButton: false, timer: 2500 });
			return false;
		}
	};
	const obtenerPlanillaxEmpl = async (uid_empl) => {
		try {
			const { data } = await PTApi.get(`/recursosHumanos/get-planillas/${uid_empl}`);
			console.log(data, 'planilla');

			setdataPlanillaxEmpl(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerPlanillaxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/recursosHumanos/obtener-planilla/${id}`);
			console.log(data);
			setdataPlanilla(data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerAsistenciasxEmpl = async (uid_empl, id_planillas) => {
		try {
			const { data } = await PTApi.get(
				`/recursosHumanos/obtener-asistencias/${uid_empl}/${id_planillas}`
			);
			// ordenarYTransformar(data);
			setasistenciaxEmplxPlanilla(ordenarYTransformar(data));
			// console.log(data, ordenarYTransformar(data));
		} catch (error) {
			console.log(error);
		}
	};
	return {
		postPlanillaxEMPL,
		actualizarPlanillaxID,
		eliminarPlanillaxID,
		obtenerJornadaxPlanilla,
		actualizarJornadaxPlanilla,
		obtenerAsistenciasxEmpl,
		obtenerPlanillaxID,
		obtenerPlanillaxEmpl,
		asistenciaxEmplxPlanilla,
		dataPlanilla,
		dataPlanillaxEmpl,
	};
};

const agruparPorFecha = (datos) => {
	return datos.reduce((resultado, item) => {
		const fecha = item.tiempo_marcacion_new.split('T')[0]; // Obtener solo la fecha
		if (!resultado[fecha]) {
			resultado[fecha] = { fecha, items: [] };
		}
		resultado[fecha].items.push(item);
		return resultado;
	}, {});
};

const ordenarYTransformar = (datos) => {
	const agrupados = agruparPorFecha(datos);
	return Object.values(agrupados).map((grupo) => {
		grupo.items.sort(
			(a, b) => new Date(a.tiempo_marcacion_new) - new Date(b.tiempo_marcacion_new)
		);
		return grupo;
	});
};
