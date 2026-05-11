import { PTApi } from '@/common';
import { useState } from 'react';
import { agruparPorGrupoYConcepto } from '../helpers/agrupamientosOficiales';
import { dataIngresosOrden } from '@/helper/dataIngresosOrden';
import { formatDateToSQLServerWithDayjs } from '@/helper/formatDateToSQLServerWithDayjs';
import { obtenerTipoDeCambio } from '@/middleware/obtenerTipoDeCambio';
import { aplicarTipoDeCambio } from '@/helper/aplicarTipoCambio';

export const useFlujoCaja = () => {
	const [dataGastosxFecha, setdataGastosxFecha] = useState([]);
	const [dataIngresosxFecha, setdataIngresosxFecha] = useState([]);
	const obtenerEgresosxFecha = async (enterprice, arrayDate, tt) => {
		try {
			const { data } = await PTApi.get(`/egreso/fecha-comprobante/${enterprice}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			const dataGastos = data.gastos.map((g) => {
				return {
					fecha_primaria: new Date(
						new Date(g.fecha_comprobante).setUTCHours(14, 0, 0, 0)
					).toISOString(),
					...g,
				};
			});
			const dataTipoTC = await obtenerTipoDeCambio();
			const { data: dataParametrosGastos } = await PTApi.get(
				`/terminologia/grupo-y-concepto/${enterprice}/1573`
			);
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
	const obtenerIngresosxFecha = async (enterprice, arrayDate) => {
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
				`/terminologia/grupo-y-concepto/${enterprice}/1574`
			);
			const ingresosMAP = dataIngresos.ingresos.map((i) => {
				return {
					...i,
					fecha_comprobante: i.fec_comprobante,
					fecha_pago: i.fec_pago,
					fecha_primaria: i.fec_pago,
					monto: i.monto,
					id_gasto: 11,
					tb_parametros_gasto: {
						grupo: 'INGRESOS',
						id_empresa: 598,
						nombre_gasto: 'INGRESOS EXC',
						parametro_grupo: {
							param_label: 'INGRESOS',
							id_empresa: 598,
							id: 121,
						},
					},
				};
			});
			const reservasMFMAP = dataMF.reservasMF?.map((m) => {
				return {
					moneda: 'PEN',
					monto: m.monto_total,
					cantidadTotal: 1,
					n_comprabante: '',
					fecha_primaria: m.fechaP,
					fecha_pago: m.fechaP,
					fecha_comprobante: m.fechaP,
					concepto: 'MONKEY-FIT',
					id_gasto: 1210,
					tb_parametros_gasto: {
						grupo: 'INGRESOS',
						id_empresa: 598,
						nombre_gasto: 'MONKEY-FIT',
						parametro_grupo: {
							param_label: 'INGRESOS',
							id_empresa: 598,
							id: 112,
						},
					},
				};
			});

			const dataTipoTC = await obtenerTipoDeCambio();
			const dataV = dataIngresosOrden([...data.ventas]);
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
			setdataIngresosxFecha(
				agruparPorGrupoYConcepto(
					aplicarTipoDeCambio(dataTipoTC, totalIngresos),
					dataParametrosGastos.termGastos
				)
			);
			console.log({ ter: dataParametrosGastos.termGastos });
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
