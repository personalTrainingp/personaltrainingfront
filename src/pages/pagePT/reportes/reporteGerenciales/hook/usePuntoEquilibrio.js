import { PTApi } from '@/common';
import dayjs, { utc } from 'dayjs';
import React, { useState } from 'react';
import { dataIngresosOrden } from '@/helper/dataIngresosOrden';
import { formatDateToSQLServerWithDayjs } from '@/helper/formatDateToSQLServerWithDayjs';
import { obtenerTipoDeCambio } from '@/middleware/obtenerTipoDeCambio';
import { agruparPorGrupoYConcepto, aplicarTipoDeCambio } from '../helpers/agrupamientos';

dayjs.extend(utc);
export const usePuntoEquilibrio = () => {
	const [dataIngresosxFecha, setdataIngresosxFecha] = useState([]);
	const [dataGastosxFecha, setdataGastosxFecha] = useState([]);
	const obtenerIngresos = async (arrayDate, enterprice) => {
		try {
			const { data } = await PTApi.get(`/venta/fecha-venta/id_empresa/${enterprice}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			const { data: dataIngresos } = await PTApi.get(`/ingreso/fecha/${enterprice}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			const { data: dataMF } = await PTApi.get(`/reserva_monk_fit/fecha`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			const { data: dataParametrosGastos } = await PTApi.get(
				`/terminologia/terminologiaxEmpresa/${enterprice}/1574`
			);
			const ingresosMAP = dataIngresos.ingresos.map((i) => {
				return {
					...i,
					fecha_comprobante: i.fec_comprobante,
					fecha_pago: i.fec_pago,
					fecha_primaria: i.fec_pago,
					monto: i.monto,
				};
			});
			const reservasMFMAP = dataMF.reservasMF?.map((m) => {
				return {
					moneda: 'PEN',
					monto: m.monto_total,
					cantidadTotal: 1,
					n_comprabante: '',
					fecha_primaria: m.fechaP,
					concepto: 'MONKEY-FIT',
					tb_parametros_gasto: {
						grupo: 'INGRESOS',
						id_empresa: 598,
						nombre_gasto: 'MONKEY-FIT',
						parametro_grupo: {
							param_label: 'INGRESOS',
							id_empresa: 598,
						},
					},
				};
			});
			const dataV = dataIngresosOrden([...data.ventas]);
			console.log({ d11: dataV.dataProductos18 });
			// const dataMembresiasxOrigen =
			const arrayTotalIngresos = [
				...dataV.dataMembresias,
				...dataV.dataProductos17,
				...dataV.dataProductos18,
				...ingresosMAP,
				...reservasMFMAP,
			];
			const totalIngresos = arrayTotalIngresos.map((f) => {
				return {
					...f,
					id_estado_gasto: 1423,
				};
			});
			const dataTipoTC = await obtenerTipoDeCambio();
			setdataIngresosxFecha(
				agruparPorGrupoYConcepto(totalIngresos, dataParametrosGastos.termGastos)
			);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerEgresos = async (arrayDate, idEmpresa) => {
		try {
			const { data } = await PTApi.get(`/egreso/fecha-comprobante/${idEmpresa}`, {
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
			setdataGastosxFecha(
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
		obtenerEgresos,
		obtenerIngresos,
		dataIngresosxFecha,
		dataGastosxFecha,
	};
};
