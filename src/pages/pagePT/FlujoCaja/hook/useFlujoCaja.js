import { PTApi } from '@/common';
import dayjs from 'dayjs';
import { useState } from 'react';
import { agruparPorGrupoYConcepto } from '../helpers/agrupamientosOficiales';
import { dataIngresosOrden } from '@/helper/dataIngresosOrden';
import { formatDateToSQLServerWithDayjs } from '@/helper/formatDateToSQLServerWithDayjs';
import { obtenerTipoDeCambio } from '@/middleware/obtenerTipoDeCambio';
import { aplicarTipoDeCambio } from '@/helper/aplicarTipoCambio';

export const useFlujoCaja = () => {
	const [dataGastosxFecha, setdataGastosxFecha] = useState([]);
	const [dataIngresosxFecha, setdataIngresosxFecha] = useState([]);
	const obtenerEgresosxFecha = async (enterprice, arrayDate) => {
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
					fecha_primaria: g.fecha_comprobante,
					...g,
				};
			});
			const { data: dataParametrosGastos } = await PTApi.get(
				`/terminologia/terminologiaxEmpresa/${enterprice}/1573`
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
				`/terminologia/terminologiaxEmpresa/${enterprice}/1574`
			);
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
			setdataIngresosxFecha(
				agruparPorGrupoYConcepto(
					[
						...dataV.dataMembresias,
						...dataV.dataProductos17,
						...dataV.dataProductos18,
						...dataIngresos.ingresos,
						...reservasMFMAP,
					],
					dataParametrosGastos.termGastos
				)
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
