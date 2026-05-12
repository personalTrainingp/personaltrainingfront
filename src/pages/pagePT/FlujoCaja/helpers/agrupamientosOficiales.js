import { DateMaskStr1, DateMaskStr2 } from '@/components/CurrencyMask';
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

export const agruparPorGrupoYConcepto = (dataGastos = [], dataGrupos = [], anio = 2026) => {
	const resultado = dataGrupos?.map((m) => {
		const gastos = dataGastos?.filter(
			(f) => f?.tb_parametros_gasto?.parametro_grupo?.id === m.id
		);
		return {
			...m,
			itemsxDia: agruparPorDia(gastos),
			gastos,
			parametro_grupo_gasto: m?.parametro_grupo_gasto?.map((f) => {
				const gast = gastos?.filter((g) => g?.id_gasto === f.id);
				const gastNoPagados = gast.filter((e) => e?.id_estado_gasto === 1424);
				const gastPagados = gast.filter((e) => e?.id_estado_gasto === 1423);
				const proyectado = gast.filter((e) => e?.id_estado_gasto === 1423);
				const itemsXdia = generarMesYanio(
					new Date('2026-01-15T00:00:00.000Z'),
					new Date('2026-12-15T00:00:00.000Z')
				).map((g) => {
					const ItemsGastosAgrupados =
						agruparPorDia(gast).find((f) => f.mes === g.mes)?.items || [];
					const itemsPagados =
						agruparPorDia(gast)
							.find((f) => f.mes === g.mes)
							?.items.filter((e) => e?.id_estado_gasto === 1423) || [];
					const itemsNoPagados =
						agruparPorDia(gast)
							.find((f) => f.mes === g.mes)
							?.items.filter((e) => e?.id_estado_gasto === 1424) || [];
					const monto_proyectado =
						new Date(f.fecha_inicio).getFullYear() <= g.anio && f.sin_limite === true
							? f.monto_proyectado
							: new Date(f.fecha_inicio).getMonth() + 1 <= g.mes
								? f.monto_proyectado
								: 0.0;
					return {
						ItemsGastosAgrupados,
						monto: ItemsGastosAgrupados.reduce((total, item) => item.monto + total, 0),
						items_pagados: itemsPagados,
						itemsNoPagados: itemsNoPagados,
						monto_pagados: itemsPagados.reduce((total, item) => item.monto + total, 0),
						monto_no_pagados: itemsNoPagados.reduce(
							(total, item) => item.monto + total,
							0
						),
						len: ItemsGastosAgrupados.length,
						monto_proyectado,

						...g,
					};
				});
				return {
					id: f.id,
					monto_proyectado: f.monto_proyectado,
					fecha_inicio: f.fecha_inicio,
					fecha_fin: f.fecha_fin,
					sin_limite: f.sin_limite,
					tipo: f.tipo,
					nombre_gasto: f.nombre_gasto,
					gasto: gast,
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
function agruparPorDia(data) {
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
