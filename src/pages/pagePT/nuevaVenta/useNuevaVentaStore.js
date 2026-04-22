import { PTApi } from '@/common';
import { useState } from 'react';

export const useNuevaVentaStore = () => {
	const [ultimaComprobante, setultimaComprobante] = useState({});
	const obtenerUltimaVentaxComprobante = async (id_comprobante) => {
		try {
			const { data } = await PTApi.get(
				`/venta/obtener-ventas-x-comprobante/${id_comprobante}/598`
			);
			setultimaComprobante(data.ventas);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerUltimaVentaxComprobante,
		ultimaComprobante,
	};
};
