import { DateMaskStr, DateMaskString } from '@/components/CurrencyMask';

export function aplicarTipoDeCambio(dataTC, data) {
	return data?.map((item) => {
		const fechaGasto = DateMaskString(item.fecha_primaria);

		const tcMatch = dataTC.find((tc) => {
			if (tc.moneda === item.moneda) return false;

			const inicio = DateMaskString(tc.fecha_inicio_tc);
			// Debe ser posterior o igual al inicio
			if (fechaGasto < inicio) return false;

			// Si hay fecha_fin_tc, también debe ser ≤ fin
			if (tc.fecha_fin_tc) {
				const fin = DateMaskString(tc.fecha_fin_tc);
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

export const agruparPorGrupoYConcepto = (data = []) => {
	const map = new Map();

	for (const item of data) {
		const grupo =
			item?.tb_parametros_gasto?.tb_parametro_grupo?.param_label ??
			item?.tb_parametros_gasto?.grupo ??
			item?.grupo ??
			'SIN GRUPO';

		if (!map.has(grupo)) {
			map.set(grupo, []);
		}

		map.get(grupo).push(item);
	}

	return Array.from(map.entries()).map(([grupo, items]) => ({
		grupo,
		conceptos: agruparPorConcepto(items),
		itemsxDias: agruparPorDia(items),
		data: items
	}));
};

// 1. Agrupa solo por concepto
export const agruparPorConcepto = (data = []) => {
	const map = new Map();

	for (const item of data) {
		const concepto =
			item?.tb_parametros_gasto?.nombre_gasto ?? item?.nombre_gasto ?? 'SIN CONCEPTO';

		if (!map.has(concepto)) {
			map.set(concepto, { concepto, items: [] });
		}

		map.get(concepto).items.push(item);
	}
	return Array.from(map.values()).map((ar) => {
		return {
			...ar,
			items: agruparPorDia(ar.items),
		};
	});
};

function agruparPorDia(data) {
	const map = {};

	data.forEach((item) => {
		// const fecha = dayjs.utc(item.fecha_venta);
		const fecha = DateMaskStr(item.fecha_primaria);

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

	return Object.values(map);
}
