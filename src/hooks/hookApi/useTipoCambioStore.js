import { PTApi } from '@/common';
import { onSetDataView } from '@/store/data/dataSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useTipoCambioStore = () => {
	const dispatch = useDispatch();
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
			setdataTipoCambio(data.data);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerTipoCambioTabla = async () => {
		try {
			dispatch(onSetDataView([]));
			const { data } = await PTApi.get('/tipocambio/obtener-tipo-cambio');
			dispatch(onSetDataView(data.tipoCambio));
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerTipoCambioTabla,
		obtenerTipoCambioPorFecha,
		obtenerTipoDeCambiosPorRangoDeFechas,
		tipocambio,
		dataTipoCambio,
	};
};
