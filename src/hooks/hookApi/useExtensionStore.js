import { PTApi } from '@/common';
import { useState } from 'react';

export const useExtensionStore = () => {
	const [dataExtension, setdataExtension] = useState([]);
	const [dataUltimaMembresia, setdataUltimaMembresia] = useState([]);
	const postExtension = async (
		formState,
		tipo_extension,
		id_venta,
		extension_inicio,
		extension_fin
	) => {
		try {
			const { data } = await PTApi.post(
				`/extension-membresia/post-extension/${tipo_extension}/${id_venta}`,
				{
					...formState,
					extension_inicio,
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
			console.log('entraaa');

			const { data } = await PTApi.get(`/usuario/get-ultima-membresia-cliente/${id_cli}`);
			console.log([data.ultimaMembresia]);

			const dataOrden = [data.ultimaMembresia]?.map((f) => {
				return {
					id: f.id,
					nombre_membresia: f?.detalle_ventaMembresia[0].tb_ProgramaTraining.name_pgm,
					sesiones_membresia: f.detalle_ventaMembresia[0].tb_semana_training.sesiones,
					semanas_membresia: f.detalle_ventaMembresia[0].tb_semana_training.semanas_st,
					fecha_inicio_mem: f.detalle_ventaMembresia[0].fec_inicio_mem,
					fecha_fin_mem: f.detalle_ventaMembresia[0].fec_fin_mem,
				};
			});
			console.log('asdf');

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
