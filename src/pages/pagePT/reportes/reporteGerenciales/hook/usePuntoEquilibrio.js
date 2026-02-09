import { PTApi } from '@/common';
import dayjs, { utc } from 'dayjs';
import React, { useState } from 'react';
import { agruparPorGrupo, aplicarTipoDeCambio } from '../helpers/agrupamientos';

dayjs.extend(utc);
function formatDateToSQLServerWithDayjs(date, isStart = true) {
	const base = dayjs.utc(date);
	return isStart
		? base.startOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]')
		: base.endOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]');
}
export const usePuntoEquilibrio = () => {
	const [dataVentas, setdataVentas] = useState({
		dataRenovaciones: [],
		dataProductos17: [],
		dataProductos18: [],
		dataReinscripcion: [],
		dataNuevos: [],
		dataMFMap: [],
	});
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
			const { data: dataMF } = await PTApi.get('/reserva_monk_fit/g');
			const dataMFMap = dataMF.reservasMF.map((mf) => {
				return {
					...mf,
					montoTotal: mf.monto_total,
					fechaP: mf.fecha,
					cantidadTotal: 1,
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
					};
				})
				.filter((v) => v.detalle_productos.length !== 0);
			const dataRenovaciones = dataMembresias.filter((f) => f.id_origen === 691);
			const dataReinscripcion = dataMembresias.filter((f) => f.id_origen === 692);
			const dataNuevos = dataMembresias.filter(
				(f) => f.id_origen !== 692 && f.id_origen !== 691
			);
			setdataVentas({
				dataNuevos,
				dataProductos18,
				dataProductos17,
				dataReinscripcion,
				dataRenovaciones,
				dataMFMap,
			});
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
			const { data: dataParametrosGastos } = await PTApi.get(
				`/terminologia/terminologiaxEmpresa/${idEmpresa}/1573`
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
			setdataEgresos(
				agruparPorGrupo(
					aplicarTipoDeCambio(dataTCs, data.gastos),
					dataParametrosGastos.termGastos
				)
			);
			console.log(
				agruparPorGrupo(
					aplicarTipoDeCambio(dataTCs, data.gastos),
					dataParametrosGastos.termGastos
				)
			);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerVentas,
		obtenerEgresos,
		dataEgresos,
		dataVentas,
	};
};
