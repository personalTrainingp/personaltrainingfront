import { PTApi } from '@/common';
import dayjs from 'dayjs';
import { useState } from 'react';
const obtenerMayorFechaExtensionFin = (data) => {
	if (!data || data.length === 0) return null;
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
			await PTApi.post(
				`/extension-membresia/post-extension/${tipo_extension}/${id_venta}`,
				{
					dias_habiles,
					observacion,
					extension_inicio: dayjs.utc(extension_inicio).format('YYYY-MM-DD'),
					extension_fin,
				}
			);
			return { success: true };
		} catch (error) {
			console.log(error);
			const message =
				error?.response?.data?.message ||
				error?.response?.data?.msg ||
				(typeof error?.response?.data === 'string' ? error.response.data : null);
			return { success: false, message };
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

			if (!data.ultimaMembresia) {
				setdataUltimaMembresia([]);
				return;
			}

			const dataOrden = [data.ultimaMembresia].map((f) => {
				const detalle = f.detalle_ventaMembresia[0];
				const fecha_fin_mem =
					obtenerMayorFechaExtensionFin(detalle.tb_extension_membresia) ||
					detalle.fec_fin_mem;
				return {
					id_venta: f.id,
					nombre_membresia: detalle.tb_ProgramaTraining
						? detalle.tb_ProgramaTraining.name_pgm
						: 'SIN DEFINIR',
					sesiones_membresia: detalle.tb_semana_training?.sesiones,
					semanas_membresia: detalle.tb_semana_training?.semanas_st,
					fecha_inicio_mem: detalle.fec_inicio_mem,
					fecha_fin_mem_default: detalle.fec_fin_mem,
					fecha_fin_mem: fecha_fin_mem,
				};
			});

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
