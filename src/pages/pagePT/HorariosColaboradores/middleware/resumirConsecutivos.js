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
			label: labelTexto==='LUNES, MARTES, MIÉRCOLES, JUEVES Y VIERNES'?'LUNES A VIERNES':labelTexto,
			horario: grupo.horario,
			minutos: grupo.minutos,
			items: grupo.items,
		};
	});
};
