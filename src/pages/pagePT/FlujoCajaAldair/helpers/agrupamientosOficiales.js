import { DateMaskStr1 } from '@/components/CurrencyMask';
import { generarMesYanio } from './generarMesYanio';

export function aplicarTipoDeCambio(dataTC, data) {
	return data?.map((item) => {
		const fechaGasto = DateMaskStr1(item.fecha_primaria);

		const tcMatch = dataTC.find((tc) => {
			if (tc.moneda === item.moneda) return false;

			const inicio = DateMaskStr1(tc.fecha_inicio_tc);
			// Debe ser posterior o igual al inicio
			if (fechaGasto < inicio) return false;

			// Si hay fecha_fin_tc, también debe ser ≤ fin
			if (tc.fecha_fin_tc) {
				const fin = DateMaskStr1(tc.fecha_fin_tc);
				if (fechaGasto > fin) return false;
			}
			// Si fecha_fin_tc es null, este tramo sigue abierto
			return true;
		});

		const resultado = { tc: 1, ...item };
		if (tcMatch) resultado.tc = tcMatch.multiplicador;
		return resultado;
	});
}
const fecha = new Date();
const anioActual = fecha.getFullYear();
const dateActual = fecha.getDate();
const mesActual = fecha.getMonth();

export const agruparPorGrupoYConcepto = (dataGastos = [], dataGrupos = [], anio = 2026) => {
	const itemsXdiaGenerado = generarMesYanio(
		new Date('2026-01-15T00:00:00.000Z'),
		new Date('2026-12-15T00:00:00.000Z')
	);
	const resultado = dataGrupos?.map((m) => {
		const gastos = dataGastos?.filter(
			(f) => f?.tb_parametros_gasto?.parametro_grupo?.id === m.id
		);
		return {
			...m,
			parametro_grupo_gasto: m?.parametro_grupo_gasto
				?.map((f) => {
					const gast = gastos?.filter((g) => g?.id_gasto === f.id);
					const agrupadoxDia = agruparPorDia(gast);
					const itemsXdia = itemsXdiaGenerado.map((g) => {
						const ItemsGastosAgrupados =
							agrupadoxDia.find((f) => Number(f.mes) === Number(g.mes))?.items || [];
						const gastos_antes_mesActual =
							agrupadoxDia
								.filter((f) => Number(f.mes) < Number(g.mes))
								.flatMap((e) => e.items) || [];
						const gastos_antes_mesActual_costos_sin_cero =
							agrupadoxDia
								.filter((f) => f.items.length !== 0)
								.flatMap((e) => e.items) || [];
						const sumaGastos_Total_menos_mesActual = gastos_antes_mesActual.reduce(
							(total, item) => item.monto + total,
							0
						);
						const itemsPagados =
							agrupadoxDia
								.find((f) => f.mes === g.mes)
								?.items.filter((e) => e?.id_estado_gasto === 1423) || [];
						const itemsNoPagados =
							agrupadoxDia
								.find((f) => f.mes === g.mes)
								?.items.filter((e) => e?.id_estado_gasto === 1424) || [];
						const monto_pro = f.sin_limite
							? f.isPromediado
								? sumaGastos_Total_menos_mesActual /
										gastos_antes_mesActual_costos_sin_cero.length || 0
								: f.monto_proyectado
							: new Date(f.fecha_inicio).getUTCMonth() + 1 <= Number(g.mes)
								? f.monto_proyectado
								: 0;
						const monto = ItemsGastosAgrupados.reduce(
							(total, item) => item.monto + total,
							0
						);
						const monto_proyectado =
							dateActual >= 7
								? mesActual + 1 === Number(g.mes)
									? monto_pro - monto
									: 0
								: mesActual + 1 === Number(g.mes) || mesActual === Number(g.mes)
									? monto_pro - monto
									: 0;

						const es_promedio =
							new Date(f.fecha_inicio).getUTCMonth() + 1 <= Number(g.mes)
								? f.isPromediado
								: false;
						return {
							sumaGastos_Total_menos_mesActual,
							nombre_grupo: m.param_label,
							orden_grupo: m.orden,
							gastos_antes_mesActual,
							monto_total_menos_mesActual:
								sumaGastos_Total_menos_mesActual / Number(g.mes - 1),
							isPromediado: es_promedio,
							ItemsGastosAgrupados,
							monto: monto,
							items_pagados: itemsPagados,
							itemsNoPagados: itemsNoPagados,
							monto_pagados: itemsPagados.reduce(
								(total, item) => item.monto + total,
								0
							),
							monto_no_pagados: itemsNoPagados.reduce(
								(total, item) => item.monto + total,
								0
							),
							len: ItemsGastosAgrupados.length,
							monto_proyectado:
								monto_proyectado <= 0 ? 0 : Number(monto_proyectado || 0) || 0,
							monto_pro: monto_pro - monto <= 0 ? 0 : monto_pro - monto,
							gast,
							...g,
						};
					});
					return {
						id: f.id,
						nombre_grupo: m.param_label,
						id_grupo: m.id,
						orden_grupo: m.orden,
						orden: f.orden,
						fecha_inicio: f.fecha_inicio,
						fecha_fin: f.fecha_fin,
						sin_limite: f.sin_limite,
						tipo: f.tipo,
						nombre_gasto: f.nombre_gasto,
						gasto: gast,
						len: gast.length,
						monto_pro: itemsXdia.reduce((total, item) => total + item.monto_pro, 0),
						monto_proyectado: itemsXdia.reduce(
							(total, item) => total + item.monto_proyectado,
							0
						),
						monto_pagado: itemsXdia.reduce(
							(total, item) => total + item.monto_pagados,
							0
						),
						monto_no_pagado: itemsXdia.reduce(
							(total, item) => total + item.monto_no_pagados,
							0
						),
						monto: itemsXdia.reduce((total, item) => total + item.monto, 0),
						itemsxDia: itemsXdia,
						agrupadoxDia,
					};
				})
				.sort((a, b) => a.orden - b.orden),
			itemsxDia: agruparPorDia(gastos).map((m) => {
				return {
					monto: m.items?.reduce((total, item) => item.monto + total, 0),
					len: m.items?.length,
					...m,
				};
			}),
			gastos,
		};
	});

	return resultado;
};

export const agruparConceptos = (dataGrupos, anio = 2026, mes = 12) => {
	const anioActual = anio;
	const fechas = [
		new Date(`${anioActual}-${mes}-15T00:00:00.000Z`),
		new Date(`${anioActual}-${mes}-15T00:00:00.000Z`),
	];
	const resultado = dataGrupos?.map((m) => {
		return {
			...m,
			parametro_grupo_gasto: m?.parametro_grupo_gasto?.map((f) => {
				const itemsXdia = generarMesYanio(fechas[0], fechas[1]).map((g) => {
					const monto_proyectado = f.sin_limite
						? f.monto_proyectado
						: new Date(f.fecha_inicio).getMonth() + 1 < g.mes
							? f.monto_proyectado
							: 0.0;
					return {
						monto_proyectado,
						...g,
					};
				});
				return {
					id: f.id,
					fechas,
					mes,
					anioActual,
					monto_proyectado: f.monto_proyectado,
					fecha_inicio: f.fecha_inicio,
					fecha_fin: f.fecha_fin,
					sin_limite: f.sin_limite,
					tipo: f.tipo,
					nombre_gasto: f.nombre_gasto,
					itemsxDia: itemsXdia,
					monto_proyectado: itemsXdia.reduce(
						(total, item) => total + item.monto_proyectado,
						0
					),
					monto_pagado: itemsXdia.reduce((total, item) => total + item.monto_pagados, 0),
					monto_no_pagado: itemsXdia.reduce(
						(total, item) => total + item.monto_no_pagados,
						0
					),
					monto: itemsXdia.reduce((total, item) => total + item.monto, 0),
				};
			}),
		};
	});
	return resultado;
};
export function agruparPorDia(data) {
	const map = {};

	data.forEach((item) => {
		// const fecha = dayjs.utc(item.fecha_venta);
		const fecha = DateMaskStr1(item?.fecha_primaria);

		const anio = fecha.year();
		const mes = fecha.month() + 1; // 0–11 → 1–12
		// const dia = fecha.date();

		const key = fecha.format('YYYY-MM');

		if (!map[key]) {
			map[key] = {
				anio,
				mes,
				// dia,
				items: [],
			};
		}

		map[key].items.push(item);
	});

	return Object.values(map).sort((a, b) => a?.mes - b?.mes);
}
export const agruparPorGrupoYConcepto2 = (dataGastos = [], dataGrupos = [], anio = 2026) => {
	const itemsXdiaGenerado = generarMesYanio(
		new Date('2026-01-15T00:00:00.000Z'),
		new Date('2026-12-15T00:00:00.000Z')
	);

	// ✅ Pre-indexar gastos por grupo UNA sola vez (antes era dentro del .map())
	const gastosPorGrupoGlobal = dataGastos.reduce((acc, gasto) => {
		const idGrupo = gasto?.tb_parametros_gasto?.parametro_grupo?.id;
		if (!acc[idGrupo]) acc[idGrupo] = [];
		acc[idGrupo].push(gasto);
		return acc;
	}, {});

	const resultado = dataGrupos.map((m) => {
		const gastos = gastosPorGrupoGlobal[m.id] || [];

		// ✅ Pre-indexar gastos por concepto UNA vez por grupo
		const gastosPorConcepto = gastos.reduce((acc, gasto) => {
			if (!acc[gasto.id_concepto]) acc[gasto.id_concepto] = [];
			acc[gasto.id_concepto].push(gasto);
			return acc;
		}, {});

		const parametro_grupo_gasto = m?.parametro_grupo_gasto
			?.map((f) => {
				const gast = gastosPorConcepto[f.id] || [];
				const agrupadoxDia = agruparPorDia(gast);

				// ✅ Convertir a Map para O(1) en lugar de .find() × 12 veces
				const agrupadoxDiaMap = new Map(agrupadoxDia.map((g) => [g.mes, g]));

				// ✅ Precalcular sumas acumuladas por mes (prefijo) en una sola pasada
				// agrupadoxDia ya está ordenado por mes
				const sumaAcumuladaAntesDeMes = new Map();
				let acumulado = 0;
				for (const grupo of agrupadoxDia) {
					sumaAcumuladaAntesDeMes.set(grupo.mes, acumulado);
					acumulado += grupo.items.reduce((t, item) => t + item.monto, 0);
				}

				const fechaInicioMes = new Date(f.fecha_inicio).getUTCMonth() + 1;

				const itemsXdia = itemsXdiaGenerado.map((g) => {
					const mesNum = Number(g.mes);
					const grupoMes = agrupadoxDiaMap.get(mesNum);
					const ItemsGastosAgrupados = grupoMes?.items || [];

					// ✅ Suma acumulada de meses anteriores desde el prefijo precalculado (O(1))
					const sumaGastos_Total_menos_mesActual =
						sumaAcumuladaAntesDeMes.get(mesNum) ?? acumulado;

					// ✅ Fusionar los dos .filter() en un solo .reduce()
					const { pagados: itemsPagados, noPagados: itemsNoPagados } =
						ItemsGastosAgrupados.reduce(
							(acc, e) => {
								if (e?.id_estado_gasto === 1423) acc.pagados.push(e);
								else if (e?.id_estado_gasto === 1424) acc.noPagados.push(e);
								return acc;
							},
							{ pagados: [], noPagados: [] }
						);

					const monto = ItemsGastosAgrupados.reduce((t, item) => t + item.monto, 0);

					const monto_pro = f.sin_limite
						? f.isPromediado
							? sumaGastos_Total_menos_mesActual /
									(mesNum === fechaInicioMes
										? sumaGastos_Total_menos_mesActual
										: mesNum - fechaInicioMes) || 0
							: f.monto_proyectado
						: fechaInicioMes <= mesNum
							? f.monto_proyectado
							: 0;

					const monto_proyectado =
						dateActual > 7
							? mesActual + 1 === mesNum
								? monto_pro - monto
								: 0
							: mesActual + 1 === mesNum || mesActual === mesNum
								? monto_pro - monto
								: 0;

					const es_promedio = fechaInicioMes <= mesNum ? f.isPromediado : false;

					const monto_pagados = itemsPagados.reduce((t, item) => t + item.monto, 0);
					const monto_no_pagados = itemsNoPagados.reduce((t, item) => t + item.monto, 0);
					const monto_pro_final = monto_pro - monto <= 0 ? 0 : monto_pro - monto;
					const monto_proyectado_final =
						monto_proyectado <= 0 ? 0 : Number(monto_proyectado || 0) || 0;

					return {
						sumaGastos_Total_menos_mesActual,
						nombre_grupo: m.param_label,
						orden_grupo: m.orden,
						gastos_antes_mesActual: null, // ✅ evitar flatMap costoso; calcular bajo demanda si se necesita
						monto_total_menos_mesActual:
							sumaGastos_Total_menos_mesActual / Number(g.mes - 1),
						isPromediado: es_promedio,
						ItemsGastosAgrupados,
						monto,
						items_pagados: itemsPagados,
						itemsNoPagados,
						monto_pagados,
						monto_no_pagados,
						len: ItemsGastosAgrupados.length,
						monto_proyectado: monto_proyectado_final,
						monto_pro: monto_pro_final,
						gast,
						...g,
					};
				});

				// ✅ Calcular totales en una sola pasada sobre itemsXdia
				let total_monto_pro = 0,
					total_monto_proyectado = 0,
					total_monto_pagado = 0,
					total_monto_no_pagado = 0,
					total_monto = 0;

				for (const item of itemsXdia) {
					total_monto_pro += item.monto_pro;
					total_monto_proyectado += item.monto_proyectado;
					total_monto_pagado += item.monto_pagados;
					total_monto_no_pagado += item.monto_no_pagados;
					total_monto += item.monto;
				}

				return {
					id: f.id,
					nombre_grupo: m.param_label,
					id_grupo: m.id,
					orden_grupo: m.orden,
					orden: f.orden,
					fecha_inicio: f.fecha_inicio,
					fecha_fin: f.fecha_fin,
					sin_limite: f.sin_limite,
					tipo: f.tipo,
					nombre_gasto: f.nombre_gasto,
					gasto: gast,
					len: gast.length,
					monto_pro: total_monto_pro,
					monto_proyectado: total_monto_proyectado,
					monto_pagado: total_monto_pagado,
					monto_no_pagado: total_monto_no_pagado,
					monto: total_monto,
					itemsxDia: itemsXdia,
					agrupadoxDia,
				};
			})
			.sort((a, b) => a.orden - b.orden);

		return {
			...m,
			parametro_grupo_gasto,
			itemsxDia: agruparPorDia(gastos).map((m) => ({
				monto: m.items?.reduce((total, item) => item.monto + total, 0),
				len: m.items?.length,
				...m,
			})),
			gastos,
		};
	});

	return resultado;
};
