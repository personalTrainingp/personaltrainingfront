export const agruparPorMes = (data = []) => {
	return Object.values(
		data?.reduce((acc, { anio, mes, items }) => {
			const key = `${anio}-${mes}`;

			if (!acc[key]) {
				acc[key] = { anio, mes, items: [] };
			}

			acc[key].items.push(...items);

			return acc;
		}, {})
	);
};
