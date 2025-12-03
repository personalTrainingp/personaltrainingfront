import dayjs from 'dayjs';
export const agruparPorMes = (data) => {
	return Object.values(
		data.reduce((acc, item) => {
			const mes = dayjs.utc(item.fec_pago, 'YYYY-MM-DD').format('YYYY-MM');

			acc[mes] ??= { mes: mes, monto: 0, items: [] };

			acc[mes].monto += Number(item.monto) || 0;
			acc[mes].items.push(item);

			return acc;
		}, {})
	);
};

export const agruparPorMesVentas = (data) => {
	return Object.values(
		data.reduce((acc, item) => {
			const mes = dayjs.utc(item.fec_pago, 'YYYY-MM-DD').format('YYYY-MM');

			acc[mes] ??= { mes: mes, monto: 0, items: [] };

			acc[mes].monto += Number(item.monto) || 0;
			acc[mes].items.push(item);

			return acc;
		}, {})
	);
};
