export const agruparPorMesDiaFechaVenta = (data) => {
	const map = {};

	data.forEach((item) => {
		const fecha = new Date(item.fechaP);
		const anio = fecha.getUTCFullYear();
		const mes = fecha.getUTCMonth() + 1;
		const dia = fecha.getUTCDate();

		const key = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

		if (!map[key]) {
			map[key] = {
				anio,
				mes,
				dia,
				items: [],
			};
		}
		map[key].items.push(item);
	});

	return Object.values(map);
};
