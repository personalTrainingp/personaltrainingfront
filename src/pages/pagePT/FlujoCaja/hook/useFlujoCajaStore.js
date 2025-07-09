import { PTApi } from '@/common';
import { useState } from 'react';
import dayjs from 'dayjs';
import { DateMaskString } from '@/components/CurrencyMask';
import { useVentasStore } from '@/hooks/hookApi/useVentasStore';

function formatDateToSQLServerWithDayjs(date, isStart = true) {
	const base = dayjs(date);

	const formatted = isStart
		? base.startOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]')
		: base.endOf('day').format('YYYY-MM-DD HH:mm:ss.SSS [-05:00]');

	return formatted;
}
function agruparPorProducto(data) {
	const resultado = [];

	data.forEach((item) => {
		const existente = resultado.find((r) => r.concepto === item.concepto);
		if (existente) {
			existente.items.push(item);
		} else {
			resultado.push({
				concepto: item.concepto,
				items: [item],
			});
		}
	});

	return resultado;
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
			console.log(data.data);

			setdataIngresos_FC(data.data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerGastosxANIO = async (anio, enterprice) => {
		try {
			const { data } = await PTApi.get(`/flujo-caja/get-gasto-x-grupo/${enterprice}/${anio}`);

			const { data: dataParametrosGastos } = await PTApi.get(
				`/terminologia/terminologiaxEmpresa/${enterprice}`
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
			// console.log(
			// 	agruparPorMes(claseMembresia),
			// 	dataVentaxFecha,
			// 	agruparPorProducto(claseMembresia).map((membresia) => {
			// 		return { ...membresia, items: agruparPorMes(membresia.items) };
			// 	}),
			// 	agruparPorProducto(claseProductos).map((membresia) => {
			// 		return { ...membresia, items: agruparPorMes(membresia.items) };
			// 	}),
			// 	'aqui ventas?',
			// 	ventasOrdenadas
			// );
			// console.log({
			// 	dataVentaxFecha,
			// 	aniorange: [
			// 		formatDateToSQLServerWithDayjs(obtenerRangoAnual(anio)[0], true),
			// 		formatDateToSQLServerWithDayjs(obtenerRangoAnual(anio)[1], false),
			// 	],
			// 	anio,
			// });
			setdataVentas(
				generarVentasOrdenadas(
					[
						{ grupo: 'MEMBRESIAS', data: claseMembresia },
						{ grupo: 'PRODUCTOS', data: claseProductos },
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
function generarVentasOrdenadas(gruposData, anioFiltro) {
	return gruposData?.map(({ grupo, data }) => {
		const conceptos = agruparPorProducto(data).map((producto) => {
			return {
				...producto,
				items: agruparPorMes(producto.items, anioFiltro),
			};
		});

		const mesesSuma = Array(12).fill(0);
		let totalAnual = 0;

		conceptos.forEach((concepto) => {
			concepto.items.forEach((mesObj, i) => {
				mesesSuma[i] += mesObj.monto_total;
				totalAnual += mesObj.monto_total;
			});
		});

		return {
			grupo,
			conceptos,
			mesesSuma,
			totalAnual,
		};
	});
}

function obtenerRangoAnual(anio) {
	const desde = `${anio}-01-01`;
	const hasta = `${anio}-12-31`;
	return [desde, hasta];
}
function agruparPorMes(data) {
	const agrupado = {};

	data.forEach((item) => {
		const fecha = new Date(item.fecha);
		const anio = fecha.getUTCFullYear();
		const mes = fecha.getUTCMonth() + 1;

		const key = `${anio}-${mes}`;
		if (!agrupado[key]) {
			agrupado[key] = {
				anio,
				mes,
				monto_total: 0,
				items: [],
			};
		}

		agrupado[key].items.push(item);
		agrupado[key].monto_total += item.tarifa_monto || 0;
	});

	// Obtener todos los años presentes
	const añosUnicos = [...new Set(data.map((item) => new Date(item.fecha).getUTCFullYear()))];

	// Generar los 12 meses para cada año
	const resultado = [];
	añosUnicos.forEach((anio) => {
		for (let mes = 1; mes <= 12; mes++) {
			const key = `${anio}-${mes}`;
			if (agrupado[key]) {
				resultado.push(agrupado[key]);
			} else {
				resultado.push({
					anio,
					mes,
					monto_total: 0,
					items: [],
				});
			}
		}
	});

	// Ordenar por año y mes
	resultado.sort((a, b) => a.anio - b.anio || a.mes - b.mes);

	return resultado;
}

function aplicarTipoDeCambio(dataTC, dataGastos) {
	return dataGastos.map((gasto) => {
		const fechaGasto = new Date(gasto.fec_pago);

		const tcMatch = dataTC.find((tc) => {
			if (tc.moneda === gasto.moneda) return false;

			const inicio = new Date(tc.fecha_inicio_tc);
			// Debe ser posterior o igual al inicio
			if (fechaGasto < inicio) return false;

			// Si hay fecha_fin_tc, también debe ser ≤ fin
			if (tc.fecha_fin_tc) {
				const fin = new Date(tc.fecha_fin_tc);
				if (fechaGasto > fin) return false;
			}
			// Si fecha_fin_tc es null, este tramo sigue abierto
			return true;
		});

		const resultado = { tc: 1, ...gasto };
		if (tcMatch) resultado.tc = tcMatch.multiplicador;
		return resultado;
	});
}

function agruparPorGrupoYConcepto(dataGastos, dataGrupos) {
	const meses = Array.from({ length: 12 }, (_, i) => i + 1);

	const gruposMapTemp = {};
	dataGrupos.forEach((entry) => {
		const nombreGrupo = entry.grupo?.trim()?.toUpperCase() || 'SIN GRUPO';
		if (!gruposMapTemp[nombreGrupo]) {
			gruposMapTemp[nombreGrupo] = [];
		}
		gruposMapTemp[nombreGrupo].push(entry);
	});

	// Ordenar los grupos, undefined orden al final
	const gruposOrdenados = Object.entries(gruposMapTemp).sort(([, entradasA], [, entradasB]) => {
		const ordenA = entradasA[0].parametro_grupo?.orden;
		const ordenB = entradasB[0].parametro_grupo?.orden;
		return (ordenA ?? Infinity) - (ordenB ?? Infinity);
	});

	const resultado = gruposOrdenados.map(([grupoNombre, entradasDeGrupo]) => {
		// Ordenar conceptos dentro del grupo, undefined orden al final
		entradasDeGrupo.sort((a, b) => (a.orden ?? Infinity) - (b.orden ?? Infinity));

		const conceptosUnicosPorNombre = [];
		entradasDeGrupo.forEach((c) => {
			const nombreConcepto = c.nombre_gasto?.trim()?.toUpperCase() || 'SIN CONCEPTO';
			if (!conceptosUnicosPorNombre.includes(nombreConcepto)) {
				conceptosUnicosPorNombre.push(nombreConcepto);
			}
		});

		const conceptos = conceptosUnicosPorNombre.map((nombreConcepto) => {
			const itemsDelConcepto = dataGastos.filter((g) => {
				const pg = g.tb_parametros_gasto || {};
				const grupoGasto = pg.grupo?.trim()?.toUpperCase();
				const nombreGasto = pg.nombre_gasto?.trim()?.toUpperCase();
				return grupoGasto === grupoNombre && nombreGasto === nombreConcepto;
			});

			const itemsPorMes = meses.map((mes) => {
				const itemsMes = itemsDelConcepto.filter(
					(item) => dayjs(item.fec_comprobante).month() + 1 === mes
				);
				const monto_total = itemsMes.reduce((sum, g) => sum + (g.monto * g.tc || 0), 0);
				return {
					mes,
					monto_total,
					items: itemsMes,
				};
			});

			return {
				concepto: nombreConcepto,
				items: itemsPorMes,
			};
		});

		return {
			grupo: grupoNombre,
			conceptos,
		};
	});

	return resultado;
}

function agruparPorGrupoYConcepto2(dataGastos, dataGrupos) {
	const meses = Array.from({ length: 12 }, (_, i) => i + 1);

	// 1. Construir un mapa temporal: grupoNombre → [ entradas de dataGrupos ]
	const gruposMapTemp = {};
	dataGrupos.forEach((entry) => {
		const nombreGrupo = entry.grupo?.trim()?.toUpperCase() || 'SIN GRUPO';
		if (!gruposMapTemp[nombreGrupo]) {
			gruposMapTemp[nombreGrupo] = [];
		}
		gruposMapTemp[nombreGrupo].push(entry);
	});

	// 2. Ordenar grupos por parametro_grupo.orden
	const gruposOrdenados = Object.entries(gruposMapTemp).sort(([, a], [, b]) => {
		const ordenA = a[0].parametro_grupo?.orden ?? 0;
		const ordenB = b[0].parametro_grupo?.orden ?? 0;
		return ordenA - ordenB;
	});

	// 3. Generar resultado inicial por grupo y concepto
	const resultado = gruposOrdenados.map(([grupoNombre, entradasDeGrupo]) => {
		entradasDeGrupo.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

		// Nombres únicos de conceptos
		const conceptosUnicos = [];
		entradasDeGrupo.forEach((c) => {
			const nombre = c.nombre_gasto?.trim()?.toUpperCase() || 'SIN CONCEPTO';
			if (!conceptosUnicos.includes(nombre)) conceptosUnicos.push(nombre);
		});

		// Construir items por mes para cada concepto
		const conceptos = conceptosUnicos.map((nombreConcepto) => {
			const itemsDelConcepto = dataGastos.filter((g) => {
				const pg = g.tb_parametros_gasto || {};
				return (
					pg.grupo?.trim()?.toUpperCase() === grupoNombre &&
					pg.nombre_gasto?.trim()?.toUpperCase() === nombreConcepto
				);
			});

			const items = meses.map((mes) => {
				const gastosMes = itemsDelConcepto.filter(
					(g) => dayjs(g.fec_comprobante).month() + 1 === mes
				);
				const monto_total = gastosMes.reduce((sum, g) => sum + (g.monto * g.tc || 0), 0);
				return { mes, monto_total, items: gastosMes };
			});

			return { concepto: nombreConcepto, items };
		});

		return { grupo: grupoNombre, conceptos };
	});

	// 4. Calcular totales generales y de "PRESTAMOS"
	// Encontrar el grupo de PRESTAMOS en resultado
	const prestGroup = resultado.find((r) => r.grupo === 'PRESTAMOS');

	const itemsPrestamos = meses.map((mes) => {
		const monto = prestGroup
			? prestGroup.conceptos.reduce((acc, c) => {
					const it = c.items.find((i) => i.mes === mes);
					return acc + (it?.monto_total || 0);
				}, 0)
			: 0;
		const items = prestGroup
			? prestGroup.conceptos.flatMap((c) => c.items.filter((i) => i.mes === mes))
			: [];
		return { mes, monto_total: monto, items };
	});

	const itemsEgresos = meses.map((mes) => {
		const monto = resultado.reduce((accG, g) => {
			return (
				accG +
				g.conceptos.reduce((accC, c) => {
					const it = c.items.find((i) => i.mes === mes);
					return accC + (it?.monto_total || 0);
				}, 0)
			);
		}, 0);
		const items = resultado.flatMap((g) =>
			g.conceptos.flatMap((c) => c.items.filter((i) => i.mes === mes))
		);
		return { mes, monto_total: monto, items };
	});

	// Agregar nuevo grupo 'MES' con totales
	resultado.push({
		grupo: 'MES',
		conceptos: [
			{ concepto: 'TOTAL EGRESOS', items: itemsEgresos },
			{ concepto: 'TOTAL PRESTAMOS', items: itemsPrestamos },
		],
	});

	console.log({ resultado });
	return resultado;
}

function estructurarParaDetalle(dataOriginal) {
	return dataOriginal.map((item) => {
		const fecha = new Date(item.fec_pago || item.fec_comprobante || item.fec_registro);
		const mes = fecha.getMonth() + 1; // getMonth() retorna 0-11
		return {
			mes,
			concepto: 'CUENTAS POR PAGAR',
			grupo: 'CUENTAS POR PAGAR',
			monto: item.monto,
			items: [item],
			moneda: item.moneda,
			forma_pago: item.parametro_forma_pago?.label_param || '',
			banco: item.parametro_banco?.label_param || '',
			proveedor: item.tb_Proveedor?.razon_social_prov || '',
			comprobante: item.parametro_comprobante?.label_param || '',
			n_comprobante: item.n_comprabante,
		};
	});
}
