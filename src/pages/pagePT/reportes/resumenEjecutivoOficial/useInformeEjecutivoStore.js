import { PTApi } from '@/common';
import { useState } from 'react';
import { agruparPorMesDiaFechaVenta } from './helpers/agruparPorMesDiaFechaVenta';
import { useSelector } from 'react-redux';
import { agruparPorEmpleado } from './Pages/ComparativoDiaxDia/helpers/agruparDiasEnMes';
import { generarMesYanio } from './helpers/generarMesYanio';
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
	});
	const [dataSeguimientos, setdataSeguimientos] = useState([]);
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
	const obtenerSeguimientos = async () => {
		try {
			const { data } = await PTApi.get('/seguimiento/');
			console.log({ data });
			const dataAlter = data.dataSeguimiento.map((m) => {
				const fecha_venta = {
					dia: new Date(m.venta.tb_ventum.fecha_venta).getDate(),
					mes: new Date(m.venta.tb_ventum.fecha_venta).getMonth() + 1,
					anio: new Date(m.venta.tb_ventum.fecha_venta).getFullYear(),
				};
				const fecha_vencimiento = {
					dia: new Date(m.fecha_vencimiento).getDate(),
					mes: new Date(m.fecha_vencimiento).getMonth() + 1,
					anio: new Date(m.fecha_vencimiento).getFullYear(),
				};
				return {
					id_cli: m.id_cli,
					fecha_venta,
					fecha_vencimiento,
					sesiones_pendientes: m.sesiones_pendientes,
				};
			});
			const dataMesesYanio = generarMesYanio(
				'2024-09-01 15:45:47.6640000 +00:00',
				`${new Date().getFullYear()}-12-15 15:45:47.6640000 +00:00`
			);
			const grupos = agruparYOrdenar(dataAlter);

			const relaciones = generarRelaciones(grupos);

			const tabla = construirTabla(relaciones, dataMesesYanio);
			setdataSeguimientos(tabla);
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
const agruparYOrdenar = (data = []) => {
	const grupos = {};

	data.forEach((item) => {
		if (!grupos[item.id_cli]) grupos[item.id_cli] = [];
		grupos[item.id_cli].push(item);
	});

	// ordenar por fecha_venta
	Object.values(grupos).forEach((arr) => {
		arr.sort((a, b) => {
			const f1 = new Date(a.fecha_venta.anio, a.fecha_venta.mes - 1, a.fecha_venta.dia);
			const f2 = new Date(b.fecha_venta.anio, b.fecha_venta.mes - 1, b.fecha_venta.dia);
			return f1 - f2;
		});
	});

	return grupos;
};
const generarRelaciones = (grupos) => {
	const relaciones = [];

	Object.values(grupos).forEach((arr) => {
		for (let i = 0; i < arr.length; i++) {
			const actual = arr[i];
			const siguiente = arr[i + 1];

			const vencimiento = getKey(actual.fecha_vencimiento);

			const siguienteVenta = siguiente ? getKey(siguiente.fecha_venta) : 'SIN_SIGUIENTE';

			relaciones.push({
				vencimiento,
				siguienteVenta,
				item: actual,
			});
		}
	});

	return relaciones;
};

const construirTabla = (relaciones, dataMesesYanio) => {
	const tabla = {};

	// columnas (eje X)
	const columnas = [...dataMesesYanio.map((d) => d.fecha), 'SIN_SIGUIENTE'];

	// filas (eje Y)
	const filas = dataMesesYanio.map((d) => d.fecha);

	// inicializar estructura
	filas.forEach((fila) => {
		tabla[fila] = {};
		columnas.forEach((col) => {
			tabla[fila][col] = {
				cantidad: 0,
				items: [],
			};
		});
	});

	// llenar data
	relaciones.forEach((r) => {
		if (!tabla[r.vencimiento]) return; // fuera de rango

		const col = tabla[r.vencimiento][r.siguienteVenta];
		if (!col) return;

		col.cantidad++;
		col.items.push(r.item);
	});

	return { filas, columnas, data: tabla };
};
