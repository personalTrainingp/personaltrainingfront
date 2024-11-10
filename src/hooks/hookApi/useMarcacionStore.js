import { PTApi } from '@/common/api/';
import { useState } from 'react';

export const useMarcacionStore = () => {
	const [dataAsistencia, setDataAsistencia] = useState([]);
	const obtenerMarcacionEmpl = async () => {
		try {
			const { data } = await PTApi.get('marcacion/obtener-asistencias-x-empleado');
			console.log(data.TodasAsistencias);

			agruparMarcacionesXempleado(data.TodasAsistencias);
			setDataAsistencia(agruparMarcacionesXempleado(data.TodasAsistencias));
		} catch (error) {
			console.log(error.message);
		}
	};

	return { obtenerMarcacionEmpl, dataAsistencia };
};

function agruparMarcacionesXempleado(data) {
	const agrupadoPorEmpleado = data.reduce((acc, item) => {
		const nombreCompleto = item.tb_empleado.nombres_apellidos_empl;

		// Buscar si ya existe un grupo para el empleado
		let empleado = acc.find((e) => e.nombres_apellidos_empl === nombreCompleto);

		// Si no existe, crea un nuevo grupo para el empleado
		if (!empleado) {
			empleado = {
				nombres_apellidos_empl: nombreCompleto,
				asistencias: [],
			};
			acc.push(empleado);
		}

		// Obtener solo la fecha de tiempo_marcacion
		const fechaMarcacion = new Date(item.tiempo_marcacion).toLocaleDateString('en-US');

		// Buscar si ya existe un grupo de fecha dentro de asistencias
		let fechaGrupo = empleado.asistencias.find((f) => f.fecha === fechaMarcacion);

		// Si no existe, crear un nuevo grupo de fecha
		if (!fechaGrupo) {
			fechaGrupo = {
				fecha: fechaMarcacion,
				marcaciones: [],
			};
			empleado.asistencias.push(fechaGrupo);
		}

		// Agregar la marcación al grupo de la fecha
		fechaGrupo.marcaciones.push(item);

		return acc;
	}, []);

	// Ordenar las marcaciones dentro de cada grupo de fecha
	agrupadoPorEmpleado.forEach((empleado) => {
		empleado.asistencias.forEach((asistencia) => {
			asistencia.marcaciones.sort(
				(a, b) => new Date(a.tiempo_marcacion) - new Date(b.tiempo_marcacion)
			);
		});
	});
	return agrupadoPorEmpleado;
}
