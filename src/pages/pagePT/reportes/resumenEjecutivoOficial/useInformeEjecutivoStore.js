import { PTApi } from '@/common';
import { useState } from 'react';
import { agruparPorMesDiaFechaVenta } from './helpers/agruparPorMesDiaFechaVenta';
import { useSelector } from 'react-redux';
export const useInformeEjecutivoStore = () => {
	const [dataVentas, setdataVentas] = useState({
		dataMembresias: [],
		dataProductos18: [],
		dataProductos17: [],
		dataVentasMap: [],
		dataMFMap: [],
		dataMembresiasRenovaciones: [],
		dataMembresiasReinscripciones: [],
	});
	const [dataLeads, setdataLeads] = useState([]);
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
			console.log(
				{ dataVentasMap },
				sumarMontoTotal(agruparPorMesDiaFechaVenta(dataVentasMap))
			);

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
					fechaP: l.fecha,
				};
			});
			const leadsRed1514 = dataLeadMap.filter((f) => f.id_red === 1514);
			const leadsRed1515 = dataLeadMap.filter((f) => f.id_red === 1515);
			console.log({
				dataPenAusd: sumarMontoTotal(agruparPorMesDiaFechaVenta(dataPenAusd)),
				dataLeadMap,
				// leadsRed1514: sumarMontoTotal(agruparPorMesDiaFechaVenta(leadsRed1514)).map((d) => {
				// 	const TCfecha =
				// 	return {
				// 		montoUSD: d.montoTOTAL,
				// 		montoPEN:
				// 	};
				// }),
				leadsRed1515: sumarMontoTotal(agruparPorMesDiaFechaVenta(leadsRed1515)),
			});

			setdataLeads(data.leads);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerVentas,
		obtenerLeads,
		dataVentas,
		dataLeads,
	};
};

function sumarMontoTotal(data) {
	return data.map((g) => {
		return {
			...g,
			montoTotal: g?.items?.reduce((total, item) => total + (item?.montoTotal || 0), 0),
		};
	});
}
