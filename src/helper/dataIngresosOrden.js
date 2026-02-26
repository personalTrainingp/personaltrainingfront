export function dataIngresosOrden(dataVentas) {
	const dataVentasMap = dataVentas.map((m) => {
		return {
			...m,
			n_comprabante: m.numero_transac,
			id_cli: m.id_cli,
			id_origen: m.id_origen,
			id_venta: m.id,
			fecha_primaria: m.fecha_venta,
			empl: m?.tb_empleado?.nombres_apellidos_empl || '',
			detalle_membresias: m?.detalle_ventaMembresia || [],
			detalle_productos: m.detalle_ventaProductos || [],
			moneda: 'PEN',
		};
	});
	const dataMembresias = dataVentasMap
		.filter((dventa) => dventa.detalle_membresias?.length !== 0)
		.map((v) => {
			return {
				...v,
				monto: v?.detalle_membresias[0]?.tarifa_monto,
				cantidadTotal: 1,
				concepto: 'MEMBRESIA' || '',
				tb_parametros_gasto: {
					grupo: 'INGRESOS',
					id_empresa: 598,
					nombre_gasto: 'MEMBRESIA',
					parametro_grupo: {
						param_label: 'INGRESOS',
						id_empresa: 598,
					},
				},
			};
		})
		.filter((f) => f.montoTotal !== 0);

	const dataProductos17 = dataVentasMap
		.map((v) => {
			const detalleFiltrado = v.detalle_productos?.filter(
				(p) => p.tb_producto?.id_categoria === 17
			);

			const { cantidadTotal, montoTotal } = detalleFiltrado.reduce(
				(acc, p) => {
					acc.cantidadTotal += Number(p.cantidad || 0);
					acc.montoTotal += Number(p.tarifa_monto || 0);
					return acc;
				},
				{ cantidadTotal: 0, montoTotal: 0 }
			);

			return {
				...v,
				detalle_productos: detalleFiltrado,
				cantidadTotal,
				monto: montoTotal,
				concepto: 'ACCESORIOS',
				tb_parametros_gasto: {
					grupo: 'INGRESOS',
					id_empresa: 598,
					nombre_gasto: 'ACCESORIOS',
					parametro_grupo: {
						param_label: 'INGRESOS',
						id_empresa: 598,
					},
				},
			};
		})
		.filter((v) => v.detalle_productos?.length !== 0);
	const dataProductos18 = dataVentasMap
		.map((v) => {
			const detalleFiltrado = v.detalle_productos.filter(
				(p) => p.tb_producto?.id_categoria === 18
			);

			const { cantidadTotal, montoTotal } = detalleFiltrado.reduce(
				(acc, p) => {
					acc.cantidadTotal += Number(p.cantidad || 0);
					acc.montoTotal += Number(p.tarifa_monto || 0);
					return acc;
				},
				{ cantidadTotal: 0, montoTotal: 0 }
			);

			return {
				...v,
				detalle_productos: detalleFiltrado,
				cantidadTotal,
				monto: montoTotal,
				concepto: 'SUPLEMENTOS',

				tb_parametros_gasto: {
					grupo: 'INGRESOS',
					id_empresa: 598,
					nombre_gasto: 'SUPLEMENTOS',
					parametro_grupo: {
						param_label: 'INGRESOS',
						id_empresa: 598,
					},
				},
			};
		})
		.filter((v) => v.detalle_productos?.length !== 0);
	return {
		dataMembresias,
		dataProductos17,
		dataProductos18,
		dataMembresias,
	};
}
