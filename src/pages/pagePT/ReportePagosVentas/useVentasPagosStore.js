import { PTApi } from '@/common';
import React, { useState } from 'react';

export const useVentasPagosStore = () => {
	const [dataPagosVentas, setdataPagosVentas] = useState([]);
	const obtenerPagosVentas = async () => {
		try {
			const { data } = await PTApi.get('/venta/pagos-venta');
            
			setdataPagosVentas(data?.ventasConPagos);
		} catch (error) {
			console.log(error);
		}
	};
    
	return {
		obtenerPagosVentas,
		dataPagosVentas,
	};
};
