import { PTApi } from '@/common';
import dayjs from 'dayjs';
import { useState } from 'react';

function formatDateToSQLServerWithDayjs(date) {
	return dayjs(date).toISOString(); // Asegurar que esté en UTC
	// .format('YYYY-MM-DD HH:mm:ss.SSS0000 +00:00');
}
export const useReporteResumenComparativoStore = () => {
	const [dataGroup, setdataGroup] = useState([]);
	const [loading, setloading] = useState(false);
	const [dataEstadoGroup, setdataEstadoGroup] = useState([]);
	const obtenerComparativoResumen = async (RANGE_DATE) => {
		setloading(true);
		const { data } = await PTApi.get('/venta/reporte/obtener-comparativo-resumen', {
			params: {
				arrayDate: [
					formatDateToSQLServerWithDayjs(RANGE_DATE[0]),
					formatDateToSQLServerWithDayjs(RANGE_DATE[1]),
				],
			},
		});
		const agruparxIdPgm = Object.values(
			data.ventasProgramas.reduce((acc, item) => {
				const { id_pgm, detalle_ventaMembresium, tb_image } = item;

				if (!acc[id_pgm]) {
					acc[id_pgm] = {
						id_pgm,
						tarifa_total: 0,
						sesiones_total: 0,
						detalle_ventaMembresium: [],
						tb_image: [],
					};
				}

				// Validar duplicados en detalle_ventaMembresium
				if (
					!acc[id_pgm].detalle_ventaMembresium.some(
						(membresia) =>
							membresia.horario === detalle_ventaMembresium.horario &&
							membresia.tarifa_monto === detalle_ventaMembresium.tarifa_monto &&
							membresia.tb_ventum.id === detalle_ventaMembresium.tb_ventum.id
					)
				) {
					acc[id_pgm].tarifa_total += detalle_ventaMembresium.tarifa_monto;
					acc[id_pgm].sesiones_total +=
						detalle_ventaMembresium.tb_semana_training.sesiones;
					acc[id_pgm].detalle_ventaMembresium.push({
						horario: detalle_ventaMembresium.horario,
						tarifa_monto: detalle_ventaMembresium.tarifa_monto,
						tb_semana_training: detalle_ventaMembresium.tb_semana_training,
						tb_ventum: detalle_ventaMembresium.tb_ventum,
					});
				}

				// Evitar duplicados en tb_image
				if (
					!acc[id_pgm].tb_image.some((image) => image.name_image === tb_image.name_image)
				) {
					acc[id_pgm].tb_image.push(tb_image);
				}

				return acc;
			}, {})
		);
		console.log(data.ventasProgramas);

		setdataGroup(agruparxIdPgm);
		setloading(false);
		// setdataEstadoGroup(groupByIdOrigen(data.ventasProgramas));
		// setdataAuditoria(data.audit);
	};
	const obtenerEstadosOrigenResumen = async (RANGE_DATE) => {
		try {
			const { data: dataTraspaso } = await PTApi.get(
				`/venta/reporte/obtener-estado-cliente-resumen/traspaso`,
				{
					params: {
						arrayDate: [
							formatDateToSQLServerWithDayjs(RANGE_DATE[0]),
							formatDateToSQLServerWithDayjs(RANGE_DATE[1]),
						],
						id_empresa: 598,
					},
				}
			);

			// const agruparxIdPgm = Object.values(
			// 	data.ventasProgramasEstado.reduce((acc, item) => {
			// 		const { id_pgm, detalle_ventaMembresium, tb_image } = item;

			// 		if (!acc[id_pgm]) {
			// 			acc[id_pgm] = {
			// 				id_pgm,
			// 				tarifa_total: 0,
			// 				sesiones_total: 0,
			// 				detalle_ventaMembresium: [],
			// 				tb_image: [],
			// 			};
			// 		}

			// 		// Validar duplicados en detalle_ventaMembresium
			// 		if (
			// 			!acc[id_pgm].detalle_ventaMembresium.some(
			// 				(membresia) =>
			// 					membresia.horario === detalle_ventaMembresium.horario &&
			// 					membresia.tarifa_monto === detalle_ventaMembresium.tarifa_monto &&
			// 					membresia.tb_ventum.id === detalle_ventaMembresium.tb_ventum.id
			// 			)
			// 		) {
			// 			acc[id_pgm].tarifa_total += detalle_ventaMembresium.tarifa_monto;
			// 			acc[id_pgm].sesiones_total +=
			// 				detalle_ventaMembresium.tb_semana_training.sesiones;
			// 			acc[id_pgm].detalle_ventaMembresium.push({
			// 				horario: detalle_ventaMembresium.horario,
			// 				tarifa_monto: detalle_ventaMembresium.tarifa_monto,
			// 				tb_semana_training: detalle_ventaMembresium.tb_semana_training,
			// 				tb_ventum: detalle_ventaMembresium.tb_ventum,
			// 			});
			// 		}

			// 		// Evitar duplicados en tb_image
			// 		if (
			// 			!acc[id_pgm].tb_image.some(
			// 				(image) => image.name_image === tb_image.name_image
			// 			)
			// 		) {
			// 			acc[id_pgm].tb_image.push(tb_image);
			// 		}

			// 		return acc;
			// 	}, {})
			// );
			// console.log(agruparxIdPgm);
			setdataEstadoGroup(
				agruparVentasConDetalles({
					ventasProgramaNuevo: [],
					ventasProgramaReinscritos: dataReinscritos.ventasProgramasEstado,
					ventasProgramaRenovaciones: dataRenovacion.ventasProgramasEstado,
					ventasProgramaTransferencias: [],
					ventasProgramaTraspasos: dataTraspaso.ventasProgramasEstado,
				})
			);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerVentasxComprobantes = async (RANGE_DATE, id_factura) => {};
	return {
		obtenerComparativoResumen,
		obtenerEstadosOrigenResumen,
		// dataEstadoGroup,
		dataGroup,
		loading,
	};
};

// const { data: dataRenovacion } = await PTApi.get(
// 	`/venta/reporte/obtener-estado-cliente-resumen/691`,
// 	{
// 		params: {
// 			arrayDate: [
// 				formatDateToSQLServerWithDayjs(RANGE_DATE[0]),
// 				formatDateToSQLServerWithDayjs(RANGE_DATE[1]),
// 			],
// 			id_empresa: 598,
// 		},
// 	}
// );

// const { data: dataReinscritos } = await PTApi.get(
// 	`/venta/reporte/obtener-estado-cliente-resumen/692`,
// 	{
// 		params: {
// 			arrayDate: [
// 				formatDateToSQLServerWithDayjs(RANGE_DATE[0]),
// 				formatDateToSQLServerWithDayjs(RANGE_DATE[1]),
// 			],
// 			id_empresa: 598,
// 		},
// 	}
// );

// const { data: dataNuevos } = await PTApi.get(
// 	`/venta/reporte/obtener-nuevos-clientes-resumen`,
// 	{
// 		params: {
// 			arrayDate: [
// 				formatDateToSQLServerWithDayjs(RANGE_DATE[0]),
// 				formatDateToSQLServerWithDayjs(RANGE_DATE[1]),
// 			],
// 			id_empresa: 598,
// 		},
// 	}
// );
const groupByIdOrigen = (data) => {
	return data.reduce((acc, item) => {
		const idOrigen = item.tb_ventum.id_origen;

		// Busca si ya existe un grupo para este id_origen
		let group = acc.find((g) => g.id_origen === idOrigen);

		if (!group) {
			// Si no existe, crea uno nuevo
			group = { id_origen: idOrigen, items: [] };
			acc.push(group);
		}

		// Agrega el elemento al grupo correspondiente
		group.items.push(item);
		return acc;
	}, []);
};

// Agrupar por id_pgm con categorías separadas
function agruparVentasConDetalles({
	ventasProgramaNuevo = [],
	ventasProgramaReinscritos = [],
	ventasProgramaRenovaciones = [],
	ventasProgramaTraspasos = [],
	ventasProgramaTransferencias = [],
}) {
	const agrupados = {};

	const agregarDetalles = (array, tipo) => {
		array?.forEach((venta) => {
			const { name_pgm, id_pgm, tb_image, detalle_ventaMembresium } = venta;

			// Generar una clave única para el agrupamiento
			const key = `${name_pgm}_${id_pgm}`;

			// Si el grupo no existe, se inicializa
			if (!agrupados[key]) {
				agrupados[key] = {
					name_pgm,
					id_pgm,
					tb_image: [],
					detallesNuevos: [],
					detallesReinscritos: [],
					detallesRenovaciones: [],
					detallesTraspasos: [],
					detalleTransferencias: [],
				};
			}

			// Agregar `tb_image` solo si no está ya incluido
			if (!agrupados[key].tb_image.some((img) => img === tb_image)) {
				agrupados[key].tb_image.push(tb_image);
			}
			console.log(tipo, 'dddd');

			// Agregar el detalle al tipo correspondiente
			agrupados[key][tipo].push(detalle_ventaMembresium);
		});
	};

	// Procesar cada tipo de ventas
	agregarDetalles(ventasProgramaNuevo, 'detallesNuevos');
	agregarDetalles(ventasProgramaReinscritos, 'detallesReinscritos');
	agregarDetalles(ventasProgramaRenovaciones, 'detallesRenovaciones');
	agregarDetalles(ventasProgramaTraspasos, 'detallesTraspasos');
	agregarDetalles(ventasProgramaTransferencias, 'detalleTransferencias');

	// Convertir el objeto agrupado en un array
	return Object.values(agrupados);
}
