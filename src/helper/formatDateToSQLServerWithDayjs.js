import dayjs from 'dayjs';

export function formatDateToSQLServerWithDayjs(date, isStart = true) {
	const base = dayjs(date);

	const formatted = isStart
		? base.startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[-05:00]')
		: base.endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[+05:00]');

	return formatted;
}
