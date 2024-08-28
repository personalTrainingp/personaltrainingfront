import { PTApi } from '@/common';
import { useState } from 'react';

export const useTipoCambioStore = () => {
	const [tipocambio, settipocambio] = useState({});
	const [dataTipoCambio, setdataTipoCambio] = useState([]);
	// const registrarTipoCambio = async(formState)=>{
	//     const {data} = await
	// }
	const obtenerTipoDeCambiosPorRangoDeFechas = async (arrayDate) => {
		try {
			const { data } = await PTApi.get('/tipocambio/obtener-rango-fechas', {
				params: { arrayDate },
			});

			setdataTipoCambio(data.data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTipoCambioPorFecha = async (fecha_valor) => {
		try {
			const { data } = await PTApi.get('/tipocambio/obtener-tipo-cambio', {
				params: { fecha: fecha_valor },
			});
			setdata(data.data);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerTipoCambioPorFecha,
		obtenerTipoDeCambiosPorRangoDeFechas,
		tipocambio,
		dataTipoCambio,
	};
};
