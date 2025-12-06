export const agruparPorMesAnio = (data) => {
	return Object.values(
		data.reduce((acc, item) => {
			const fecha = new Date(item.fecha_venta);
			const mes = String(fecha.getMonth() + 1).padStart(2, '0');
			const anio = fecha.getFullYear();
			const key = `${mes}/${anio}`;

			if (!acc[key]) acc[key] = { fecha: key, items: [] };
			acc[key].items.push(item);

			return acc;
		}, {})
	);
};

export const agruparPorIdOrigen = (data) => {
	return Object.values(
		data.reduce((acc, item) => {
			const key = item.id_origen ?? 0; // si no existe, lo pone como 0

			if (!acc[key]) acc[key] = { id_origen: key, items: [] };
			acc[key].items.push(item);

			return acc;
		}, {})
	);
};
