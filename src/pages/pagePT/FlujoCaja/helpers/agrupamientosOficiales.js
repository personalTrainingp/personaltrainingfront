import { DateMaskString } from '@/components/CurrencyMask';

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

		const concepto =
			item?.tb_parametros_gasto?.nombre_gasto ?? item?.nombre_gasto ?? 'SIN CONCEPTO';

		if (!map.has(grupo)) map.set(grupo, new Map());
		const mapConceptos = map.get(grupo);

		if (!mapConceptos.has(concepto)) {
			mapConceptos.set(concepto, { concepto, items: [] });
		}

		mapConceptos.get(concepto).items.push(item);
	}

	return Array.from(map.entries()).map(([grupo, mapConceptos]) => ({
		grupo,
		conceptos: Array.from(mapConceptos.values()),
	}));
};
