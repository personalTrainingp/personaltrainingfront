import { DateMaskStr1, DateMaskStr2 } from '@/components/CurrencyMask';

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

export const agruparPorGrupoYConcepto = (dataGastos = [], dataGrupos = []) => {
	// 🔹 Agrupar dataGrupos por grupo
	const gruposMapTemp = {};
	dataGrupos.forEach((entry) => {
		const nombreGrupo = entry?.parametro_grupo?.param_label || 'SIN GRUPO';
		if (!gruposMapTemp[nombreGrupo]) gruposMapTemp[nombreGrupo] = [];
		gruposMapTemp[nombreGrupo].push(entry);
	});
	const gruposOrdenados = Object.entries(gruposMapTemp).sort(([, a], [, b]) => {
		const ordenA = a?.[0]?.parametro_grupo?.orden;
		const ordenB = b?.[0]?.parametro_grupo?.orden;
		return (ordenA ?? Infinity) - (ordenB ?? Infinity);
	});
	// 🔹 Construcción final
	const resultado = gruposOrdenados.map(([grupoNombre, entradasDeGrupo]) => {
		entradasDeGrupo.sort((a, b) => (a?.orden ?? Infinity) - (b?.orden ?? Infinity));

		// 🔹 Data del grupo
		const dataGrupo = dataGastos.filter((g) => {
			const pg = g?.tb_parametros_gasto.parametro_grupo?.param_label || 'SIN GRUPO';
			const grupoGasto = pg;
			return grupoGasto === grupoNombre;
		});

		const itemsGrupo = agruparPorDia(dataGrupo);

		return {
			grupo: grupoNombre,
			data: dataGrupo,
			items: itemsGrupo,
			conceptos: agruparPorConcepto(dataGrupo),
		};
	});
	return resultado;
};

// 1. Agrupa solo por concepto
export const agruparPorConcepto = (data = []) => {
	const map = new Map();

	for (const item of data) {
		const concepto =
			item?.tb_parametros_gasto?.nombre_gasto ?? item?.nombre_gasto ?? 'SIN CONCEPTO';
		const ordenConcepto = item?.tb_parametros_gasto?.orden ?? item?.nombre_gasto ?? 0;

		if (!map.has(concepto)) {
			map.set(concepto, { concepto, ordenConcepto, items: [] });
		}

		map.get(concepto).items.push(item);
	}
	console.log({
		resultado: Array.from(map.values()).map((ar) => {
			return {
				...ar,
				items: agruparPorDia(ar.items),
				data: ar.items,
			};
		}),
	});

	return Array.from(map.values())
		.map((ar) => {
			return {
				...ar,
				items: agruparPorDia(ar.items),
				data: ar.items,
			};
		})
		.sort((a, b) => a.ordenConcepto - b.ordenConcepto);
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
