import { PTApi } from '@/common';
import { useState } from 'react';
function agregarDiasHabiles(fecha, dias) {
	let fechaB = new Date(fecha);
	let diasAgregados = 0;

	while (diasAgregados < dias) {
		fechaB.setDate(fechaB.getDate() + 1);
		let diaSemana = fechaB.getDay();
		if (diaSemana !== 0 && diaSemana !== 6) {
			// Evita sábado (6) y domingo (0)
			diasAgregados++;
		}
	}

	return fechaB;
}
export const useSeguimientoStore = () => {
	const [dataSeguimientos, setdataSeguimientos] = useState([]);
	const obtenerTodoSeguimiento = async (id_empresa, isClienteActive) => {
		try {
			const { data } = await PTApi.get(
				`/reporte/reporte-seguimiento-membresia/${id_empresa}`,
				{
					params: { isClienteActive },
				}
			);
			const dataMem = data.newMembresias.map((m) => {
				const diasExtendibles = m.dias;
				return {
					fecha_fin: m.fec_fin_mem,
					// fec_fin_mem: agregarDiasHabiles(m.fec_fin_mem, diasExtendibles).toISOString(),
					...m,
				};
			});
			setdataSeguimientos(dataMem);
			console.log(data.newMembresias, dataMem);
		} catch (error) {
			console.log(error);
		}
	};
	return { obtenerTodoSeguimiento, dataSeguimientos };
};
