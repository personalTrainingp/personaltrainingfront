import { PTApi } from '@/common';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onSetDataViewAportes } from '../Store/AporteSlice';
import { onSetParametrosGastos } from '@/store/dataGastos/gastosSlice';

export const useGestionAportes = () => {
	const dispatch = useDispatch();
	const [dataIngreso, setdataIngreso] = useState([]);
	const obtenerGestionAporte = async (id_empresa) => {
		try {
			const { data } = await PTApi.get(`/ingreso/${id_empresa}`);
			dispatch(onSetDataViewAportes(data?.ingresos));
		} catch (error) {
			console.log(error);
		}
	};
	const obtenerIngresoxID = async (id) => {
		try {
			const { data } = await PTApi.get(`/ingreso/id/${id}`);
			setdataIngreso(data.ingreso);
		} catch (error) {
			console.log(error);
		}
	};
	const onPostGestionAporte = async (formState, id_empresa) => {
		try {
			const { data } = await PTApi.post('/ingreso/', formState);
			console.log({ formState });

			await obtenerGestionAporte(id_empresa);
		} catch (error) {
			console.log(error);
		}
	};

	const obtenerParametrosGastosFinanzas = async (tipo) => {
		try {
			let { data } = await PTApi.get(`/parametros/get_params/params-tb-finanzas/1573`);
			data = data.reduce((acc, curr) => {
				let empresa = acc.find((e) => e.id_empresa === curr.id_empresa);
				if (!empresa) {
					empresa = {
						id_empresa: curr.id_empresa,
						tipo_gasto: [],
					};
					acc.push(empresa);
				}

				let tipoGasto = empresa.tipo_gasto.find(
					(tg) => tg.id_tipoGasto === curr.id_tipoGasto
				);
				if (!tipoGasto) {
					tipoGasto = {
						id_tipoGasto: curr.id_tipoGasto,
						grupos: [],
					};
					empresa.tipo_gasto.push(tipoGasto);
				}
				let grupo = tipoGasto.grupos.find((g) => g.label === curr.grupo);
				if (!grupo) {
					grupo = {
						label: curr.grupo,
						value: curr.grupo,
						conceptos: [],
					};
					tipoGasto.grupos.push(grupo);
				}
				grupo.conceptos.push({
					label: curr.nombre_gasto,
					value: curr.id,
				});
				return acc;
			}, []);
			dispatch(onSetParametrosGastos(data));
		} catch (error) {
			console.log('Error en useProductoStore', error);
		}
	};
	return {
		dataIngreso,
		obtenerIngresoxID,
		onPostGestionAporte,
		obtenerGestionAporte,
		obtenerParametrosGastosFinanzas,
	};
};
