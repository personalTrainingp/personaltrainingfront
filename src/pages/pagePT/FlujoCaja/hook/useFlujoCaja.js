import { PTApi } from '@/common';
import dayjs from 'dayjs';
import { useState } from 'react';
import { agruparPorGrupoYConcepto, aplicarTipoDeCambio } from '../helpers/agrupamientosOficiales';

function formatDateToSQLServerWithDayjs(date, isStart = true) {
	const base = dayjs(date);

	const formatted = isStart
		? base.startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[-05:00]')
		: base.endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[-05:00]');

	return formatted;
}

export const useFlujoCaja = () => {
	const [dataGastosxFecha, setdataGastosxFecha] = useState([]);
	const [dataIngresosxFecha, setdataIngresosxFecha] = useState([]);
	const obtenerEgresosxFecha = async (enterprice, arrayDate) => {
		try {
			const { data } = await PTApi.get(`/egreso/fecha-pago/${enterprice}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			const dataGastos = data.gastos.map((g) => {
				return {
					fecha_primaria: g.fecha_pago,
					montoAntiguo: g.monto,
					...g,
					monto: g.moneda === 'PEN' ? g.monto : Number(`${g.monto * g.tcPEN}`),
				};
			});
			// const { data: dataTC } = await PTApi.get('/tipoCambio/');
			setdataGastosxFecha(agruparPorGrupoYConcepto(dataGastos));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerIngresosxFecha = async (enterprice, arrayDate) => {
		try {
			const { data } = await PTApi.get(`/venta/get-ventas-x-fecha/${enterprice}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			console.log({ data, vista: 0 });
			const dataVentasMap = data.ventas.map((m) => {
				return {
					id_cli: m.id_cli,
					id_origen: m.id_origen,
					id_venta: m.id,
					fecha_primaria: m.fecha_venta,
					empl: m.tb_empleado.nombres_apellidos_empl,
					detalle_membresias: m.detalle_ventaMembresia,
					detalle_productos: m.detalle_ventaProductos,
				};
			});
			console.log({ dataVentasMap, vista: 1 });
			const dataMembresias = dataVentasMap
				.filter((dventa) => dventa.detalle_membresias.length !== 0)
				.map((v) => {
					return {
						...v,
						monto: v.detalle_membresias[0]?.tarifa_monto,
						cantidadTotal: 1,
						concepto: 'MEMBRESIA' || '',
						tb_parametros_gasto: {
							grupo: 'INGRESOS',
							id_empresa: 598,
							nombre_gasto: 'MEMBRESIA',
							parametro_grupos: {
								param_label: 'INGRESOS',
								id_empresa: 598,
							},
						},
					};
				})
				.filter((f) => f.montoTotal !== 0);
			console.log({ dataMembresias, vista: 2 });

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
						monto: montoTotal,
						concepto: 'PRODUCTO 17',
						tb_parametros_gasto: {
							grupo: 'INGRESOS',
							id_empresa: 598,
							nombre_gasto: 'ACCESORIOS',
							parametro_grupos: {
								param_label: 'INGRESOS',
								id_empresa: 598,
							},
						},
					};
				})
				.filter((v) => v.detalle_productos.length !== 0);
			console.log({ dataProductos17, vista: 3 });
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
						monto: montoTotal,
						concepto: 'PRODUCTO 18',

						tb_parametros_gasto: {
							grupo: 'INGRESOS',
							id_empresa: 598,
							nombre_gasto: 'SUPLEMENTOS',
							parametro_grupos: {
								param_label: 'INGRESOS',
								id_empresa: 598,
							},
						},
					};
				})
				.filter((v) => v.detalle_productos.length !== 0);
			console.log({ dataProductos18, vista: 4 });
			setdataIngresosxFecha(
				agruparPorGrupoYConcepto([
					...dataMembresias,
					...dataProductos17,
					...dataProductos18,
				])
			);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerEgresosxFecha,
		dataGastosxFecha,
		obtenerIngresosxFecha,
		dataIngresosxFecha,
	};
};

function generarRangosTipoCambio(tipoCambios) {
	return tipoCambios.map((e, i, arr) => {
		const posteriores = arr
			.filter((item) => new Date(item.fecha) > new Date(e.fecha))
			.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

		const termino = posteriores.length ? posteriores[0].fecha : null;

		return {
			moneda: e.monedaDestino,
			multiplicador: e.precio_compra,
			fecha_inicio_tc: e.fecha,
			fecha_fin_tc: termino,
		};
	});
}
