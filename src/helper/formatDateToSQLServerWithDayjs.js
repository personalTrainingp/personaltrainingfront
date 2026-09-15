import dayjs from 'dayjs';

// Perú es UTC-5 (sin horario de verano). El offset iba con signo invertido
// (+05:00 en vez de -05:00), lo que desplazaba cada fecha 10 horas del valor
// correcto y podía hacer que datos de fin de mes cayeran en el mes siguiente.
export function formatDateToSQLServerWithDayjs(date, isStart = true) {
	const base = dayjs(date);

	const formatted = isStart
		? base.startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[-05:00]')
		: base.endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[-05:00]');

	return formatted;
}
