import { PTApi } from '@/common';
import React from 'react';

export const obtenerTipoDeCambio = async () => {
	const { data: dataTC } = await PTApi.get('/tipoCambio/');
	const dataTCs = dataTC.tipoCambios.map((e, i, arr) => {
		const posteriores = arr
			.filter((item) => new Date(item.fecha) > new Date(e.fecha))
			.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

		const termino = posteriores.length ? posteriores[0].fecha : null;
		return {
			moneda: e.monedaDestino,
			multiplicador: e.precio_venta,
			// monedaOrigen: e.monedaOrigen,
			fecha_inicio_tc: e.fecha,
			fecha_fin_tc: termino, // null si no hay próximo cambio
		};
	});
	return dataTCs;
};
