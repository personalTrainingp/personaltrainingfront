import { PTApi } from '@/common';
import { arrayFacturas } from '@/types/type';
import dayjs from 'dayjs';
import React, { useState } from 'react';
function filtrarMarcaciones(tb_marcacion = [], fecha_inicio, fecha_fin) {
	// Convertir fechas de inicio y fin a objetos Date para comparar
	const inicio = new Date(fecha_inicio);
	const fin = new Date(fecha_fin);

	// Ordenar las marcaciones por tiempo_marcacion_new
	const marcacionesOrdenadas = [...tb_marcacion].sort(
		(a, b) => new Date(a.tiempo_marcacion_new) - new Date(b.tiempo_marcacion_new)
	);

	// Agrupar por fecha
	const agrupadoPorFecha = marcacionesOrdenadas.reduce((acc, item) => {
		const fecha = item.tiempo_marcacion_new.split('T')[0]; // Extraer solo la fecha (YYYY-MM-DD)
		if (!acc[fecha]) {
			acc[fecha] = { fecha, items: [] };
		}
		acc[fecha].items.push(item);
		return acc;
	}, {});

	// Convertir el objeto agrupado en un array y añadir marcacion_inicio y marcacion_fin
	const grupos = Object.values(agrupadoPorFecha).map((grupo) => {
		const marcacion_inicio = grupo.items[0]?.tiempo_marcacion_new;
		const marcacion_fin = grupo.items[grupo.items.length - 1]?.tiempo_marcacion_new;
		return {
			fecha: grupo.fecha,
			marcacion_inicio,
			marcacion_fin,
			items: grupo.items,
		};
	});

	// Filtrar los grupos por fecha
	return grupos.filter(({ fecha }) => {
		const fechaComparar = new Date(fecha);
		return fechaComparar >= inicio && fechaComparar <= fin;
	});
}
export const useReporteSesionesUsadasStore = () => {
	const [dataSesionesActivas, setdataSesionesActivas] = useState([]);
	const [isLoadingData, setisLoadingData] = useState(false);
	const obtenerSesionesActivas = async (id_enterprice) => {
		try {
			setisLoadingData(false);
			const { data } = await PTApi.get(
				`/venta/membresias/cliente/marcaciones/${id_enterprice}`
			);
			const dataAlter = data.membresias?.map((d) => {
				const fecha_fin_mem = dayjs(
					d.detalle_ventaMembresia[0]?.fec_fin_mem,
					'YYYY-MM-DD'
				).format('YYYY-MM-DD');
				const fecha_inicio_mem = dayjs
					.utc(d.detalle_ventaMembresia[0]?.fec_inicio_mem)
					.format('YYYY-MM-DD');
				const nombre_programa = d.detalle_ventaMembresia[0]?.tb_ProgramaTraining.name_pgm;
				const sesiones_vendidas = d.detalle_ventaMembresia[0]?.tb_semana_training.sesiones;
				const citas_nutricion =
					d.detalle_ventaMembresia[0]?.tb_semana_training.nutricion_st;
				return {
					nombres_apellidos_cli: d.tb_cliente?.nombres_apellidos_cli,
					nombre_programa: nombre_programa,
					tipoFactura: arrayFacturas.find((f) => f.value === d.id_tipoFactura)?.label,
					sesiones_vendidas: sesiones_vendidas,
					sesiones_usadas: filtrarMarcaciones(
						d.tb_cliente?.tb_marcacions,
						fecha_inicio_mem,
						fecha_fin_mem
					).length,
					fecha_fin_mem: fecha_fin_mem,
					fecha_inicio_mem: fecha_inicio_mem,
					citas_nutricion: citas_nutricion,
					citas_nutricion_asistidas: d.tb_cliente?.tb_cita,
					// citas_nutricion: d.tb_cliente?.tb_cita,
					marcacion: filtrarMarcaciones(
						d.tb_cliente?.tb_marcacions,
						fecha_inicio_mem,
						fecha_fin_mem
					),
				};
			});
			console.log({ dd: data.membresias });

			setdataSesionesActivas(dataAlter);
			setisLoadingData(true);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerSesionesActivas,
		dataSesionesActivas,
		isLoadingData,
	};
};
