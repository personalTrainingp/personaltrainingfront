export function generarMesYanio(desde, hasta = new Date(), order = 'asc') {
	const result = [];
	let fecha = new Date(desde);

	while (
		fecha.getFullYear() < hasta.getFullYear() ||
		(fecha.getFullYear() === hasta.getFullYear() && fecha.getMonth() <= hasta.getMonth())
	) {
		const mes = fecha.getMonth() + 1;
		const anio = fecha.getFullYear();

		const item = {
			fecha: `${anio}-${mes}`,
			mes,
			anio,
		};

		if (order === 'desc') {
			result.unshift(item); // más reciente primero
		} else {
			result.push(item); // más antiguo primero (default)
		}

		fecha.setMonth(fecha.getMonth() + 1);
	}

	return result;
}
