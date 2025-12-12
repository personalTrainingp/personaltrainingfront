import { DateMask, DateMaskString } from '@/components/CurrencyMask';
import dayjs, { utc } from 'dayjs';
dayjs.extend(utc);
const ingExtraCHANGE = [
	{ monto_tarifa: 0, mes: '2024-7', mesNumero: 7 },
	{ monto_tarifa: 0, mes: '2024-8', mesNumero: 8 },
	{ monto_tarifa: 0, mes: '2024-9', mesNumero: 9 },
	{ monto_tarifa: 0, mes: '2024-10', mesNumero: 10 },
	{ monto_tarifa: 0, mes: '2024-11', mesNumero: 11 },
	{ monto_tarifa: 0, mes: '2024-12', mesNumero: 12 },
	{ monto_tarifa: 0, mes: '2025-1', mesNumero: 1 },
	{ monto_tarifa: 0, mes: '2025-2', mesNumero: 2 },
	{ monto_tarifa: 0, mes: '2025-3', mesNumero: 3 },
	{ monto_tarifa: 0, mes: '2025-4', mesNumero: 4 },
	{ monto_tarifa: 0, mes: '2025-5', mesNumero: 5 },
	{ monto_tarifa: 6206.67, mes: '2025-6', mesNumero: 6 },
	{ monto_tarifa: 2941.74, mes: '2025-7', mesNumero: 7 },
	{ monto_tarifa: 7735.49, mes: '2025-8', mesNumero: 8 },
	{ monto_tarifa: 4464.22, mes: '2025-9', mesNumero: 9 },
	{ monto_tarifa: 6781.26, mes: '2025-10', mesNumero: 10 },
	{ monto_tarifa: 10513.91, mes: '2025-11', mesNumero: 11 },
	{ monto_tarifa: 0, mes: '2025-12', mesNumero: 12 },
];
export const agruparVentasPorMes = (ventas = []) => {
	const mapa = ventas.reduce((acc, venta) => {
		// Obtener mes con dayjs → "YYYY-MM"
		const mes = DateMaskString(venta.fecha_venta, 'YYYY-M');

		if (!acc[mes]) acc[mes] = [];
		acc[mes].push(venta);

		return acc;
	}, {});
	return Object.entries(mapa).map(([fecha, items]) => {
		const totalesMes = agruparDetallesVentas(items);
		return {
			fecha,
			mesNumero: fecha.split('-')[1],
			...totalesMes,
			detalle_total_ingextraordCHANGE: ingExtraCHANGE.find((e) => e.mes === fecha)
				?.monto_tarifa,
			// items, // si quieres ver todas las ventas del mes
		};
	});
};

export const agruparDetallesVentas = (ventas) => {
	const DETAIL_CONFIG = [
		{ prop: 'detalle_ventaMembresia', totalKey: 'detalletotal_membresia' },
		{ prop: 'detalle_ventaCitas', totalKey: 'detalletotal_citas' },
		{ prop: 'detalle_ventaProductos', totalKey: 'detalletotal_productos' },
	];

	const sumarTarifa = (detalles = []) =>
		detalles.reduce((acc, item) => acc + (Number(item.tarifa_monto) || 0), 0);

	// Inicializamos totales
	const totalesIniciales = DETAIL_CONFIG.reduce((acc, { totalKey }) => {
		acc[totalKey] = 0;
		return acc;
	}, {});

	// Agregamos tu nuevo total dinámico
	totalesIniciales.detalle_total_productos_17 = 0;
	totalesIniciales.detalle_total_productos_18 = 0;

	const totales = ventas.reduce((acc, venta) => {
		DETAIL_CONFIG.forEach(({ prop, totalKey }) => {
			const detalles = venta[prop] || [];
			acc[totalKey] += sumarTarifa(detalles);
			if (prop === 'detalle_ventaProductos') {
				detalles.forEach((item) => {
					if (item.tb_producto?.id_categoria === 17) {
						acc.detalle_total_productos_17 += Number(item.tarifa_monto) || 0;
					}
					if (item.tb_producto?.id_categoria === 18) {
						acc.detalle_total_productos_18 += Number(item.tarifa_monto) || 0;
					}
				});
			}
		});
		return acc;
	}, totalesIniciales);

	return totales;
};
