import { PTApi } from '@/common';
import dayjs from 'dayjs';
import React, { useState } from 'react';
function formatDateToSQLServerWithDayjs(date) {
	return dayjs(date).toISOString(); // Asegurar que esté en UTC
	// .format('YYYY-MM-DD HH:mm:ss.SSS0000 +00:00');
}

const agruparPorIdPgm = (data) => {
	return data.reduce((resultado, item) => {
		// Buscar si ya existe un grupo con el mismo id_pgm
		let grupo = resultado.find((g) => g.id_pgm === item.id_pgm);

		if (!grupo) {
			// Si no existe, crear uno nuevo
			grupo = { id_pgm: item.id_pgm, items: [] };
			resultado.push(grupo);
		}

		// Agregar el objeto {venta_venta, id_pgm} al grupo
		grupo.items.push({ venta_venta: item.venta_venta, id_pgm: item.id_pgm });

		return resultado;
	}, []);
};
const filterMembresias = (membresias, rangeDate) => {
	const [rangeStart, rangeEnd] = rangeDate.map((date) => new Date(date)); // Convertimos las fechas del rango a objetos Date

	return membresias.filter((membresia) => {
		const inicio = new Date(membresia.detalle_ventaMembresium.fec_inicio_mem);
		const fin = new Date(membresia.detalle_ventaMembresium.fec_fin_mem);

		// Verificamos si las fechas están dentro del rango
		return (
			inicio <= rangeEnd && fin >= rangeStart // El rango y las membresías se solapan
		);
	});
};
export const useReporteDemograficoxMembresiaStore = () => {
	const [dataMembresiasxPrograma, setdataMembresiasxPrograma] = useState([]);
	const [isLoadingData, setisLoadingData] = useState(false);
	const [dataIdPgmCero, setdataIdPgmCero] = useState({});
	const obtenerDemografiaMembresia = async (RANGE_DATE) => {
		try {
			setisLoadingData(false);
			const { data } = await PTApi.get(`/venta/reporte/obtenerMembresiasxFecha/598`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(RANGE_DATE[0]),
						formatDateToSQLServerWithDayjs(RANGE_DATE[1]),
					],
				},
			});

			const dataTransferencias = [];
			const membresiasFiltradas = filterMembresias(data.vm, RANGE_DATE);

			const agruparxIdPgm = Object.values(
				membresiasFiltradas.reduce((acc, item) => {
					const { id_pgm, detalle_ventaMembresium, tb_image } = item;

					// Inicializar el acumulador para el id_pgm si no existe
					if (!acc[id_pgm]) {
						acc[id_pgm] = {
							id_pgm,
							tarifa_total: 0,
							sesiones_total: 0,
							detalle_ventaMembresium: [],
							tb_image: [],
						};
					}

					// Validar que detalle_ventaMembresium sea un objeto y no esté vacío
					if (
						detalle_ventaMembresium &&
						Object.keys(detalle_ventaMembresium).length > 0
					) {
						// Validar duplicados en detalle_ventaMembresium
						if (
							!acc[id_pgm].detalle_ventaMembresium.some(
								(membresia) =>
									membresia.horario === detalle_ventaMembresium.horario &&
									membresia.fec_fin_mem === detalle_ventaMembresium.fec_fin_mem &&
									membresia.fec_inicio_mem ===
										detalle_ventaMembresium.fec_inicio_mem &&
									membresia.tarifa_venta ===
										detalle_ventaMembresium.tb_tarifa_venta &&
									membresia.tarifa_monto ===
										detalle_ventaMembresium.tarifa_monto &&
									membresia.tb_ventum?.id ===
										detalle_ventaMembresium.tb_ventum?.id
							)
						) {
							acc[id_pgm].tarifa_total += detalle_ventaMembresium.tarifa_monto || 0;
							acc[id_pgm].sesiones_total +=
								detalle_ventaMembresium.tb_semana_training?.sesiones || 0;

							acc[id_pgm].detalle_ventaMembresium.push({
								horario: detalle_ventaMembresium.horario || null,
								tarifa_monto: detalle_ventaMembresium.tarifa_monto || 0,
								fec_fin_mem: detalle_ventaMembresium.fec_fin_mem,
								fec_inicio_mem: detalle_ventaMembresium.fec_inicio_mem,
								id_tarifa: detalle_ventaMembresium.id_tarifa || 0,
								tb_semana_training:
									detalle_ventaMembresium.tb_semana_training || null,
								tb_ventum: detalle_ventaMembresium.tb_ventum || null,
								tarifa_venta: detalle_ventaMembresium.tarifa_venta || null,
							});
						}
					} else {
						// Asegurarse de que sea un array vacío si no hay detalle_ventaMembresium válido
						acc[id_pgm].detalle_ventaMembresium =
							acc[id_pgm].detalle_ventaMembresium || [];
					}

					// Validar que tb_image sea un objeto válido
					if (tb_image && tb_image.name_image) {
						// Evitar duplicados en tb_image
						if (
							!acc[id_pgm].tb_image.some(
								(image) => image.name_image === tb_image.name_image
							)
						) {
							acc[id_pgm].tb_image.push(tb_image);
						}
					} else {
						// Asegurarse de que sea un array vacío si no hay tb_image válido
						acc[id_pgm].tb_image = acc[id_pgm].tb_image || [];
					}

					return acc;
				}, {})
			);

			const ventasUnificadas = agruparxIdPgm.map((venta) => {
				// Busca las transferencias asociadas al id_pgm
				const transferencia = agruparPorIdPgm(dataTransferencias).find(
					(transferencia) => transferencia.id_pgm === venta.id_pgm
				);
				// const marcacionesxMembresia = agruparPorIdPgmMarcacions(dataMarcaciones).find(
				// 	(marcacion) => marcacion.id_pgm === venta.id_pgm
				// );
				// Agrega la propiedad ventas_transferencias al objeto venta
				return {
					...venta,
					ventas_transferencias: transferencia ? transferencia.items : [],
					// marcacionesxMembresia: marcacionesxMembresia ? marcacionesxMembresia.items : [],
				};
			});
			// Crear el objeto id_pgm: 0 que suma todos los demás
			const totalObject = ventasUnificadas?.reduce(
				(total, current) => {
					total.tarifa_total += current.tarifa_total;
					total.sesiones_total += current.sesiones_total;
					total.detalle_ventaMembresium.push(...current.detalle_ventaMembresium);
					total.tb_image.push(...current.tb_image);
					return total;
				},
				{
					id_pgm: 0,
					tarifa_total: 0,
					sesiones_total: 0,
					detalle_ventaMembresium: [],
					tb_image: [],
				}
			);
			setdataMembresiasxPrograma(agruparxIdPgm);
			setdataIdPgmCero(totalObject);
			setisLoadingData(true);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerDemografiaMembresia,
		dataMembresiasxPrograma,
		dataIdPgmCero,
		isLoadingData,
	};
};
