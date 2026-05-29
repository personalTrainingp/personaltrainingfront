export function generarHoras(inicio, fin, intervaloMinutos) {
	const resultado = [];

	const [horaInicio, minInicio] = inicio.split(':').map(Number);
	const [horaFin, minFin] = fin.split(':').map(Number);

	const fechaInicio = new Date();
	fechaInicio.setHours(horaInicio, minInicio, 0, 0);

	const fechaFin = new Date();
	fechaFin.setHours(horaFin, minFin, 0, 0);

	while (fechaInicio <= fechaFin) {
		const horas = String(fechaInicio.getHours()).padStart(2, '0');
		const minutos = String(fechaInicio.getMinutes()).padStart(2, '0');

		resultado.push({
			horario: `${horas}:${minutos}`,
			hora: horas,
			minutos,
		});

		fechaInicio.setMinutes(fechaInicio.getMinutes() + intervaloMinutos);
	}

	return resultado;
}
