export function generarMesYanio(desde, hasta = new Date()) {
	const result = [];
	let fecha = new Date(desde);

	while (
		fecha.getFullYear() < hasta?.getFullYear() ||
		(fecha.getFullYear() === hasta?.getFullYear() && fecha.getMonth() <= hasta.getMonth())
	) {
		const mes = fecha.getMonth() + 1;
		const anio = fecha.getFullYear();

		result.unshift({
			fecha: `${anio}-${mes}`,
			mes,
			anio,
		});

		fecha.setMonth(fecha.getMonth() + 1);
	}

	return result;
}
