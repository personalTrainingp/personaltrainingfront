import { PTApi } from '@/common';
import { formateo_Moneda, FUNMoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask';
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
				).filter(p=>p.id_pgm==2);
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
				const cantidad_total = agruparxIdPgm
					.map((g) => g.detalle_ventaMembresium)
					.flat().length;
				const item = {
					date: fecha,
					cantidad_total: cantidad_total,
					cantidad_nuevos: tb_ventums
						.flat()
						.filter((f) => f.id_tipoFactura !== 701)
						.filter((v) => v.id_origen !== 691 && v.id_origen !== 692).length,
					cantidad_renovaciones: tb_ventums.flat().filter((f) => f.id_origen == 691)
						.length,
					cantidad_reinscripciones: tb_ventums.flat().filter((f) => f.id_origen == 692)
						.length,
					tarifa_total: FUNMoneyFormatter(suma_tarifa_total),
					ticket_medio: FUNMoneyFormatter(suma_tarifa_total / cantidad_total),
					sesiones_total: FUNMoneyFormatter(suma_sesiones_total),
				};
				// console.log(item, 'agrupado');
				return item;
			});

			// Esperar a que todas las promesas se resuelvan
			const resultados = await Promise.all(promesas);
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
