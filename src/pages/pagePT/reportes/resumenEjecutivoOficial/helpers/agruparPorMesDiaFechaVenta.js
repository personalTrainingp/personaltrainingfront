import { DateMaskStr, DateMaskStr1, DateMaskStr2, DateMaskString } from '@/components/CurrencyMask';

export const agruparPorMesDiaFechaVenta = (data) => {
	const map = {};

	data.forEach((item) => {
		// const fecha = dayjs.utc(item.fecha_venta);
		const fecha = DateMaskStr2(item.fechaP);

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

const agruparPorEmpleado = (data = []) => {
	const map = new Map();

	data.forEach((item) => {
		const key = item.empl || 'SIN EMPLEADO';

		if (!map.has(key)) {
			map.set(key, {
				empl: key,
				montoTotal: 0,
				cantidadTotal: 0,
				items: [],
			});
		}

		const grupo = map.get(key);

		grupo.montoTotal += Number(item.montoTotal || 0);
		grupo.cantidadTotal += Number(item.cantidadTotal || 0);
		grupo.items.push(item);
	});

	return Array.from(map.values());
};
