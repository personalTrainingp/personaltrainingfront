import { PTApi } from '@/common';
import { useState } from 'react';

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
		} catch (error) {
			console.log(error);
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
