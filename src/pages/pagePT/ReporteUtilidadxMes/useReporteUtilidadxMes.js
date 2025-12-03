import { PTApi } from '@/common';
import React, { useState } from 'react';
import { agruparPorMesVentas } from './helper/agruparPorMes';

export const useReporteUtilidadxMes = () => {
	const [dataGasto, setdataGasto] = useState([]);
	const [dataVenta, setdataVenta] = useState([]);
	const obtenerVentas = async (id_empresa) => {
		try {
			const { data: dataVentas } = await PTApi.get(`/egreso/get-egresos/${id_empresa}`);
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerGastos = async (id_empresa) => {
		try {
			const { data: dataGasto } = await PTApi.get(`/egreso/get-egresos/${id_empresa}`);
			setdataGasto(agruparPorMesVentas(dataGasto.gastos));
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerVentas,
		obtenerGastos,
		dataGasto,
	};
};
