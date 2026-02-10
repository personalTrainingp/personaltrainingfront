import { DateMaskStr, DateMaskStr1, DateMaskString } from '@/components/CurrencyMask';

export const agruparPorMesDiaFechaVenta = (data) => {
	const map = {};

	data.forEach((item) => {
		// const fecha = dayjs.utc(item.fecha_venta);
		const fecha = DateMaskStr1(item.fechaP);

		const anio = fecha.year();
		const mes = fecha.month() + 1; // 0–11 → 1–12
		const dia = fecha.date();

		const key = fecha.format('YYYY-MM-DD');

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
