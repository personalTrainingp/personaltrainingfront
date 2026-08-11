import { PTApi } from '@/common';
import { useState } from 'react';
import {
	agruparPorMesDiaFechaVenta,
	agruparPorMesDiaFechaVenta1,
} from './helpers/agruparPorMesDiaFechaVenta';
import { useSelector } from 'react-redux';
import { agruparPorEmpleado } from './Pages/ComparativoDiaxDia/helpers/agruparDiasEnMes';
import { generarMesYanio } from './helpers/generarMesYanio';
import { DateMaskStr, DateMaskStr1 } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
export const useInformeEjecutivoStore = () => {
	const [dataVentas, setdataVentas] = useState({
		dataMembresias: [],
		dataProductos18: [],
		dataProductos17: [],
		dataVentasMap: [],
		dataMFMap: [],
		dataMembresiasRenovaciones: [],
		dataMembresiasReinscripciones: [],
		dataMembresiasNuevos: [],
		renovacionesxEmpl: [],
		dataSeguimientos: [],
	});
	const [dataSeguimientos, setdataSeguimientos] = useState([]);
	const [dataLeads, setdataLeads] = useState({ leadsRed1514: [], leadsRed1515: [] });
	const obtenerVentas = async () => {
		try {
			const { data } = await PTApi.get('/venta/get-ventas/598');
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
						id_pgm: v?.detalle_membresias[0]?.id_pgm,
						cantidadTotal: 1,
					};
				})
				.filter((f) => f.montoTotal !== 0);

			const dataMembresiasRenovaciones = dataVentasMap
				.filter((dventa) => dventa.detalle_membresias.length !== 0)
				.map((v) => {
					return {
						...v,
						montoTotal: v.detalle_membresias[0]?.tarifa_monto,
						cantidadTotal: 1,
					};
				})
				.filter((f) => f.montoTotal !== 0)
				.filter((d) => d.id_origen === 691);

			const dataMembresiasReinscripciones = dataVentasMap
				.filter((dventa) => dventa.detalle_membresias.length !== 0)
				.map((v) => {
					return {
						...v,
						montoTotal: v.detalle_membresias[0]?.tarifa_monto,
						cantidadTotal: 1,
					};
				})
				.filter((f) => f.montoTotal !== 0)
				.filter((d) => d.id_origen === 692);

			const dataMembresiasNuevos = dataVentasMap
				.filter((dventa) => dventa.detalle_membresias.length !== 0)
				.map((v) => {
					return {
						...v,
						montoTotal: v.detalle_membresias[0]?.tarifa_monto,
						cantidadTotal: 1,
					};
				})
				.filter((f) => f.montoTotal !== 0)
				.filter((d) => d.id_origen !== 692 && d.id_origen !== 691);
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
			const renovacionesxEmpl = agruparPorEmpleado(dataMembresiasRenovaciones);
			setdataVentas({
				dataMembresias: sumarMontoTotal(agruparPorMesDiaFechaVenta(dataMembresias)),
				dataProductos17: sumarMontoTotal(agruparPorMesDiaFechaVenta(dataProductos17)),
				dataProductos18: sumarMontoTotal(agruparPorMesDiaFechaVenta(dataProductos18)),
				dataVentasMap: sumarMontoTotal(agruparPorMesDiaFechaVenta(dataVentasMap)),
				dataMFMap: sumarMontoTotal(agruparPorMesDiaFechaVenta(dataMFMap)),
				dataMembresiasRenovaciones: sumarMontoTotal(
					agruparPorMesDiaFechaVenta(dataMembresiasRenovaciones)
				),
				dataMembresiasReinscripciones: sumarMontoTotal(
					agruparPorMesDiaFechaVenta(dataMembresiasReinscripciones)
				),
				dataMembresiasNuevos: sumarMontoTotal(
					agruparPorMesDiaFechaVenta(dataMembresiasNuevos)
				),
				renovacionesxEmpl,
			});
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerLeads = async () => {
		try {
			const { data } = await PTApi.get('/lead/leads/598');
			const { data: dataTC } = await PTApi.get('/tipoCambio/');
			const dataPenAusd = dataTC.tipoCambios
				.filter((f) => f.monedaOrigen === 'USD' && f.monedaDestino === 'PEN')
				.map((d) => {
					return {
						montoTotal: d.precio_compra,
						fechaP: d.fecha,
						...d,
					};
				});
			const dataLeadMap = data.leads.map((l) => {
				return {
					...l,
					montoTotal: l.monto,
					cantidad: Number(l.cantidad),
					fechaP: new Date(l.fecha),
				};
			});
			const leadsRed1514 = dataLeadMap.filter((f) => f.id_red === 1514);
			const leadsRed1515 = dataLeadMap.filter((f) => f.id_red === 1515);
			console.log({
				dataPenAusd: sumarMontoTotal(agruparPorMesDiaFechaVenta(dataPenAusd)),
				dataLeadMap,
				leadsRed1515: sumarMontoTotal(agruparPorMesDiaFechaVenta(leadsRed1515)),
			});

			setdataLeads({
				leadsRed1514: sumarMontoTotal(agruparPorMesDiaFechaVenta1(leadsRed1514)).map(
					(m) => {
						return { ...m, cantidadTotal: m.items[0].cantidad };
					}
				),
				leadsRed1515: sumarMontoTotal(agruparPorMesDiaFechaVenta1(leadsRed1515)).map(
					(m) => {
						return { ...m, cantidadTotal: m.items[0].cantidad };
					}
				),
			});
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerSeguimientos = async () => {
		try {
			const { data: dataSeguimiento } = await PTApi.get('/seguimiento/');
			const dataAlter = dataSeguimiento.dataSeguimiento
				.map((m) => {
					const ultimaMembresia = m?.cli_seguimiento.sort(
						(a, b) => b.id_membresia - a.id_membresia
					)[0];
					const ultimoPrograma =
						ultimaMembresia.venta?.cambio_programa?.length === 0
							? ultimaMembresia.venta?.tb_ProgramaTraining.name_pgm
							: ultimaMembresia.venta?.cambio_programa?.[0].pgm.name_pgm;
					const ultimoHorario =
						ultimaMembresia.venta?.cambio_programa?.length === 0
							? ultimaMembresia.venta?.horario
							: ultimaMembresia.venta?.horario;
					return {
						horario:
							ultimaMembresia.venta.horario.split('T')[1].split('.')[0] || `12:00:00`,
						nombre_programa: `${ultimoPrograma}`,
						nombres_cli: m.nombre_cli,
						apPaterno_cli: m.apPaterno_cli,
						apMaterno_cli: m.apMaterno_cli,
						email_cli: m.email_cli,
						tel_cli: m.tel_cli,
						nombres_apellidos_cli: `${m.nombre_cli} ${m.apPaterno_cli} ${m.apMaterno_cli}`,
						id_cli: m.id_cli,
						fecha_inicio: ultimaMembresia?.venta?.fecha_inicio,
						ultimoPrograma: ultimoPrograma,
						...m.cli_seguimiento[0],
						fecha_vencimiento_: DateMaskStr1(ultimaMembresia.fecha_vencimiento),
						fecha_vencimiento: ultimaMembresia.fecha_vencimiento,
					};
				})
				.map((m) => {
					return {
						...m,
						countDias: diasEntreFechas(
							DateMaskStr1(new Date()),
							DateMaskStr1(m.fecha_vencimiento_)
						),
						fecha_vencimiento_: DateMaskStr(
							m?.fecha_vencimiento_,
							'dddd DD [DE] MMMM [DEL] YYYY'
						),
					};
				});
			// filtrarPorFechaVencimiento(dataAlter, '2026-08-02', 'mas')
			setdataSeguimientos(dataAlter);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerSeguimientos,
		obtenerVentas,
		obtenerLeads,
		dataVentas,
		dataSeguimientos,
		dataLeads,
	};
};

const diasEntreFechas = (inicio, fin) => {
	const f1 = dayjs(inicio).startOf('day');
	const f2 = dayjs(fin).startOf('day');

	const diff = f2.diff(f1, 'day');

	if (diff === 0) return 1;

	return diff > 0 ? diff + 1 : diff - 1;
};

export function sumarMontoTotal(data) {
	return data.map((g) => {
		return {
			...g,
			montoTotal: g?.items?.reduce((total, item) => total + (item?.montoTotal || 0), 0),
		};
	});
}
const getKey = (f) => {
	return `${f.anio}-${f.mes}`;
};

export function filtrarPorFechaVencimiento(data, fecha_inicio, fecha_fin) {
	const inicio = new Date(fecha_inicio).getTime();
	const fin = new Date(fecha_fin).getTime();

	return data.filter((item) => {
		if (!item.fecha_vencimiento) return false;
		const fechaItem = new Date(item.fecha_vencimiento).getTime();
		return fechaItem >= inicio && fechaItem <= fin;
	});
}
