import { PTApi } from '@/common';
import dayjs from 'dayjs';
import { useState } from 'react';
const obtenerMayorFechaExtensionFin = (data) => {
	return data.reduce(
		(max, item) =>
			dayjs(item.extension_fin, 'YYYY-MM-DD').isAfter(dayjs(max)) ? item.extension_fin : max,
		data[0]?.extension_fin || null
	);
};
export const useExtensionStore = () => {
	const [dataExtension, setdataExtension] = useState([]);
	const [dataUltimaMembresia, setdataUltimaMembresia] = useState([]);
	const postExtension = async (
		dias_habiles,
		observacion,
		tipo_extension,
		id_venta,
		extension_inicio,
		extension_fin
	) => {
		try {
			const { data } = await PTApi.post(
				`/extension-membresia/post-extension/${tipo_extension}/${id_venta}`,
				{
					dias_habiles,
					observacion,
					extension_inicio: dayjs.utc(extension_inicio).format('YYYY-MM-DD'),
					extension_fin,
				}
			);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerExtensionEnTabla = async (tipo) => {
		try {
			const { data } = await PTApi.get(`/extension-membresia/get-extension/${tipo}`);
			console.log(data);
			setdataExtension(data.extensiones);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerUltimaMembresiaxIdCli = async (id_cli) => {
		try {
			const { data } = await PTApi.get(`/usuario/get-ultima-membresia-cliente/${id_cli}`);
			console.log(data, 'ddd');

			const dataOrden = [data.ultimaMembresia]?.map((f) => {
				console.log(
					obtenerMayorFechaExtensionFin(
						f.detalle_ventaMembresia[0].tb_extension_membresia
					)
						? obtenerMayorFechaExtensionFin(
								f.detalle_ventaMembresia[0].tb_extension_membresia
							)
						: f.detalle_ventaMembresia[0].fec_fin_mem,
					'aqqqqq'
				);
				const fecha_fin_mem = obtenerMayorFechaExtensionFin(
					f.detalle_ventaMembresia[0].tb_extension_membresia
				)
					? obtenerMayorFechaExtensionFin(
							f.detalle_ventaMembresia[0].tb_extension_membresia
						)
					: f.detalle_ventaMembresia[0].fec_fin_mem;
				return {
					id_venta: f.id,
					nombre_membresia: f?.detalle_ventaMembresia[0].tb_ProgramaTraining.name_pgm,
					sesiones_membresia: f.detalle_ventaMembresia[0].tb_semana_training.sesiones,
					semanas_membresia: f.detalle_ventaMembresia[0].tb_semana_training.semanas_st,
					fecha_inicio_mem: f.detalle_ventaMembresia[0].fec_inicio_mem,
					fecha_fin_mem_default: f.detalle_ventaMembresia[0].fec_fin_mem,
					fecha_fin_mem: fecha_fin_mem,
					// f.detalle_ventaMembresia[0].fec_fin_mem,
				};
			});

			console.log({ dataOrden }, 'asdfff');

			setdataUltimaMembresia(dataOrden);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		postExtension,
		obtenerExtensionEnTabla,
		obtenerUltimaMembresiaxIdCli,
		dataUltimaMembresia,
		dataExtension,
	};
};
