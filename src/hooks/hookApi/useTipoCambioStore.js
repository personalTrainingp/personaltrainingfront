import { PTApi } from '@/common';
import { useState } from 'react';

export const useTipoCambioStore = () => {
	const [tipocambio, settipocambio] = useState({});
	// const registrarTipoCambio = async(formState)=>{
	//     const {data} = await
	// }
	const obtenerTipoCambioPorFecha = async (fecha_valor) => {
		try {
			const { data } = await PTApi.get('/tipocambio/obtener-tipo-cambio', {
				params: { fecha: fecha_valor },
			});
			settipocambio(data.data);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerTipoCambioPorFecha,
		tipocambio,
	};
};
