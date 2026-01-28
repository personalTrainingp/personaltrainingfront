import { PTApi } from '@/common';
import dayjs, { utc } from 'dayjs';
import { useState } from 'react';
import { agruparVentasPorMes } from '../helpers/agruparIngresosPorFecha';
import { agruparPorGrupoYConcepto, aplicarTipoDeCambio } from '../helpers/agrupamientos';

dayjs.extend(utc);
function formatDateToSQLServerWithDayjs(date, isStart = true) {
	const base = dayjs.utc(date);
	return isStart
		? base.startOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]')
		: base.endOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]');
}
export const useVentasStore = () => {
	const [dataVentasxMes, setdataVentasxMes] = useState([{}]);
	const [dataIngresosxMes, setdataIngresosxMes] = useState([{}]);
	const obtenerVentasxFechaxEmpresa = async (arrayDate, idEmpresa) => {
		try {
			const { data } = await PTApi.get(`/venta/get-ventas-x-fecha/${idEmpresa}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			const { data: dataParametrosGastos } = await PTApi.get(
				`/terminologia/terminologiaxEmpresa/${idEmpresa}/1574`
			);
			const ventasMembresiaMap = data.ventas
				.filter((f) => f.detalle_ventaMembresia.length > 0)
				.map((e) => {
					return {
						fec_comprobante: e.fecha_venta,
						fec_pago: e.fecha_venta,
						flag: 1,
						id_empresa: e.id_empresa,
						id_forma_pago: 0,
						id_gasto: 1148,
						id_prov: 0,
						id_tarjeta: 0,
						id_banco: 0,
						id_tipo_comprobante: e.id_tipoFactura,
						moneda: 'PEN',
						monto: e.detalle_ventaMembresia[0]?.tarifa_monto,
						n_comprabante: e.numero_transac,
						n_operacion: 0,
						tb_parametros_gasto: {
							id_empresa: e.id_empresa,
							nombre_gasto: 'MEMBRESIAS',
							grupo: 'INGRESOS',
							id_tipoGasto: 0,
							parametro_grupo: { id: 1148, param_label: 'INGRESOS', orden: 1 },
						},
						tc: 1,
						descripcion: `${e.detalle_ventaMembresia[0].tb_ProgramaTraining.name_pgm} | ${e.detalle_ventaMembresia[0].tb_semana_training.semanas_st} SEMANAS`,
					};
				});

			const ventasProdSuplMap = data.ventas
				.filter((f) => f.detalle_ventaProductos.length > 0)
				.map((e) => {
					const suplementos = e.detalle_ventaProductos
						.filter((e) => e.tb_producto.id_categoria === 17)
						.map((su) => {
							return {
								fec_comprobante: e.fecha_venta,
								fec_pago: e.fecha_venta,
								flag: 1,
								id_empresa: e.id_empresa,
								id_forma_pago: 0,
								id_gasto: 1148,
								id_prov: 0,
								id_tarjeta: 0,
								id_banco: 0,
								id_tipo_comprobante: e.id_tipoFactura,
								moneda: 'PEN',
								monto: su?.tarifa_monto,
								n_comprabante: e.numero_transac,
								n_operacion: 0,
								tc: 1,
								tb_parametros_gasto: {
									id_empresa: e.id_empresa,
									nombre_gasto: 'SUPLEMENTOS',
									grupo: 'INGRESOS',
									id_tipoGasto: 0,
									parametro_grupo: {
										id: 1149,
										param_label: 'INGRESOS',
										orden: 1,
									},
								},
								descripcion: `${su.tb_producto.nombre_producto}`,
							};
						});
					return suplementos;
				})
				.flat();

			const ventasProdAccMap = data.ventas
				.filter((f) => f.detalle_ventaProductos.length > 0)
				.map((e) => {
					const suplementos = e.detalle_ventaProductos
						.filter((e) => e.tb_producto.id_categoria === 18)
						.map((su) => {
							return {
								fec_comprobante: e.fecha_venta,
								fec_pago: e.fecha_venta,
								flag: 1,
								id_empresa: e.id_empresa,
								id_forma_pago: 0,
								id_gasto: 1148,
								id_prov: 0,
								id_tarjeta: 0,
								id_banco: 0,
								id_tipo_comprobante: e.id_tipoFactura,
								moneda: 'PEN',
								monto: su?.tarifa_monto,
								n_comprabante: e.numero_transac,
								n_operacion: 0,
								tc: 1,
								tb_parametros_gasto: {
									id_empresa: e.id_empresa,
									nombre_gasto: 'ACCESORIOS',
									grupo: 'INGRESOS',
									id_tipoGasto: 0,
									parametro_grupo: {
										id: 1150,
										param_label: 'INGRESOS',
										orden: 1,
									},
								},
								descripcion: `${su.tb_producto.nombre_producto}`,
							};
						});
					return suplementos;
				})
				.flat();
			console.log({ ventasProdSuplMap });
			// console.log({
			// 	ventasMembresiaMap,
			// 	dVenta: data.ventas,
			// });

			setdataVentasxMes(
				agruparPorGrupoYConcepto(
					[...ventasMembresiaMap, ...ventasProdSuplMap, ...ventasProdAccMap],
					dataParametrosGastos.termGastos,
					'ingreso'
				)
			);
			// console.log({ data: agruparVentasPorMes(data.ventas) });
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerIngresosxFechaxEmpresa = async (arrayDate, idEmpresa) => {
		try {
			const { data } = await PTApi.get(`/ingreso/fecha/${idEmpresa}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			const { data: dataParametrosGastos } = await PTApi.get(
				`/terminologia/terminologiaxEmpresa/${idEmpresa}/1574`
			);
			const { data: dataTC } = await PTApi.get('/tipoCambio/');
			const dataTCs = dataTC.tipoCambios.map((e, i, arr) => {
				const posteriores = arr
					.filter((item) => new Date(item.fecha) > new Date(e.fecha))
					.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

				const termino = posteriores.length ? posteriores[0].fecha : null;
				return {
					moneda: e.monedaDestino,
					multiplicador: e.precio_compra,
					// monedaOrigen: e.monedaOrigen,
					fecha_inicio_tc: e.fecha,
					fecha_fin_tc: termino, // null si no hay próximo cambio
				};
			});
			console.log({
				daa: data.ingresos,
				idEmpresa,
				ter: dataParametrosGastos.termGastos,
				daa2: agruparPorGrupoYConcepto(
					aplicarTipoDeCambio(dataTCs, data.ingresos),
					dataParametrosGastos.termGastos,
					'ingreso'
				),
			});

			setdataIngresosxMes(
				agruparPorGrupoYConcepto(
					aplicarTipoDeCambio(dataTCs, data.ingresos),
					dataParametrosGastos.termGastos
				)
			);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerVentasxFechaxEmpresa,
		obtenerIngresosxFechaxEmpresa,
		dataVentasxMes,
		dataIngresosxMes,
	};
};
