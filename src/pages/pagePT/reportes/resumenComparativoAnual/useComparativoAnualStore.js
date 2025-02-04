import { PTApi } from '@/common';
import {
	formateo_Moneda,
	FUNFormatterCom,
	FUNMoneyFormatter,
	NumberFormatMoney,
} from '@/components/CurrencyMask';
import { useState } from 'react';

export const useComparativoAnualStore = () => {
	const [dataVentas, setdataVentas] = useState([]);

	const [isLoading, setisLoading] = useState(false);

	const obtenerProgramasxVentasxMULTIDATE = async (rangoDate) => {
		try {
			setisLoading(false);
			rangoDate = rangoDate.map((d) => d.value);
			// Crear una lista de promesas para las llamadas API
			const promesas = rangoDate.map(async (fecha) => {
				const [anio, mes] = fecha.split('-'); // Dividir fecha en año y mes
				// await obtenerProgramasxVentasxMesxAnio(mes, anio);
				const { data } = await PTApi.get(
					'/venta/reporte/obtener-comparativo-resumen-x-mes-anio',
					{
						params: {
							mes,
							anio,
						},
					}
				);
				const { data: dataTransferencias } = await PTApi.get(
					'/venta/reporte/obtener-transferencias-resumen-x-mes-anio',
					{
						params: {
							mes,
							anio,
						},
					}
				);
				const dataTransf = dataTransferencias.transferencia.map((t) => {
					return {};
				});
				console.log(data.ventasProgramas, dataTransferencias.transferencia, 'linea 34');

				const agruparxIdPgm = Object.values(
					data?.ventasProgramas?.reduce((acc, item) => {
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
									membresia.tarifa_monto ===
										detalle_ventaMembresium.tarifa_monto &&
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
							!acc[id_pgm].tb_image.some(
								(image) => image.name_image === tb_image.name_image
							)
						) {
							acc[id_pgm].tb_image.push(tb_image);
						}

						return acc;
					}, {})
				);
				// const suma_tarifa_total_mes = agruparxIdPgm.map()
				const tb_ventums = agruparxIdPgm.map((g) =>
					g.detalle_ventaMembresium.map((f) => f.tb_ventum)
				);
				const suma_tarifa_total = agruparxIdPgm.reduce(
					(acc, item) => {
						acc.tarifa_total += item.tarifa_total;
						return acc;
					},
					{ tarifa_total: 0 }
				).tarifa_total;

				const suma_sesiones_total = agruparxIdPgm.reduce(
					(acc, item) => {
						acc.sesiones_total += item.sesiones_total;
						return acc;
					},
					{ sesiones_total: 0 }
				).sesiones_total;
				const ventasSinCero = tb_ventums
					.flat()
					.filter((f) => f.id_tipoFactura === 699 && f.id_tipoFactura === 700);
				const ventasConCero = tb_ventums
					.flat()
					.filter((f) => f.id_tipoFactura !== 699 && f.id_tipoFactura !== 700);
				const nuevos = ventasSinCero
					.flat()
					.filter((f) => f.id_origen !== 691 && f.id_origen !== 692).length;
				const renovaciones = tb_ventums.flat().filter((f) => f.id_origen == 691).length;
				const reinscripciones = tb_ventums.flat().filter((f) => f.id_origen == 692).length;
				const traspasos = ventasConCero.flat().filter((f) => f.id_tipoFactura === 701).length;
				const transferencias = ventasConCero
					.flat()
					.filter((f) => f.id_tipoFactura === 702).length;
				const cantidad_total =
					nuevos + renovaciones + reinscripciones + traspasos + transferencias;
				const cantidad_vendidas = nuevos + renovaciones + reinscripciones;
				//TODO: ITEMS
				const item = {
					date: fecha,
					total_socios: cantidad_total,
					nuevos: nuevos,
					renovaciones: renovaciones,
					reinscripciones: reinscripciones,
					traspasos: traspasos,
					// transferencias: transferencias,
					venta_total: FUNMoneyFormatter(suma_tarifa_total),
					ticket_medio: FUNMoneyFormatter(suma_tarifa_total / cantidad_vendidas),
					total_sesiones_vendidas: FUNFormatterCom(suma_sesiones_total),
				};
				// console.log(item, 'agrupado');
				return item;
			});

			// Esperar a que todas las promesas se resuelvan
			const resultados = await Promise.all(promesas);
			console.log(calcularVariacion(resultados), 'prrr');
			// console.log(resultados, 'resu');

			// Actualizar el estado con los datos combinados
			setdataVentas(resultados);
			setisLoading(true);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerProgramasxVentasxMesxAnio = async (mes, anio) => {
		try {
			const { data } = await PTApi.get(
				'/venta/reporte/obtener-comparativo-resumen-x-mes-anio',
				{
					params: {
						mes,
						anio,
					},
				}
			);
			console.log(data);
			// setdataVentas([data.dataProgramas]);

			return data.dataProgramas;
		} catch (error) {
			console.log(error);
		}
		// return new Promise(resolve => setTimeout(resolve, 3000));
		// const { data } = await PTApi.get('/venta/reporte/obtener-comparativo-resumen-x-mes', {
		// 	params: {
		// 		mes,
		// 		anio,
		// 	},
		// });
		// setdata(data.ventasProgramas);
	};

	return {
		obtenerProgramasxVentasxMesxAnio,
		obtenerProgramasxVentasxMULTIDATE,
		dataVentas,
		isLoading,
	};
};

function calcularVariacion(data) {
	if (data.length < 2) {
		console.error('El array debe tener al menos dos elementos para calcular variaciones.');
		return data;
	}

	// Calcula la variación porcentual para cada campo
	function calcularPorcentaje(valorInicial, valorFinal) {
		if (valorInicial === 0) return valorFinal === 0 ? 0 : 100;
		return (((valorFinal - valorInicial) / valorInicial) * 100).toFixed(2);
	}

	const resultado = [];

	for (let i = 0; i < data.length - 1; i++) {
		const inicio = data[i];
		const fin = data[i + 1];

		const variacion = {
			porcentaje: '%',
			total_socios_porcentaje: calcularPorcentaje(inicio.total_socios, fin.total_socios),
			nuevos_porcentaje: calcularPorcentaje(inicio.nuevos, fin.nuevos),
			renovaciones_porcentaje: calcularPorcentaje(inicio.renovaciones, fin.renovaciones),
			reinscripciones_porcentaje: calcularPorcentaje(
				inicio.reinscripciones,
				fin.reinscripciones
			),
		};

		resultado.push(inicio, variacion);
	}

	// Agrega el último elemento al resultado
	resultado.push(data[data.length - 1]);

	return resultado;
}
