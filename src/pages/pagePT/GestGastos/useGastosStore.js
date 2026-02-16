import { PTApi } from '@/common';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewEgresos } from './egresosSlice';
import { arrayFinanzas, arrayTipoIngresos } from '@/types/type';

export const useGastosStore = () => {
	const [dataGasto, setdataGasto] = useState({});
	const [loading, setloading] = useState(false);
	const dispatch = useDispatch();
	const obtenerGastos = async (id_empresa) => {
		console.log({});

		try {
			setloading(true);
			const { data } = await PTApi.get(`/egreso/empresa/${id_empresa}`);
			console.log({ data });
			const dataGastoMap = data.gastos.map((g) => {
				return {
					...g,
					tipo_gasto: arrayFinanzas.find(
						(e) => e.value === g.tb_parametros_gasto?.id_tipoGasto
					)?.label,
					rubro: g.tb_parametros_gasto?.grupo,
					concepto: g.tb_parametros_gasto?.nombre_gasto,
					nombre_proveedor: g.tb_Proveedor?.razon_social_prov,
					forma_pago: g.parametro_forma_pago?.label_param,
				};
			});
			setloading(false);
			dispatch(onSetDataViewEgresos(dataGastoMap));
		} catch (error) {
			console.log(error);
		} finally {
			setloading(false);
		}
	};
	const obtenerGastoxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/egreso/id/${id}`);

			const dataGasto = {
				...data.gasto,
				id_empresa: data.gasto?.tb_parametros_gasto?.id_empresa,
				id_tipoGasto: data.gasto?.tb_parametros_gasto?.id_tipoGasto,
				grupo: data.gasto?.tb_parametros_gasto?.grupo,
			};
			setdataGasto(dataGasto);
		} catch (error) {
			console.log(error);
		}
	};
	const postGasto = async (formState, id_empresa) => {
		try {
			console.log({ id_empresa }, 2);
			await PTApi.post(`/egreso/`, formState);
			await obtenerGastos(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};
	const updateGastoxID = async (id, formState, id_empresa) => {
		try {
			console.log({ id_empresa }, 3);
			await PTApi.put(`/egreso/id/${id}`, formState);
			await obtenerGastos(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};
	const deleteGastoxID = async (id, id_empresa) => {
		try {
			console.log({ id_empresa }, 4);
			await PTApi.put(`/egreso/delete/id/${id}`);
			await obtenerGastos(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		obtenerGastos,
		updateGastoxID,
		deleteGastoxID,
		obtenerGastoxID,
		postGasto,
		dataGasto,
		loading,
	};
};
