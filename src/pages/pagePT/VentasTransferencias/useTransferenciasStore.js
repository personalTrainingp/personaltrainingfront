import { PTApi } from '@/common';
import { useState } from 'react';

const useTransferenciasStore = () => {
	const [data, setdata] = useState([]);
	const obtenerTransferenciasxFecha = async (arrayDate) => {
		const { data: dtTransferencia } = await PTApi.get('/venta/ventas-transferencias', {
			params: {
				arrayDate,
			},
		});
		const dataNew = dtTransferencia.transferencia
			.map((t) => {
				const ultimaVenta = t.venta_venta[t.venta_venta.length - 1];
				const ultimaTransferencia = ultimaVenta.venta_transferencia[0];
				const ultimaMembresiaDeLaTransferencia =
					ultimaTransferencia.detalle_ventaMembresia[
						ultimaTransferencia.detalle_ventaMembresia.length - 1
					];
				return {
					fecha_venta: t.fecha_venta,
					tb_transferencia: {
						programa_Transferencia:
							ultimaMembresiaDeLaTransferencia.tb_ProgramaTraining.name_pgm,
						sesiones_transferencia: `${ultimaMembresiaDeLaTransferencia.tb_semana_training.sesiones}`,
						tb_cliente: {
							nombres_apellidos_cli: `${ultimaTransferencia?.tb_cliente.nombre_cli} ${ultimaTransferencia?.tb_cliente.apPaterno_cli} ${ultimaTransferencia?.tb_cliente.apMaterno_cli}`,
							distrito_cli: `${ultimaTransferencia?.tb_cliente.tb_distrito?.distrito}`,
						},
					},
					tb_benefeciario: {
						tb_cliente: {
							nombres_apellidos_cli: `${t.tb_cliente.nombre_cli} ${t.tb_cliente.apPaterno_cli} ${t.tb_cliente.apMaterno_cli}`,
							distrito_cli: `${t.tb_cliente.tb_distrito?.distrito}`,
						},
					},
				};
			});

		setdata(dataNew);
	};
	return {
		obtenerTransferenciasxFecha,
		data,
	};
};

export default useTransferenciasStore;
