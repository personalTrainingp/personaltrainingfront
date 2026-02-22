import { DateMaskStr1, DateMaskStr2 } from '@/components/CurrencyMask';

export function aplicarTipoDeCambio(dataTC, data) {
	return data?.map((item) => {
		const fechaGasto = DateMaskStr2(item.fecha_primaria);

		const tcMatch = dataTC.find((tc) => {
			if (tc.moneda === item.moneda) return false;

			const inicio = DateMaskStr2(tc.fecha_inicio_tc);
			// Debe ser posterior o igual al inicio
			if (fechaGasto < inicio) return false;

			// Si hay fecha_fin_tc, también debe ser ≤ fin
			if (tc.fecha_fin_tc) {
				const fin = DateMaskStr2(tc.fecha_fin_tc);
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

export const agruparPorGrupo = (data = []) => {
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
		itemsxDias: agruparPorDia(items),
		data: items
			.filter((d) => d.id_estado_gasto === 1423)
			.map((m) => {
				return {
					...m,
					montoAntiguo: m.monto,
					monto: m.monto * m.tc,
				};
			}),
		montoTotal: items
			.filter((d) => d.id_estado_gasto === 1423)
			.reduce((total, item) => total + item.monto, 0),
		dataPagosPendientes: items.filter((d) => d.id_estado_gasto === 1424),
	}));
};
function agruparPorDia(data) {
	const map = {};

	data.forEach((item) => {
		// const fecha = dayjs.utc(item.fecha_venta);
		const fecha = DateMaskStr2(item?.fecha_primaria);
		console.log({ fecha, it: item?.fecha_primaria, ik: 1 });

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
