import { PTApi } from '@/common';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewEgresos } from './egresosSlice';
import { arrayTipoIngresos } from '@/types/type';

export const useGastosStore = () => {
	const [dataGasto, setdataGasto] = useState({});
	const dispatch = useDispatch();
	const obtenerGastos = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(`/egreso/empresa/${id_empresa}`);
			console.log({ data });
			const dataGastoMap = data.gastos.map((g) => {
				return {
					...g,
					tipo_gasto: arrayTipoIngresos.find(
						(e) => e.value === g.tb_parametros_gasto?.id_tipoGasto
					)?.label,
					rubro: g.tb_parametros_gasto?.grupo,
					concepto: g.tb_parametros_gasto?.nombre_gasto,
					nombre_proveedor: g.tb_Proveedor?.razon_social_prov,
					forma_pago: g.parametro_forma_pago?.label_param,
				};
			});
			dispatch(onSetDataViewEgresos(dataGastoMap));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerGastoxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/egreso/id/${id}`);
			setdataGasto(data.gasto);
		} catch (error) {
			console.log(error);
		}
	};
	const updateGastoxID = async (id, formState, id_empresa) => {
		try {
			await PTApi.put(`/egreso/id/${id}`, formState);
			await obtenerGastos(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};
	const deleteGastoxID = async (id, id_empresa) => {
		try {
			await PTApi.put(`/egreso/delete/id/${id}`, formState);
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
		dataGasto,
	};
};
