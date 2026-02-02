import { PTApi } from '@/common';
import { useState } from 'react';
import dayjs, { utc } from 'dayjs';
import { DateMaskString } from '@/components/CurrencyMask';
import { useVentasStore } from '@/hooks/hookApi/useVentasStore';
import { agruparPorGrupoYConcepto, aplicarTipoDeCambio } from '../helpers/agrupamientos';
dayjs.extend(utc);
function formatDateToSQLServerWithDayjs(date, isStart = true) {
	const base = dayjs(date);

	const formatted = isStart
		? base.startOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]')
		: base.endOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]');

	return formatted;
}
export const useFlujoCajaStore = () => {
	const { obtenerVentasPorFecha, dataVentaxFecha } = useVentasStore();
	const [dataIngresos_FC, setdataIngresos_FC] = useState([]);
	const [dataGastosxANIO, setdataGastosxANIO] = useState([]);
	const [dataVentas, setdataVentas] = useState([]);
	const [dataGastosxANIOCIRCUS, setdataGastosxANIOCIRCUS] = useState([]);
	const [dataGastosxANIOSE, setdataGastosxANIOSE] = useState([]);
	const [isLoading, setisLoading] = useState(false);
	const [dataNoPagos, setdataNoPagos] = useState([]);
	const [dataCreditoFiscal, setdataCreditoFiscal] = useState({
		msg: '',
		creditoFiscalAniosAnteriores: 0,
		facturas: [{ igv: 0, mes: 0, anio: 0, monto_final: 0 }],
		ventas: [{ igv: 0, mes: 0, anio: 0, monto_final: 0 }],
	});
	const obtenerIngresosxMes = async (mes, anio) => {
		try {
			const { data } = await PTApi.get('/flujo-caja/ingresos', {
				params: {
					mes,
					anio,
				},
			});

			setdataIngresos_FC(data.data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerGastosxANIO = async (arrayDate, enterprice) => {
		try {
			const { data } = await PTApi.get(`/egreso/fecha-pago/${enterprice}`, {
				params: {
					arrayDate: [
						formatDateToSQLServerWithDayjs(arrayDate[0], true),
						formatDateToSQLServerWithDayjs(arrayDate[1], false),
					],
				},
			});

			const { data: dataParametrosGastos } = await PTApi.get(
				`/terminologia/terminologiaxEmpresa/${enterprice}/1573`
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
			setdataGastosxANIO(
				agruparPorGrupoYConcepto(
					aplicarTipoDeCambio(dataTCs, data.gastos).filter(
						(e) => e.id_estado_gasto === 1423
					),
					dataParametrosGastos.termGastos
				)
			);
			setdataNoPagos(
				agruparPorGrupoYConcepto(
					aplicarTipoDeCambio(dataTCs, data.gastos).filter(
						(e) => e.id_estado_gasto === 1424
					),
					dataParametrosGastos.termGastos
				)
			);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerVentasxANIO = async (anio, enterprice) => {
		try {
			await obtenerVentasPorFecha(
				[
					formatDateToSQLServerWithDayjs(obtenerRangoAnual(anio)[0], true),
					formatDateToSQLServerWithDayjs(obtenerRangoAnual(anio)[1], false),
				],
				enterprice
			);
			const { data: dataMF } = await PTApi.get('/reserva_monk_fit/g');
			const dataMFMap = dataMF.reservasMF.map((mf) => {
				return {
					...mf,
					montoTotal: mf.monto_total,
					fecha: mf.fecha,
					cantidadTotal: 1,
				};
			});
			const claseMembresia = dataVentaxFecha.membresias?.map((membresia) => {
				return {
					concepto: membresia?.membresia?.tb_ProgramaTraining?.name_pgm || '',
					tarifa_monto: membresia?.membresia?.tarifa_monto || '',
					fecha: membresia?.fecha_venta || '',
				};
			});
			const claseProductos = dataVentaxFecha.productos?.map((producto) => {
				return {
					concepto: producto?.producto?.producto?.nombre_producto || '',
					tarifa_monto: producto?.producto?.tarifa_monto || '',
					fecha: producto?.fecha_venta || '',
				};
			});
			const claseServicio = dataVentaxFecha.servicio?.map((producto) => {
				return {
					concepto: producto?.producto?.producto?.nombre_producto || '',
					tarifa_monto: producto?.producto?.tarifa_monto || '',
					fecha: producto?.fecha_venta || '',
				};
			});
			setdataVentas(
				generarVentasOrdenadas(
					[
						{ grupo: 'MEMBRESIAS', data: claseMembresia },
						{ grupo: 'PRODUCTOS', data: claseProductos },
						// { grupo: 'MONKEY FIT', data: [] },
					],
					anio
				)
			);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerCreditoFiscalxANIO = async (anio, enterprice) => {
		try {
			const { data } = await PTApi.get(`/flujo-caja/credito-fiscal/${enterprice}`, {
				params: {
					anio,
				},
			});
			console.log(data);

			setdataCreditoFiscal(data);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerVentasxANIO,
		obtenerIngresosxMes,
		obtenerGastosxANIO,
		obtenerCreditoFiscalxANIO,
		dataIngresos_FC,
		dataCreditoFiscal,
		dataGastosxANIO,
		dataNoPagos,
		dataVentas,
	};
};
