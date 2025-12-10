export const agruparVentasPorMes = (ventas = []) => {
	const mapa = ventas.reduce((acc, venta) => {
		const mes = new Date(venta.fecha_venta).toISOString().slice(0, 7); // YYYY-MM

		if (!acc[mes]) acc[mes] = [];
		acc[mes].push(venta);

		return acc;
	}, {});

	return Object.entries(mapa).map(([fecha, items]) => {
		// totales de TODAS las ventas de ese mes
		const totalesMes = agruparDetallesVentas(items);

		return {
			fecha,
			items, // sigues teniendo todas las ventas del mes
			...totalesMes, // se añaden: detalletotal_membresia, detalletotal_citas, detalletotal_productos
		};
	});
};

export const agruparDetallesVentas = (ventas) => {
	// Config: aquí agregas/quitas tipos de detalle sin tocar la lógica
	const DETAIL_CONFIG = [
		{ prop: 'detalle_ventaMembresia', totalKey: 'detalletotal_membresia' },
		{ prop: 'detalle_ventaCitas', totalKey: 'detalletotal_citas' },
		{ prop: 'detalle_ventaProductos', totalKey: 'detalletotal_productos' },
	];

	// Suma tarifa_monto de un array de detalles
	const sumarTarifa = (detalles = []) =>
		detalles.reduce((acc, item) => acc + (Number(item.tarifa_monto) || 0), 0);

	// Inicializamos el objeto de totales en 0
	const totalesIniciales = DETAIL_CONFIG.reduce((acc, { totalKey }) => {
		acc[totalKey] = 0;
		return acc;
	}, {});

	// Recorremos TODAS las ventas y acumulamos
	const totales = ventas.reduce((acc, venta) => {
		DETAIL_CONFIG.forEach(({ prop, totalKey }) => {
			const detalles = venta[prop] || [];
			acc[totalKey] += sumarTarifa(detalles);
		});
		return acc;
	}, totalesIniciales);

	return totales; // { detalletotal_membresia, detalletotal_citas, detalletotal_productos }
};
