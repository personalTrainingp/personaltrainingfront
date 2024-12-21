import { PTApi } from '@/common';
import { useState } from 'react';

export const useTerminologiaPagos = () => {
	const [dataFormaPagos, setdataFormaPagos] = useState([]);
	const obtenerFormasPagos = async () => {
		const { data } = await PTApi.get('/parametros/get_params/forma_pago');
		console.log(data);

		// setdataFormaPagos(data.audit);
	};
	return {
		obtenerFormasPagos,
		dataFormaPagos,
	};
};
