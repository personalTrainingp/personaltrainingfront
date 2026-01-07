import { PTApi } from '@/common';
import React, { useState } from 'react';
import { agruparPorGrupoYConcepto, aplicarTipoDeCambio } from '../helpers/agrupamientos';

export const useCuentasStore = () => {
	const [dataCuentasBalance, setdataCuentasBalance] = useState([]);
	const obtenerCuentasBalance = async (idEmpresa, tipo) => {
		try {
			const { data } = await PTApi.get(`/cuenta-balance/${idEmpresa}/${tipo}`);

			const { data: dataTC } = await PTApi.get('/tipoCambio/');
			const dataTCs = dataTC.tipoCambios.map((e, i, arr) => {
				const posteriores = arr
					.filter((item) => new Date(item.fecha) > new Date(e.fecha))
					.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

				const termino = posteriores.length ? posteriores[0].fecha : null;
				return {
					moneda: e.monedaDestino,
					multiplicador: e.precio_compra,
					// monedaOrigen: e.monedaOrigen,
					fecha_inicio_tc: e.fecha,
					fecha_fin_tc: termino, // null si no hay próximo cambio
				};
			});
			setdataCuentasBalance((dataTCs, data.cuentasBalances));
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerCuentasBalance,
		dataCuentasBalance,
	};
};
