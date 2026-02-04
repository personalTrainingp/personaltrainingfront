import { DateMask, DateMaskString } from '@/components/CurrencyMask';
import dayjs, { utc } from 'dayjs';
dayjs.extend(utc);
export const agruparVentasPorMes = (ingresos = []) => {
	const mapa = ingresos.reduce((acc, ingreso) => {
		// Obtener mes con dayjs → "YYYY-MM"
		const mes = DateMaskString(ingreso.fecha_comprobante, 'YYYY-M');

		if (!acc[mes]) acc[mes] = [];
		acc[mes].push(ingreso);

		return acc;
	}, {});
	return Object.entries(mapa).map(([fecha, items]) => {
		return {
			fecha,
			mesNumero: fecha.split('-')[1],
			items, // si quieres ver todas las ventas del mes
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
