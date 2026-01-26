function agruparDiasEnMes(params) {}

export const agruparPorEmpleado = (arr = []) =>
	Object.values(
		(arr || []).reduce((acc, item) => {
			if (!item?.empl) return acc; // ignora vacíos {}, null, etc.

			const key = item.empl.trim();
			(acc[key] ??= { nombre_empl: key, items: [] }).items.push(item);

			return acc;
		}, {})
	);
