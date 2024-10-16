import { PTApi } from '@/common';
import { onGetHistoryImpues, onGetImpuestos } from '@/store/dataImpuesto/impuestoSlice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

export const useImpuestosStore = () => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [obtenerImpuestoHoy, setobtenerImpuestoHoy] = useState('');
	const obtenerImpuesto = async () => {
		try {
			setIsLoading(true);
			const { data } = await PTApi.get('/impuestos/get_impuesto');
			setIsLoading(false);
			dispatch(onGetImpuestos(data.impuestos));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerHistoricoImpuesto = async (id_impuesto) => {
		try {
			const { data } = await PTApi.get(`/impuestos/history/get_impuesto/${id_impuesto}`);
			dispatch(onGetHistoryImpues(data.historia));
		} catch (error) {
			console.log(error);
		}
	};
	const registerCambioenImpues = async (id_impuesto, formState) => {
		try {
			const { data } = await PTApi.post(`/impuestos/history/post_impuesto/${id_impuesto}`, {
				multiplicador: formState.multiplicador_imp,
				fec_inicio: new Date(),
				fec_fin: new Date('01-01-3100'),
			});
			obtenerHistoricoImpuesto();
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerIgvHoy = async () => {
		try {
			const { data } = await PTApi.get('/impuestos/igv/obtener-impuesto-hoy');
			console.log(data);
			setobtenerImpuestoHoy(data.ImpuestoActual.multiplicador);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerImpuesto,
		obtenerHistoricoImpuesto,
		registerCambioenImpues,
		obtenerIgvHoy,
		isLoading,
		obtenerImpuestoHoy,
	};
};
