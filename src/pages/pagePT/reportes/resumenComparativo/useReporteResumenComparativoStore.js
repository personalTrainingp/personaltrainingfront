import { PTApi } from '@/common';
import dayjs from 'dayjs';
import { useState } from 'react';

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

export const useReporteResumenComparativoStore = () => {
	const [dataGroup, setdataGroup] = useState([
		// {
		// 	id_pgm: 0,
		// 	tarifa_total: 0,
		// 	sesiones_total: 0,
		// 	detalle_ventaMembresium: [
		// 		{
		// 			horario: '0',
		// 			tarifa_monto: 0,
		// 			tb_semana_training: { sesiones: 0 },
		// 			tb_ventum: {
		// 				id_tipoFactura: 0,
		// 				fecha_venta: '0',
		// 				id_cli: 0,
		// 				id: 0,
		// 				id_origen: 0,
		// 			},
		// 		},
		// 	],
		// 	tb_image: [{ name_image: '', height: '0', width: '0' }],
		// 	venta_transferencia: [],
		// },
		// {
		// 	id_pgm: 3,
		// 	tarifa_total: 0,
		// 	sesiones_total: 0,
		// 	detalle_ventaMembresium: [],
		// 	tb_image: [],
		// 	venta_transferencia: [],
		// },
		// {
		// 	id_pgm: 4,
		// 	tarifa_total: 0,
		// 	sesiones_total: 0,
		// 	detalle_ventaMembresium: [],
		// 	tb_image: [],
		// 	venta_transferencia: [],
		// },
	]);
	const [dataGroupTRANSFERENCIAS, setdataGroupTRANSFERENCIAS] = useState([]);
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

		const dataTransferencias = data.ventasTransferencias
			.map((f) => {
				return {
					venta_venta: f.venta_venta,
					id_pgm: f.venta_venta[0].venta_transferencia[0].detalle_ventaMembresia[0]
						.id_pgm,
				};
			})
			.flat();
		const agruparxIdPgm = Object.values(
			data.ventasProgramas.reduce((acc, item) => {
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
				if (detalle_ventaMembresium && Object.keys(detalle_ventaMembresium).length > 0) {
					// Validar duplicados en detalle_ventaMembresium
					if (
						!acc[id_pgm].detalle_ventaMembresium.some(
							(membresia) =>
								membresia.horario === detalle_ventaMembresium.horario &&
								membresia.tarifa_monto === detalle_ventaMembresium.tarifa_monto &&
								membresia.tb_ventum?.id === detalle_ventaMembresium.tb_ventum?.id
						)
					) {
						acc[id_pgm].tarifa_total += detalle_ventaMembresium.tarifa_monto || 0;
						acc[id_pgm].sesiones_total +=
							detalle_ventaMembresium.tb_semana_training?.sesiones || 0;

						acc[id_pgm].detalle_ventaMembresium.push({
							horario: detalle_ventaMembresium.horario || null,
							tarifa_monto: detalle_ventaMembresium.tarifa_monto || 0,
							tb_semana_training: detalle_ventaMembresium.tb_semana_training || null,
							tb_ventum: detalle_ventaMembresium.tb_ventum || null,
						});
					}
				} else {
					// Asegurarse de que sea un array vacío si no hay detalle_ventaMembresium válido
					acc[id_pgm].detalle_ventaMembresium = acc[id_pgm].detalle_ventaMembresium || [];
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

			// Agrega la propiedad ventas_transferencias al objeto venta
			return {
				...venta,
				ventas_transferencias: transferencia ? transferencia.items : [],
			};
		});

		// console.log(agruparPorIdPgm(dataTransferencias), agruparxIdPgm, ventasUnificadas);
		console.log(agruparxIdPgm, '149');

		setdataGroup(ventasUnificadas);
		setdataGroupTRANSFERENCIAS(agruparPorIdPgm(dataTransferencias));
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
		dataGroupTRANSFERENCIAS,
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
