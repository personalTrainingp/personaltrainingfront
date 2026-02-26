import { PTApi } from '@/common';
import dayjs, { utc } from 'dayjs';
import React, { useState } from 'react';
import { agruparPorGrupo } from '../helpers/agrupamientos';
import { agruparPorGrupoYConcepto, aplicarTipoDeCambio } from '@/helper/aplicarTipoDeCambio';
import { obtenerTipoDeCambio } from '@/middleware/obtenerTipoDeCambio';

dayjs.extend(utc);
function formatDateToSQLServerWithDayjs(date, isStart = true) {
	const base = dayjs.utc(date);
	return isStart
		? base.startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[-05:00]')
		: base.endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[-05:00]');
}
export const usePuntoEquilibrio = () => {
	const [dataVentas, setdataVentas] = useState([]);
	const [dataMF, setdataMF] = useState([]);
	const [dataIngresos, setdataIngresos] = useState([]);
	const [dataEgresos, setdataEgresos] = useState([]);
	const obtenerVentas = async (arrayDate, idEmpresa) => {
		try {
			const { data } = await PTApi.get(`/venta/get-ventas-x-fecha/${idEmpresa}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			const { data: dataMF } = await PTApi.get('/reserva_monk_fit/fecha', {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			const { data: dataIngresos } = await PTApi.get(`/ingreso/fecha/${idEmpresa}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			const dataIngresosMAP = dataIngresos.ingresos?.map((i) => {
				return {
					...i,
					concepto: i.tb_parametros_gasto?.grupo,
					cantidadTotal: 1,
					fecha_comprobante: i.fec_comprobante,
					fechaP: i.fec_pago,
					montoTotal: i.monto,
				};
			});
			console.log({ dataIngresosMAP });

			const dataMFMAP = dataMF.reservasMF?.map((mf) => {
				return {
					...mf,
					concepto: 'MONKEY FIT',
				};
			});
			const dataVentasMap = data.ventas.map((m) => {
				return {
					id_cli: m.id_cli,
					id_origen: m.id_origen,
					id_venta: m.id,
					fechaP: m.fecha_venta,
					empl: m.tb_empleado.nombres_apellidos_empl,
					detalle_membresias: m.detalle_ventaMembresia,
					detalle_productos: m.detalle_ventaProductos,
				};
			});
			const dataMembresias = dataVentasMap
				.filter((dventa) => dventa.detalle_membresias.length !== 0)
				.map((v) => {
					return {
						...v,
						montoTotal: v.detalle_membresias[0]?.tarifa_monto,
						cantidadTotal: 1,
						modelo: 'MEMBRESIAS',
					};
				})
				.filter((f) => f.montoTotal !== 0);
			const dataProductos17 = dataVentasMap
				.map((v) => {
					const detalleFiltrado = v.detalle_productos.filter(
						(p) => p.tb_producto?.id_categoria === 17
					);

					const { cantidadTotal, montoTotal } = detalleFiltrado.reduce(
						(acc, p) => {
							acc.cantidadTotal += Number(p.cantidad || 0);
							acc.montoTotal += Number(p.tarifa_monto || 0);
							return acc;
						},
						{ cantidadTotal: 0, montoTotal: 0 }
					);

					return {
						...v,
						detalle_productos: detalleFiltrado,
						cantidadTotal,
						montoTotal,
						concepto: 'PRODUCTO17',
						modelo: 'producto',
					};
				})
				.filter((v) => v.detalle_productos.length !== 0);

			const dataProductos18 = dataVentasMap
				.map((v) => {
					const detalleFiltrado = v.detalle_productos.filter(
						(p) => p.tb_producto?.id_categoria === 18
					);

					const { cantidadTotal, montoTotal } = detalleFiltrado.reduce(
						(acc, p) => {
							acc.cantidadTotal += Number(p.cantidad || 0);
							acc.montoTotal += Number(p.tarifa_monto || 0);
							return acc;
						},
						{ cantidadTotal: 0, montoTotal: 0 }
					);

					return {
						...v,
						detalle_productos: detalleFiltrado,
						cantidadTotal,
						montoTotal,
						concepto: 'PRODUCTO18',
						modelo: 'producto',
					};
				})
				.filter((v) => v.detalle_productos.length !== 0);
			const dataRenovaciones = dataMembresias
				.map((m) => {
					return {
						...m,
						concepto: 'RENOVACIONES',
					};
				})
				.filter((f) => f.id_origen === 691);
			const dataReinscripcion = dataMembresias
				.map((m) => {
					return {
						...m,
						concepto: 'REINSCRIPCIONES',
					};
				})
				.filter((f) => f.id_origen === 692);
			const dataNuevos = dataMembresias
				.map((m) => {
					return {
						...m,
						concepto: 'NUEVOS',
					};
				})
				.filter((f) => f.id_origen !== 692 && f.id_origen !== 691);
			setdataVentas([
				...dataNuevos,
				...dataProductos18,
				...dataProductos17,
				...dataReinscripcion,
				...dataRenovaciones,
				...dataMFMAP,
				...dataIngresosMAP,
			]);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerVentasMonkFit = async (arrayDate) => {
		try {
			const { data } = await PTApi.get('/reserva_monk_fit/fecha', {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			setdataMF(data.reservasMF);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerIngresos = async (arrayDate) => {
		try {
			const { data } = await PTApi.get('/ingreso/fecha/800', {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			console.log({ df: data.ingresos });

			setdataIngresos(data.ingresos);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerEgresos = async (arrayDate, idEmpresa) => {
		try {
			const { data } = await PTApi.get(`/egreso/fecha-pago/${idEmpresa}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			const dataGastos = data.gastos.map((g) => {
				return {
					fecha_primaria: g.fecha_comprobante,
					...g,
				};
			});
			const { data: dataParametrosGastos } = await PTApi.get(
				`/terminologia/terminologiaxEmpresa/${idEmpresa}/1573`
			);
			const dataTipoTC = await obtenerTipoDeCambio();
			setdataEgresos(
				agruparPorGrupoYConcepto(
					aplicarTipoDeCambio(dataTipoTC, dataGastos),
					dataParametrosGastos.termGastos
				)
			);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerVentasMonkFit,
		obtenerVentas,
		obtenerEgresos,
		obtenerIngresos,
		dataIngresos,
		dataMF,
		dataEgresos,
		dataVentas,
	};
};
