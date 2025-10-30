import dayjs from 'dayjs';
// ====== FUNCIÓN PRINCIPAL ======
export function resumirConsecutivos(data) {
	const dias = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
	const ordenDias = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];

	const grupos = {};

	data.forEach((item) => {
		const dia = dias[dayjs.utc(item.fecha).day()];
		const key = `${dia}-${item.horario}-${item.minutos}`;

		if (!grupos[key]) {
			grupos[key] = {
				label: dia,
				horario: item.horario.split('.')[0],
				minutos: item.minutos,
				data: [],
			};
		}

		grupos[key].data.push(item);
	});

	// Convertir a array y ordenar por día (lunes a domingo)
	return Object.values(grupos).sort(
		(a, b) => ordenDias.indexOf(a.label) - ordenDias.indexOf(b.label)
	);
}

export function generarIntervalosDesdeInicio(horaInicio, minutosTotales, intervalo) {
	const [hIni, mIni] = horaInicio.split(':').map(Number);
	const inicio = hIni * 60 + mIni;
	const fin = inicio + minutosTotales;
	const resultado = [];

	for (let i = inicio; i <= fin; i += intervalo) {
		const horas = Math.floor(i / 60)
			.toString()
			.padStart(2, '0');
		const minutos = (i % 60).toString().padStart(2, '0');
		const horaFormat = dayjs.utc(`${horas}:${minutos}`, 'hh:mm').format('hh:mm A');
		resultado.push({ label: horaFormat });
	}

	return resultado;
}
export const agruparPorHorarioYMinutos = (arr) => {
	const grupos = {};

	arr.forEach((item) => {
		const key = `${item.horario}-${item.minutos}`;
		if (!grupos[key]) {
			grupos[key] = {
				horario: item.horario,
				minutos: item.minutos,
				labels: [],
				items: [],
			};
		}

		grupos[key].labels.push(item.label);
		grupos[key].items.push(...item.data);
	});

	return Object.values(grupos).map((grupo) => {
		const labels = grupo.labels;
		const labelTexto =
			labels.length > 1
				? labels.slice(0, -1).join(', ') + ' Y ' + labels.slice(-1)
				: labels[0];

		return {
			label:
				labelTexto === 'LUNES, MARTES, MIÉRCOLES, JUEVES Y VIERNES'
					? 'LUNES A VIERNES'
					: labelTexto,
			horario: grupo.horario,
			minutos: grupo.minutos,
			horarios: generarIntervalosDesdeInicio(grupo?.horario, grupo?.minutos, 30),
			items: grupo.items,
		};
	});
};

export function generarIntervalos(horaInicio, horaFin, intervalo) {
	const [hIni, mIni] = horaInicio.split(':').map(Number);
	const [hFin, mFin] = horaFin.split(':').map(Number);

	const inicio = hIni * 60 + mIni;
	const fin = hFin * 60 + mFin;
	const resultado = [];

	for (let i = inicio; i <= fin; i += intervalo) {
		const horas = Math.floor(i / 60)
			.toString()
			.padStart(2, '0');
		const minutos = (i % 60).toString().padStart(2, '0');
		const horaFormat = dayjs.utc(`${horas}:${minutos}`, 'hh:mm').format('hh:mm A');
		resultado.push({ label: horaFormat });
	}

	return resultado;
}
