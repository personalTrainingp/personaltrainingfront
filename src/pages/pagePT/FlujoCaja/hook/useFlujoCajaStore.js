import { PTApi } from '@/common';
import { useState } from 'react';
import {
	agruparPorGrupoYConcepto,
	agruparPorGrupoYConcepto2,
} from '../helpers/agrupamientosOficiales';
import { dataIngresosOrden } from '@/helper/dataIngresosOrden';
import { formatDateToSQLServerWithDayjs } from '@/helper/formatDateToSQLServerWithDayjs';
import { obtenerTipoDeCambio } from '@/middleware/obtenerTipoDeCambio';
import { aplicarTipoDeCambio } from '@/helper/aplicarTipoCambio';
import { usePagosVentasStore } from './usePagosVentasStore';

export const useFlujoCaja = () => {
	const [dataGastosxFecha, setdataGastosxFecha] = useState({
		items: [],
		flujoxGrupo: [],
		terminologiasUsadas: [],
	});
	const [dataIngresosxFecha, setdataIngresosxFecha] = useState({
		items: [],
		flujoxGrupo: [],
		terminologiasUsadas: [],
	});
	const [dataFlujoCaja, setdataFlujoCaja] = useState([]);
	const [dataParametrosGastos, setdataParametrosGastos] = useState([]);
	const { dataPagosVentas, obtenerPagosVentas } = usePagosVentasStore();
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
			const dataGastos = data.gastos
				.filter((f) => f.id_gasto !== 1053)
				.map((g) => {
					return {
						fecha_primaria: new Date(
							new Date(g.fecha_comprobante).setUTCHours(14, 0, 0, 0)
						).toISOString(),
						...g,
					};
				});
			await obtenerPagosVentas();
			const dataGastosOperadoresVentas = dataPagosVentas
				.filter((item) => {
					const fechaItem = new Date(item.fecha_p);
					return (
						fechaItem >= new Date(arrayDate[0]) && fechaItem <= new Date(arrayDate[1])
					);
				})
				.map((m) => {
					return {
						monto_venta: m.pago?.parcial_monto,
						monto: m.pago?.parcial_monto * (m.porcentaje / 100) * 1.18,
						tb_Proveedor: {
							razon_social_prov: 'OPENPAY',
							parametro_oficio: {
								label_param: 'COMISION',
							},
						},
						n_operacion: '111',
						n_comprabante: '000',
						banco: m.pago?.parametro_banco?.label_param,
						descripcion: m.pago?.parametro_banco?.label_param,
						fecha_comprobante: new Date(
							new Date(m.fecha_venta).setUTCHours(14, 0, 0, 0)
						).toISOString(),
						fecha_pago: new Date(
							new Date(m.fecha_venta).setUTCHours(14, 0, 0, 0)
						).toISOString(),
						parametro_comprobante: {
							label_param: 'VENTA',
						},
						moneda: 'PEN',
						fecha_primaria: new Date(
							new Date(m.fecha_venta).setUTCHours(14, 0, 0, 0)
						).toISOString(),
						id_gasto: obtenerGasto(
							m.pago.id_operador,
							m.pago.id_forma_pago,
							m.pago.n_cuotas,
							m.pago.es_nacional
						)?.concepto,
						id_estado_gasto: 1423,
						tb_parametros_gasto: {
							parametro_grupo: {
								id: obtenerGasto(
									m.pago.id_operador,
									m.pago.id_forma_pago,
									m.pago.n_cuotas,
									m.pago.es_nacional
								)?.grupo,
							},
						},
						...m,
					};
				});

			const dataTipoTC = await obtenerTipoDeCambio();
			const { data: dataParametrosGastos } = await PTApi.get(
				`/terminologia/grupo-y-concepto/${enterprice}/1573`
			);
			const dataGastosEnTotal = [...dataGastos, ...dataGastosOperadoresVentas].map((m) => {
				const fechaPrimaria = new Date(m.fecha_primaria);
				const mesP = fechaPrimaria.getUTCMonth() + 1;
				const anioP = fechaPrimaria.getUTCFullYear();
				const diaP = fechaPrimaria.getUTCDate();
				return {
					fechaP: { anioP, mesP, diaP },
					...m,
				};
			});
			setdataGastosxFecha({
				flujoxGrupo: agruparPorGrupoYConcepto(
					aplicarTipoDeCambio(dataTipoTC, dataGastosEnTotal),
					dataParametrosGastos.termGastos
				),
				items: aplicarTipoDeCambio(dataTipoTC, dataGastosEnTotal),
				terminologiasUsadas: dataParametrosGastos.termGastos,
			});
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerParametrosGastos = async (enterprice, identificador = 1573) => {
		try {
			const { data: dataParametrosGastos } = await PTApi.get(
				`/terminologia/grupo-y-concepto/${enterprice}/${identificador}`
			);
			setdataParametrosGastos(dataParametrosGastos.termGastos);
		} catch (error) {
			console.log({ error });
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
					id_gasto: i.id_gasto,
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
				const fechaPrimaria = new Date(f.fecha_primaria);
				const mesP = fechaPrimaria.getUTCMonth() + 1;
				const anioP = fechaPrimaria.getUTCFullYear();
				const diaP = fechaPrimaria.getUTCDate();
				return {
					fechaP: { anioP, mesP, diaP },
					id_estado_gasto: 1423,
					...f,
				};
			});
			setdataIngresosxFecha({
				flujoxGrupo: agruparPorGrupoYConcepto(
					aplicarTipoDeCambio(dataTipoTC, totalIngresos),
					dataParametrosGastos.termGastos
				),
				items: aplicarTipoDeCambio(dataTipoTC, totalIngresos),
				terminologiasUsadas: dataParametrosGastos.termGastos,
			});
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerFlujoCaja = async (enterprice, arrayDate) => {
		try {
			const { data } = await PTApi.get(`/flujo-caja/fecha-comprobante/${enterprice}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});
			const dataFlujoCaja = data.data.map((m) => {
				return {
					...m,
					fecha_primaria: m.fecha_comprobante,
				};
			});
			const { data: dataParametrosGastos } = await PTApi.get(
				`/terminologia/grupo-y-concepto/${enterprice}/1573`
			);
			setdataFlujoCaja(
				agruparPorGrupoYConcepto2(dataFlujoCaja, dataParametrosGastos.termGastos, 2026)
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
		obtenerParametrosGastos,
		dataParametrosGastos,
		obtenerFlujoCaja,
		dataFlujoCaja,
	};
};

function obtenerGasto(id_operador, id_forma_pago, n_cuotas, es_nacional) {
	if (!es_nacional) {
		if (id_operador === 1739) {
			return {
				grupo: 155,
				concepto: 1280,
			};
		}
	}
	switch (`${id_operador}-${id_forma_pago}-${n_cuotas}`) {
		case '1739-1743-0': //OPENPAY - TARJETA
			return {
				grupo: 155,
				concepto: 1278,
			};
		case '1739-1743-3': //OPENPAY - TARJETA
			return {
				grupo: 155,
				concepto: 1283,
			};
		case '1739-1743-6': //OPENPAY - TARJETA
			return {
				grupo: 155,
				concepto: 1282,
			};
		case '1739-1471-0': //OPENPAY - QR
			return {
				grupo: 155,
				concepto: 1281,
			};
		default:
			break;
	}
}
